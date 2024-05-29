import styles from './ProgressBar.module.scss';

/* eslint-disable-next-line */
export interface ProgressBarProps {
  progress?: number;
  margin?: string;
  color?: string;
}

export function ProgressBar(props: ProgressBarProps) {
  return (
    <div
      className={styles['container']}
      style={{
        margin: `${props.margin}` || '0',
        '--progress': (`${props.progress}%` || 0),
        ...(props.color ? { color: props.color } : {})
      } as React.CSSProperties}
    />
  );
}

export default ProgressBar;
