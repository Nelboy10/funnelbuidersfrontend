// ============================================================
// Funnel Builders — Card Component
// ============================================================

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glass?: boolean;
  interactive?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, glass = false, interactive = false, className = '', ...props }, ref) => {
    const classNames = [
      'card',
      glass ? 'card--glass' : '',
      interactive ? 'card--interactive' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={classNames} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
