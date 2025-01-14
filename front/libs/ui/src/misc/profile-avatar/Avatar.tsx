import styles from './avatar.module.scss';

export const Avatar = ({
  name,
  size = 'small',
}: {
  name: string;
  size?: 'small' | 'medium' | 'large';
}) => {
  const [first, last] = name.split(' ');
  return (
    <div className={styles.avatar} data-size={size}>
      <span>{first[0]}</span>
      <span>{last[0]}</span>
    </div>
  );
};

export default Avatar;
