import Image from '@/components/image';
import { getGameName, getGameTags, getPlayTime } from '@/utils/helper';
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

  const playtime = getPlayTime(item) || null;
  const appid = item.appid || null;

  return (
    <div
      ref={domRef}
      className={cn(styles.item, { [styles.selected]: select })}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <Image className={styles.image} src={item.icon} />
      <div className={styles.info}>
        <div className={styles.main}>
          {appid && (
            <span className={cn(styles.appid, styles.tagUI)}>appid: {appid}</span>
          )}
          {playtime && (
            <span className={cn(styles.time, styles.tagUI)}>{playtime}</span>
          )}
          <span className={styles.name}>{getGameName(item)}</span>
        </div>
        <div className={styles.sub}>
          {getGameTags(item).map((it, i) => (
            <span key={i} className={styles.tag}>
              {it}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
