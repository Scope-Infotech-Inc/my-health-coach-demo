import * as React from 'react';

/**
 * Numbered pagination with prev/next chevrons, navy active page, and ellipsis
 * truncation for long ranges.
 */
export interface PaginationProps {
  /** Current 1-based page */
  page: number;
  /** Total number of pages */
  pageCount: number;
  onChange?: (page: number) => void;
  /** Pages shown either side of the current page when truncated. @default 1 */
  siblings?: number;
}

export function Pagination(props: PaginationProps): JSX.Element;
