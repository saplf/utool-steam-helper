import { CSSProperties, ReactNode } from 'react';
import styles from './index.module.less';

type SpaceProps = {
  align?: 'start' | 'end' | 'center' | 'baseline';

  direction?: 'column' | 'row';

  wrap?: boolean;

  children: ReactNode;

  className?: string;

  style?: CSSProperties;

  gap?: number | string;
};

export default function Space({
  children,
  align = 'center',
  direction = 'row',
  wrap,
  className,
  style,
  gap = 8,
}: SpaceProps) {
  return (
    <div
      className={`${styles.space} ${className}`}
      style={{
        ...style,
        alignItems: align,
        flexDirection: direction,
        flexWrap: wrap ? 'wrap' : 'nowrap',
        gap,
      }}
    >
      {children}
    </div>
  );
}
