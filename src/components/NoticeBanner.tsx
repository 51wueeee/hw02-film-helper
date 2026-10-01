/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const NoticeBanner: React.FC = () => {
  return (
    <aside
      aria-label="課程企劃聲明"
      className="border border-[#c2410c] bg-[#fffaf5] px-4 py-2.5 text-sm text-[#432818]"
    >
      <p className="font-medium text-[#c2410c]">
        課堂影展企劃，非實際售票活動。
      </p>
    </aside>
  );
};

