import { Link } from 'react-router-dom';
import { ChevronRight, Link as LinkIcon } from '@geist-ui/icons';

import styles from './styles/link-account-prompt.module.scss';

const LinkAccountPrompt = () => {
  return (
    <Link to="/profile/connections" className={styles.container}>
      <div className={styles.content}>
        <div className={styles.linkIconContainer}>
          <LinkIcon size={18} />
        </div>
        <div className={styles.textContainer}>
          <h3 className={styles.title}>Link an account</h3>
          <p className={styles.description}>
            No loan accounts have been linked
          </p>
        </div>
        <div className={styles.iconContainer}>
          <ChevronRight size={20} />
        </div>
      </div>
    </Link>
  );
};

export default LinkAccountPrompt;
