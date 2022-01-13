import Image from '@/components/image';
import cn from 'classnames';
import { useCallback, useEffect, useRef } from 'react';
import styles from './item.module.css';

type ListItemProps = {
  item: Game.App;

  select: boolean;

  index: number;

  onSelect?: (item: Game.App) => void;

  onHover?: (item: Game.App) => void;
};

export default function ListItem({
  item,
  select,
  onHover,
  onSelect,
  index,
}: ListItemProps) {
  const domRef = useRef<HTMLDivElement>(null);

  const onMouseEnter = useCallback(() => {
    onHover?.(item);
  }, [onHover, item]);
  const onClick = useCallback(() => {
    onSelect?.(item);
  }, [onSelect, item]);

  useEffect(() => {
    const dom = domRef.current;
    if (select && dom) {
      dom.scrollIntoView({ block: 'nearest' });
    }
  }, [select]);

  return (
    <div
      ref={domRef}
      className={cn(styles.item, { [styles.selected]: select })}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <Image className={styles.image} src={item.icon} />
      <span>{item.name}</span>
    </div>
  );
}
