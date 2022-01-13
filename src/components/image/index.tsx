import { useMemo } from 'react';

type ImageProps = {
  src: string;
} & Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'srcSet'>;

const schemaPattern = /^(?:(\w+):\/{2})?(.+)$/;
function parseSrc(src: string) {
  const [, schema, path] = src.match(schemaPattern) || [];
  if (schema || !path) return src;
  return `file://${path}`;
}

export default function Image({ src, ...rest }: ImageProps) {
  const parsed = useMemo(() => parseSrc(src), [src]);
  return <img src={parsed} {...rest} />;
}
