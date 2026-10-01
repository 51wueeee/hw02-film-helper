/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Movie, DEFAULT_MOVIES } from '../types';

interface MovieSectionProps {
  favorites: string[];
  onToggleFavorite: (movieId: string) => void;
  onSelectMovieForSchedule?: (movieId: string) => void;
}

export const MovieSection: React.FC<MovieSectionProps> = ({
  favorites,
  onToggleFavorite,
  onSelectMovieForSchedule,
}) => {
  return (
    <section aria-labelledby="movies-heading" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-[#e5e0d8] pb-2">
        <h2 id="movies-heading" className="text-xl font-bold text-[#1b4332]">
          選片與收藏
        </h2>
        <div className="text-sm text-[#4b5563] mt-1 sm:mt-0 font-medium">
          已收藏：
          <span className="font-bold text-[#1b4332] text-base ml-1">
            {favorites.length}
          </span>{' '}
          / {DEFAULT_MOVIES.length} 部
        </div>
      </div>

      <p className="text-sm text-[#4b5563] leading-relaxed">
        先選想看的片，也可以直接安排場次。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DEFAULT_MOVIES.map((movie: Movie) => {
          const isFavorite = favorites.includes(movie.id);

          return (
            <article
              key={movie.id}
              className={`border p-4 bg-white transition-none ${
                isFavorite ? 'border-[#1b4332]' : 'border-[#e5e0d8]'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-lg font-bold text-[#1b4332] leading-tight">
                    {movie.title}
                  </h3>
                  <p className="text-xs text-[#6b7280] italic mt-0.5">
                    {movie.englishTitle}
                  </p>
                </div>
                {isFavorite && (
                  <span className="px-2 py-0.5 text-xs bg-[#e8f0eb] text-[#1b4332] font-semibold border border-[#1b4332] shrink-0">
                    已收藏
                  </span>
                )}
              </div>

              {/* 主題介紹：僅提供簡短足球、家庭期待、女孩踢足球主題，不填寫未知的年份與片長 */}
              <div className="my-3 text-sm text-[#374151] leading-relaxed border-l-2 border-[#1b4332] pl-3 py-0.5 bg-[#fcfbf7]">
                <p className="font-medium text-xs text-[#1b4332] mb-1">
                  主題核心：
                </p>
                <p>{movie.themeSummary}</p>
              </div>

              {/* 官方介紹頁面外部連結 */}
              <div className="mb-4 text-xs text-[#4b5563]">
                <span className="font-medium text-[#1f2937]">官方資訊：</span>
                <a
                  href={movie.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1b4332] underline hover:text-[#2d6a4f] ml-1 inline-flex items-center gap-1"
                >
                  前往官方介紹頁面
                  <span aria-hidden="true" className="text-[10px]">↗</span>
                </a>
              </div>

              {/* 操作按鈕 */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#f0ede6]">
                <button
                  type="button"
                  onClick={() => onToggleFavorite(movie.id)}
                  aria-pressed={isFavorite}
                  className={`px-3 py-1.5 text-xs font-semibold border cursor-pointer ${
                    isFavorite
                      ? 'bg-[#f3f4f6] text-[#374151] border-[#9ca3af] hover:bg-[#e5e7eb]'
                      : 'bg-[#1b4332] text-white border-[#1b4332] hover:bg-[#143527]'
                  }`}
                >
                  {isFavorite ? '取消收藏' : '＋ 加入收藏'}
                </button>

                {onSelectMovieForSchedule && (
                  <button
                    type="button"
                    onClick={() => onSelectMovieForSchedule(movie.id)}
                    className="px-3 py-1.5 text-xs font-semibold border border-[#1b4332] text-[#1b4332] bg-white hover:bg-[#f2f7f4] cursor-pointer"
                  >
                    選擇此片排場次
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
