/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FestivalSession } from './types';
import { loadFavorites, saveFavorites, loadSessions, saveSessions } from './utils/storage';
import { sortSessions } from './utils/time';
import { NoticeBanner } from './components/NoticeBanner';
import { MovieSection } from './components/MovieSection';
import { ScheduleForm } from './components/ScheduleForm';
import { ScheduleTable } from './components/ScheduleTable';

export default function App() {
  // 收藏清單狀態 (電影 ID 陣列)
  const [favorites, setFavorites] = useState<string[]>([]);
  // 排定場次狀態
  const [sessions, setSessions] = useState<FestivalSession[]>([]);
  // 用於從電影卡片快速跳轉至排程表單
  const [selectedMovieId, setSelectedMovieId] = useState<string>('');
  // 紀錄是否已完成初次載入
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // 初次載入讀取本機 localStorage
  useEffect(() => {
    const loadedFavs = loadFavorites();
    const loadedSess = loadSessions();
    setFavorites(loadedFavs);
    setSessions(sortSessions(loadedSess));
    setIsLoaded(true);
  }, []);

  // 收藏變更時寫入本機 localStorage
  const handleToggleFavorite = (movieId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(movieId);
      const next = exists ? prev.filter((id) => id !== movieId) : [...prev, movieId];
      saveFavorites(next);
      return next;
    });
  };

  // 新增場次
  const handleAddSession = (newSession: FestivalSession) => {
    setSessions((prev) => {
      const next = sortSessions([...prev, newSession]);
      saveSessions(next);
      return next;
    });
  };

  // 刪除單一場次
  const handleDeleteSession = (sessionId: string) => {
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== sessionId);
      saveSessions(next);
      return next;
    });
  };

  // 清空所有場次
  const handleClearAllSessions = () => {
    if (window.confirm('確定要清空所有已排定的場次嗎？')) {
      setSessions([]);
      saveSessions([]);
    }
  };

  // 當使用者在卡片點擊「選擇此片排場次」
  const handleSelectMovieForSchedule = (movieId: string) => {
    setSelectedMovieId(movieId);
    // 聚焦並平滑捲動到表單區塊
    const formElement = document.getElementById('field-movie');
    if (formElement) {
      formElement.focus();
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-[#faf7f2] flex items-center justify-center p-4">
        <p className="text-sm text-[#1b4332] font-semibold">載入影展排程中...</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1f2937] flex flex-col">
      {/* 頂部簡易導覽列 */}
      <header className="border-b border-[#e5e0d8] bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-5">
          <h1 className="text-2xl font-bold tracking-tight text-[#1b4332]">
            週末影展小幫手
          </h1>
          <p className="text-xs sm:text-sm text-[#4b5563] mt-0.5">
            排一下週末要看的電影。
          </p>
        </div>
      </header>

      {/* 主內容區塊 */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 space-y-8">
        {/* 課堂企劃非商業聲明 */}
        <NoticeBanner />

        {/* 1. 選片推薦與片單收藏 */}
        <MovieSection
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onSelectMovieForSchedule={handleSelectMovieForSchedule}
        />

        {/* 2. 排場次表單 */}
        <ScheduleForm
          existingSessions={sessions}
          onAddSession={handleAddSession}
          selectedMovieId={selectedMovieId}
          onClearSelectedMovieId={() => setSelectedMovieId('')}
        />

        {/* 3. 我的場次表與匯出 */}
        <ScheduleTable
          sessions={sessions}
          onDeleteSession={handleDeleteSession}
          onClearAllSessions={handleClearAllSessions}
        />
      </main>

      {/* 頁尾說明 */}
      <footer className="border-t border-[#e5e0d8] bg-white mt-12">
        <div className="max-w-4xl mx-auto px-4 py-5 text-center text-xs text-[#6b7280]">
          網頁設計課程 HW02｜資料保存在目前瀏覽器
        </div>
      </footer>
    </div>
  );
}
