import './avatar.scss';

export const Avatar = ({ name, size = 'small' }: { name: `${string} ${string}`, size?: 'small' | 'medium' | 'large' }) => {
  const [first, last] = name.split(' ')
  return (
    <div className={`avatar avatar ${size}`}>
      <span className="avatar--initial">{first[0]}</span>
      <span className="avatar--initial">{last[0]}</span>
    </div>
  )
}

export default Avatar;
