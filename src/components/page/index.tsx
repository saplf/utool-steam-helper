import { ReactNode } from 'react';
import cn from 'classnames';
import styles from './index.module.less';

type PageProps = {
  children: ReactNode;

  className?: string;

  scrollable?: boolean;
};

export default function Page({
  className = '',
  children,
  scrollable,
}: PageProps) {
  return (
    <div
      className={cn(styles.page, className, {
        [styles.scrollable]: scrollable,
      })}
    >
      {children}
    </div>
  );
}
