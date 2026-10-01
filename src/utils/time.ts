/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FestivalSession } from '../types';

/**
 * 將 "HH:mm" 字串轉換為自當日 00:00 起算的分鐘數
 */
export function timeStringToMinutes(timeStr: string): number | null {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(timeStr);
  if (!match) return null;
  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  return hours * 60 + minutes;
}

/**
 * 將分鐘數轉換為 "HH:mm" 字串（支援剛好 1440 分鐘轉換為 24:00）
 */
export function minutesToTimeString(minutes: number): string {
  if (minutes === 1440) {
    return '24:00';
  }
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const hh = h.toString().padStart(2, '0');
  const mm = m.toString().padStart(2, '0');
  return `${hh}:${mm}`;
}

/**
 * 檢查兩時段是否重疊（前場結束時間與後場開始時間相同不視為重疊）
 */
export function isOverlapping(
  startA: number,
  endA: number,
  startB: number,
  endB: number
): boolean {
  return startA < endB && endA > startB;
}

/**
 * 驗證欲新增的場次是否與現有場次衝突
 */
export function findSessionConflict(
  newStartMinutes: number,
  newEndMinutes: number,
  existingSessions: FestivalSession[]
): FestivalSession | null {
  for (const session of existingSessions) {
    const existingStart = timeStringToMinutes(session.startTime);
    if (existingStart === null) continue;
    const existingEnd = existingStart + session.totalMinutes;

    if (isOverlapping(newStartMinutes, newEndMinutes, existingStart, existingEnd)) {
      return session;
    }
  }
  return null;
}

/**
 * 依開始時間由早至晚排序場次
 */
export function sortSessions(sessions: FestivalSession[]): FestivalSession[] {
  return [...sessions].sort((a, b) => {
    const minA = timeStringToMinutes(a.startTime) ?? 0;
    const minB = timeStringToMinutes(b.startTime) ?? 0;
    if (minA !== minB) {
      return minA - minB;
    }
    return a.totalMinutes - b.totalMinutes;
  });
}
