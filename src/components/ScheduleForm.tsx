/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FestivalSession, DEFAULT_MOVIES } from '../types';
import {
  timeStringToMinutes,
  minutesToTimeString,
  findSessionConflict,
} from '../utils/time';

interface ScheduleFormProps {
  existingSessions: FestivalSession[];
  onAddSession: (session: FestivalSession) => void;
  selectedMovieId?: string;
  onClearSelectedMovieId?: () => void;
}

interface FormErrors {
  movieId?: string;
  startTime?: string;
  durationMinutes?: string;
  breakMinutes?: string;
  general?: string;
}

export const ScheduleForm: React.FC<ScheduleFormProps> = ({
  existingSessions,
  onAddSession,
  selectedMovieId,
  onClearSelectedMovieId,
}) => {
  const [movieId, setMovieId] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('13:00');
  const [durationInput, setDurationInput] = useState<string>('110');
  const [breakInput, setBreakInput] = useState<string>('20');

  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>('');

  // 監聽外部選擇的電影
  useEffect(() => {
    if (selectedMovieId) {
      setMovieId(selectedMovieId);
      setErrors((prev) => ({ ...prev, movieId: undefined }));
      if (onClearSelectedMovieId) {
        onClearSelectedMovieId();
      }
    }
  }, [selectedMovieId, onClearSelectedMovieId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    const newErrors: FormErrors = {};

    // 1. 驗證選片
    if (!movieId) {
      newErrors.movieId = '請選擇電影。';
    }

    const movie = DEFAULT_MOVIES.find((m) => m.id === movieId);
    if (!movie && movieId) {
      newErrors.movieId = '請選擇片單中的電影。';
    }

    // 2. 驗證開始時間
    if (!startTime || startTime.trim() === '') {
      newErrors.startTime = '請輸入開始時間。';
    }

    const startMinutes = timeStringToMinutes(startTime);
    if (startMinutes === null) {
      newErrors.startTime = '時間格式需為 24 小時制（例如 14:00）。';
    }

    // 3. 驗證規劃長度
    if (!durationInput || durationInput.trim() === '') {
      newErrors.durationMinutes = '請填寫規劃長度。';
    } else {
      const durNum = Number(durationInput);
      if (!Number.isInteger(durNum) || durNum <= 0) {
        newErrors.durationMinutes = '規劃長度需為大於 0 的正整數。';
      } else if (durNum > 600) {
        newErrors.durationMinutes = '規劃長度請勿超過 600 分鐘。';
      }
    }

    // 4. 驗證休息時間
    if (breakInput === '' || breakInput.trim() === '') {
      newErrors.breakMinutes = '請填寫休息時間（不休息填 0）。';
    } else {
      const brkNum = Number(breakInput);
      if (!Number.isInteger(brkNum) || brkNum < 0) {
        newErrors.breakMinutes = '休息時間需為 0 或正整數。';
      } else if (brkNum > 300) {
        newErrors.breakMinutes = '休息時間請勿超過 300 分鐘。';
      }
    }

    // 若有單一欄位基礎格式錯誤，中止並顯示錯誤
    if (Object.keys(newErrors).length > 0 || startMinutes === null || !movie) {
      setErrors(newErrors);
      return;
    }

    const durationNum = Number(durationInput);
    const breakNum = Number(breakInput);
    const totalMinutes = durationNum + breakNum;
    const endMinutes = startMinutes + totalMinutes;

    // 5. 當日 24:00 邊界檢查
    if (endMinutes > 1440) {
      newErrors.general = `結束時間已超過當日 24:00，請調整開始時間或長度。`;
      setErrors(newErrors);
      return;
    }

    // 6. 重疊檢查
    const conflictSession = findSessionConflict(
      startMinutes,
      endMinutes,
      existingSessions
    );

    if (conflictSession) {
      newErrors.general = `時段重疊：與「${conflictSession.movieTitle}」（${conflictSession.startTime}～${conflictSession.endTime}）時間重疊。`;
      setErrors(newErrors);
      return;
    }

    // 全部驗證通過，建立新場次
    const endTimeStr = minutesToTimeString(endMinutes);
    const newSession: FestivalSession = {
      id: `session-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      movieId: movie.id,
      movieTitle: movie.title,
      startTime,
      durationMinutes: durationNum,
      breakMinutes: breakNum,
      totalMinutes,
      endTime: endTimeStr,
      createdAt: Date.now(),
    };

    onAddSession(newSession);

    // 清空錯誤並提供成功提示
    setErrors({});
    setSuccessMessage(`已加入場次：「${movie.title}」${startTime}～${endTimeStr}。`);
  };

  return (
    <section aria-labelledby="schedule-form-heading" className="space-y-4">
      <div className="border-b border-[#e5e0d8] pb-2">
        <h2 id="schedule-form-heading" className="text-xl font-bold text-[#1b4332]">
          排定場次
        </h2>
        <p className="text-sm text-[#4b5563] mt-1">
          規劃長度由你填寫，不是官方片長。
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="border border-[#e5e0d8] bg-white p-4 sm:p-5 space-y-4"
      >
        {/* 錯誤或成功提示 */}
        <div
          role="status"
          aria-live="polite"
          className="transition-none"
        >
          {errors.general && (
            <div className="p-3 border border-[#b91c1c] bg-[#fef2f2] text-[#991b1b] text-sm">
              <span className="font-bold mr-1">無法加入：</span>
              {errors.general}
            </div>
          )}

          {successMessage && (
            <div className="p-3 border border-[#1b4332] bg-[#f2f7f4] text-[#1b4332] text-sm font-medium">
              <span className="font-bold mr-1">✓</span>
              {successMessage}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 電影 */}
          <div>
            <label
              htmlFor="field-movie"
              className="block text-sm font-bold text-[#1f2937] mb-1"
            >
              電影
            </label>
            <select
              id="field-movie"
              value={movieId}
              onChange={(e) => {
                setMovieId(e.target.value);
                if (errors.movieId) {
                  setErrors((prev) => ({ ...prev, movieId: undefined }));
                }
              }}
              className={`w-full border p-2 text-sm bg-white text-[#1f2937] ${
                errors.movieId ? 'border-[#b91c1c] bg-[#fff5f5]' : 'border-[#d1d5db]'
              }`}
            >
              <option value="">-- 請選擇電影 --</option>
              {DEFAULT_MOVIES.map((movie) => (
                <option key={movie.id} value={movie.id}>
                  {movie.title} ({movie.englishTitle})
                </option>
              ))}
            </select>
            {errors.movieId && (
              <p className="text-xs text-[#b91c1c] mt-1 font-medium">
                {errors.movieId}
              </p>
            )}
          </div>

          {/* 開始時間 */}
          <div>
            <label
              htmlFor="field-start-time"
              className="block text-sm font-bold text-[#1f2937] mb-1"
            >
              開始時間
            </label>
            <input
              id="field-start-time"
              type="time"
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
                if (errors.startTime) {
                  setErrors((prev) => ({ ...prev, startTime: undefined }));
                }
              }}
              className={`w-full border p-2 text-sm bg-white text-[#1f2937] ${
                errors.startTime ? 'border-[#b91c1c] bg-[#fff5f5]' : 'border-[#d1d5db]'
              }`}
            />
            {errors.startTime && (
              <p className="text-xs text-[#b91c1c] mt-1 font-medium">
                {errors.startTime}
              </p>
            )}
          </div>

          {/* 規劃長度（分鐘） */}
          <div>
            <label
              htmlFor="field-duration"
              className="block text-sm font-bold text-[#1f2937] mb-1"
            >
              規劃長度（分鐘）
            </label>
            <input
              id="field-duration"
              type="number"
              min="1"
              step="1"
              value={durationInput}
              onChange={(e) => {
                setDurationInput(e.target.value);
                if (errors.durationMinutes) {
                  setErrors((prev) => ({ ...prev, durationMinutes: undefined }));
                }
              }}
              placeholder="例如 110"
              className={`w-full border p-2 text-sm bg-white text-[#1f2937] ${
                errors.durationMinutes
                  ? 'border-[#b91c1c] bg-[#fff5f5]'
                  : 'border-[#d1d5db]'
              }`}
            />
            {errors.durationMinutes && (
              <p className="text-xs text-[#b91c1c] mt-1 font-medium">
                {errors.durationMinutes}
              </p>
            )}
          </div>

          {/* 休息（分鐘） */}
          <div>
            <label
              htmlFor="field-break"
              className="block text-sm font-bold text-[#1f2937] mb-1"
            >
              休息（分鐘）
            </label>
            <input
              id="field-break"
              type="number"
              min="0"
              step="1"
              value={breakInput}
              onChange={(e) => {
                setBreakInput(e.target.value);
                if (errors.breakMinutes) {
                  setErrors((prev) => ({ ...prev, breakMinutes: undefined }));
                }
              }}
              placeholder="例如 20"
              className={`w-full border p-2 text-sm bg-white text-[#1f2937] ${
                errors.breakMinutes
                  ? 'border-[#b91c1c] bg-[#fff5f5]'
                  : 'border-[#d1d5db]'
              }`}
            />
            {errors.breakMinutes && (
              <p className="text-xs text-[#b91c1c] mt-1 font-medium">
                {errors.breakMinutes}
              </p>
            )}
          </div>
        </div>

        {/* 提交按鈕 */}
        <div className="pt-2 border-t border-[#f0ede6]">
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#1b4332] text-white text-sm font-bold border border-[#1b4332] hover:bg-[#143527] cursor-pointer"
          >
            加入場次
          </button>
        </div>
      </form>
    </section>
  );
};
