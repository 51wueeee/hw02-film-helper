/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FestivalSession, DEFAULT_MOVIES } from '../types';

/**
 * 將場次資料匯出為 UTF-8 編碼之 CSV 檔案
 * 加入 BOM (\uFEFF) 確保微軟 Excel 正確識別繁體中文編碼而不亂碼
 */
export function exportSessionsToCSV(sessions: FestivalSession[]): void {
  if (sessions.length === 0) {
    return;
  }

  const movieMap = new Map(DEFAULT_MOVIES.map((m) => [m.id, m]));

  const headers = [
    '場次序號',
    '電影名稱',
    '開始時間',
    '結束時間',
    '規劃放映時長(分鐘)',
    '中場休息時長(分鐘)',
    '總預留時間(分鐘)',
    '官方來源連結',
  ];

  const rows = sessions.map((session, index) => {
    const movie = movieMap.get(session.movieId);
    const officialUrl = movie ? movie.sourceUrl : '';

    const values = [
      (index + 1).toString(),
      session.movieTitle,
      session.startTime,
      session.endTime,
      session.durationMinutes.toString(),
      session.breakMinutes.toString(),
      session.totalMinutes.toString(),
      officialUrl,
    ];

    // CSV 跳脫字元處理
    return values
      .map((val) => `"${val.replace(/"/g, '""')}"`)
      .join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', '週末影展場次表.csv');
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
