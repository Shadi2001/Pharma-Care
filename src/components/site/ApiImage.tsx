import { useState, type ImgHTMLAttributes } from 'react';
import { apiImageUrl } from '@/api/config';

export function ApiImage({ src, alt, className, ...props }: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & { src?: string | null }) {
  const url = apiImageUrl(src);
  const [failed, setFailed] = useState<string>();
  return url && failed !== url
    ? <img {...props} src={url} alt={alt} className={className} onError={() => setFailed(url)} />
    : <div role="img" aria-label={alt} className={`${className ?? ''} bg-secondary/50`} />;
}
