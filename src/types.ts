/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// 電影基本資料結構
export interface Movie {
  id: string;
  title: string;
  englishTitle: string;
  sourceUrl: string;
  themeSummary: string;
}

// 排程場次資料結構
export interface FestivalSession {
  id: string;
  movieId: string;
  movieTitle: string;
  startTime: string; // 格式 HH:mm
  durationMinutes: number; // 規劃放映長度（分鐘）
  breakMinutes: number; // 休息/整場時間（分鐘）
  totalMinutes: number; // 總時長（放映 + 休息）
  endTime: string; // 計算出的結束時間 HH:mm
  createdAt: number;
}

// 預設兩部選片資料
// 依作業要求：僅提供簡短足球、家庭期待、女孩踢足球的主題介紹，不填寫未知的年份與片長
export const DEFAULT_MOVIES: Movie[] = [
  {
    id: 'bend-it-like-beckham',
    title: '我愛貝克漢',
    englishTitle: 'Bend It Like Beckham',
    sourceUrl: 'https://www.searchlightpictures.com/benditlikebeckham',
    themeSummary:
      '故事圍繞一位熱愛足球的女孩展開。在家庭傳統期待與自我體育熱忱之間，她努力跨越文化框架與性別刻板印象，堅持追求自己在球場上的踢球夢想。',
  },
  {
    id: 'shes-the-man',
    title: '足球尤物',
    englishTitle: "She's the Man",
    sourceUrl: 'https://www.paramountpictures.com/movies/shes-the-man',
    themeSummary:
      '描述一位充滿足球熱忱的女孩，在原本的女足隊伍面臨挑戰時，勇敢爭取公平競爭的踢球機會，展現堅毅球技與面對挑戰的熱情與自信。',
  },
];
