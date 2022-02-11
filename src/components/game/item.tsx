import Image from '@/components/image';
import Space from '@/components/space';
import Text from '@/components/text';
import { getGameName, getGameTags, getPlayTime } from '@/utils/helper';
import cn from 'classnames';
import { useCallback, useEffect, useRef } from 'react';
import { Tag, TagGroup } from 'rsuite';
import styles from './item.module.less';

type ListItemProps = {
  item: Game.App;

  select: boolean;

  index: number;

  onSelect?: (item: Game.App) => void;

  onHover?: (item: Game.App) => void;

  hideAppId?: boolean;

  hidePlayTime?: boolean;
};

export default function ListItem({
  item,
  select,
  onHover,
  onSelect,
  index,
  hideAppId = false,
  hidePlayTime = false,
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
          <Space gap={6} className={styles.tags}>
            {!hideAppId && appid && (
              <Tag color="cyan" size="sm">
                {appid}
              </Tag>
            )}
            {!hidePlayTime && playtime && (
              <Tag color="orange" size="sm">
                {playtime}
              </Tag>
            )}
          </Space>
          <Text className={styles.name}>{getGameName(item)}</Text>
        </div>
        <div className={styles.sub}>
          <Text className={styles.tag} type="secondary" size="subcontent">
            {getGameTags(item).join(' ')}
          </Text>
        </div>
      </div>
    </div>
  );
}
