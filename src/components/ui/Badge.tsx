// ============================================================
// Funnel Builders — Badge Component
// ============================================================

import type { ReactNode } from 'react';

export interface BadgeProps {
  children: ReactNode;
  variant?:
    | 'primary'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'beginner'
    | 'intermediate'
    | 'advanced'
    | 'free'
    | 'draft'
    | 'published';
  className?: string;
}

export default function Badge({ children, variant = 'primary', className = '' }: BadgeProps) {
  const classNames = ['badge', `badge--${variant}`, className].filter(Boolean).join(' ');

  return <span className={classNames}>{children}</span>;
}
