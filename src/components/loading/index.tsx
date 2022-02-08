import styles from './index.module.css';

type LoadingProps = {
  className?: string;
};

export default function Loading({ className = '' }: LoadingProps) {
  return (
    <div className={`${styles.loading} ${className}`}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
