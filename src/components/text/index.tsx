import { CSSProperties, ReactNode } from 'react';
import cn from 'classnames';
import styles from './index.module.less';

type TextProps = {
  className?: string;

  style?: CSSProperties;

  children: ReactNode;

  type?: 'normal' | 'secondary';

  size?: 'normal' | 'title' | 'subcontent';
};

export default function Text({
  children,
  className = '',
  style,
  type = 'normal',
  size = 'normal',
}: TextProps) {
  return (
    <span
      style={style}
      className={cn(
        styles.text,
        styles[`type-${type}`],
        styles[`size-${size}`],
        className
      )}
    >
      {children}
    </span>
  );
}
