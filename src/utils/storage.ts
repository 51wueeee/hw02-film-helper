/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FestivalSession } from '../types';

const FAVORITES_KEY = 'weekend_filmfest_favorites_hw02';
const SESSIONS_KEY = 'weekend_filmfest_sessions_hw02';

/**
 * 讀取收藏清單（電影 ID 陣列）
 */
export function loadFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * 儲存收藏清單
 */
export function saveFavorites(favorites: string[]): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (err) {
    console.error('儲存收藏清單失敗', err);
  }
}

/**
 * 讀取已排定的場次資料
 */
export function loadSessions(): FestivalSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * 儲存已排定的場次資料
 */
export function saveSessions(sessions: FestivalSession[]): void {
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (err) {
    console.error('儲存場次資料失敗', err);
  }
}
