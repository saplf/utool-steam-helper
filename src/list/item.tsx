import cn from 'classnames';
import { useCallback } from 'react';
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
  const onMouseEnter = useCallback(() => {
    onHover?.(item);
  }, [onHover, item]);
  const onClick = useCallback(() => {
    onSelect?.(item);
  }, [onSelect, item]);

  return (
    <div
      className={cn(styles.item, { [styles.selected]: select })}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <img src={`file:///${item.icon}`} />
      <span>{item.name}</span>
    </div>
  );
}
