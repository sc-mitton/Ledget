import dayjs from 'dayjs';
import { Calendar } from '@geist-ui/icons';

import styles from './styles/skeleton-loan-card.module.scss';
import sharedStyles from './styles/loan-card.module.scss';
import { InstitutionLogo } from '@components/pieces';
import { PulseDiv, TextSkeletonDiv } from '@ledget/ui';

const SkeletonLoanCard = () => {
  return (
    <div className={styles.box}>
      <PulseDiv isSkeleton={true}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <TextSkeletonDiv length={25} isSkeleton={true} />
            <TextSkeletonDiv length={12} isSkeleton={true} />
          </div>
          <InstitutionLogo size={'2em'} />
        </div>
        <hr className={styles.separator} />
        <div className={styles.middleRow}>
          <div className={styles.middleRowCell}>
            <span className={styles.label}>Principal</span>
            <span>&mdash;</span>
          </div>
          <div className={styles.middleRowCell}>
            <span className={styles.label}>Min. Payment</span>
            <span>&mdash;</span>
          </div>
          <div className={styles.middleRowCell}>
            <span className={styles.label}>Rate</span>
            <span>&mdash;</span>
          </div>
        </div>
        <hr className={styles.separator} />
        <div className={styles.lastPaymentSkeleton}>
          <Calendar size={16} />
          <span>Last payment on &mdash;</span>
        </div>
      </PulseDiv>
    </div>
  );
};

export default SkeletonLoanCard;
