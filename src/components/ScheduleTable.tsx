/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FestivalSession } from '../types';
import { exportSessionsToCSV } from '../utils/csv';

interface ScheduleTableProps {
  sessions: FestivalSession[];
  onDeleteSession: (sessionId: string) => void;
  onClearAllSessions?: () => void;
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({
  sessions,
  onDeleteSession,
  onClearAllSessions,
}) => {
  const handleDownloadCSV = () => {
    exportSessionsToCSV(sessions);
  };

  return (
    <section aria-labelledby="schedule-table-heading" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-[#e5e0d8] pb-2 gap-2">
        <div>
          <h2 id="schedule-table-heading" className="text-xl font-bold text-[#1b4332]">
            我的場次表
          </h2>
          <p className="text-sm text-[#4b5563] mt-0.5">
            依開始時間排序。
          </p>
        </div>

        <div className="flex items-center gap-2">
          {sessions.length > 0 && (
            <button
              type="button"
              onClick={handleDownloadCSV}
              className="px-3 py-1.5 bg-[#1b4332] text-white text-xs font-semibold border border-[#1b4332] hover:bg-[#143527] cursor-pointer"
            >
              下載場次表
            </button>
          )}

          {sessions.length > 0 && onClearAllSessions && (
            <button
              type="button"
              onClick={onClearAllSessions}
              className="px-3 py-1.5 bg-white text-[#991b1b] text-xs font-semibold border border-[#ef4444] hover:bg-[#fef2f2] cursor-pointer"
            >
              清空場次
            </button>
          )}
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="border border-[#e5e0d8] bg-white p-8 text-center text-[#4b5563]">
          <p className="text-base font-semibold text-[#1f2937]">目前尚無場次</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* 電腦與平板表格檢視 */}
          <div className="hidden sm:block overflow-x-auto border border-[#e5e0d8] bg-white">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[#f2f7f4] border-b border-[#e5e0d8] text-[#1b4332]">
                  <th scope="col" className="p-3 font-bold text-center w-14">序號</th>
                  <th scope="col" className="p-3 font-bold">電影名稱</th>
                  <th scope="col" className="p-3 font-bold">時段 (開始～結束)</th>
                  <th scope="col" className="p-3 font-bold">規劃放映</th>
                  <th scope="col" className="p-3 font-bold">休息整場</th>
                  <th scope="col" className="p-3 font-bold">總時長</th>
                  <th scope="col" className="p-3 font-bold text-center w-20">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ede6]">
                {sessions.map((session, index) => (
                  <tr key={session.id} className="hover:bg-[#faf9f5]">
                    <td className="p-3 text-center text-xs font-mono font-bold text-[#6b7280]">
                      #{index + 1}
                    </td>
                    <td className="p-3 font-semibold text-[#1f2937]">
                      {session.movieTitle}
                    </td>
                    <td className="p-3 font-mono font-medium text-[#1b4332]">
                      {session.startTime} ～ {session.endTime}
                    </td>
                    <td className="p-3 text-[#4b5563]">
                      {session.durationMinutes} 分鐘
                    </td>
                    <td className="p-3 text-[#4b5563]">
                      {session.breakMinutes} 分鐘
                    </td>
                    <td className="p-3 font-medium text-[#1f2937]">
                      {session.totalMinutes} 分鐘
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => onDeleteSession(session.id)}
                        aria-label={`刪除場次：${session.movieTitle}（${session.startTime}）`}
                        className="px-2 py-1 text-xs text-[#991b1b] border border-[#fca5a5] bg-[#fff5f5] hover:bg-[#fee2e2] cursor-pointer"
                      >
                        刪除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 手機直向卡片檢視 */}
          <div className="sm:hidden space-y-3">
            {sessions.map((session, index) => (
              <div
                key={session.id}
                className="border border-[#e5e0d8] bg-white p-3.5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 bg-[#f2f7f4] text-[#1b4332] border border-[#1b4332]">
                    場次 {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => onDeleteSession(session.id)}
                    aria-label={`刪除場次：${session.movieTitle}（${session.startTime}）`}
                    className="px-2.5 py-1 text-xs text-[#991b1b] border border-[#fca5a5] bg-[#fff5f5] hover:bg-[#fee2e2] cursor-pointer font-medium"
                  >
                    刪除
                  </button>
                </div>

                <div className="text-base font-bold text-[#1f2937]">
                  {session.movieTitle}
                </div>

                <div className="text-sm font-mono font-semibold text-[#1b4332] bg-[#fbf9f5] p-2 border border-[#e5e0d8]">
                  時段：{session.startTime} ～ {session.endTime}
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs text-[#4b5563] pt-1">
                  <div>
                    <span className="block text-[#6b7280]">規劃放映</span>
                    <span className="font-semibold text-[#1f2937]">{session.durationMinutes} 分鐘</span>
                  </div>
                  <div>
                    <span className="block text-[#6b7280]">休息</span>
                    <span className="font-semibold text-[#1f2937]">{session.breakMinutes} 分鐘</span>
                  </div>
                  <div>
                    <span className="block text-[#6b7280]">總時長</span>
                    <span className="font-semibold text-[#1f2937]">{session.totalMinutes} 分鐘</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 底部場次計數 */}
          <div className="p-3 bg-[#fcfbf7] border border-[#e5e0d8] text-xs text-[#4b5563]">
            共 <strong>{sessions.length}</strong> 場
          </div>
        </div>
      )}
    </section>
  );
};
