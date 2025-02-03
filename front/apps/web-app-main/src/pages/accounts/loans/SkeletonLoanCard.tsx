import styles from './styles/skeleton-loan-card.module.scss';

const SkeletonLoanCard = () => {
  return (
    <div className={styles.box}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleSkeleton} />
          <div className={styles.subtitleSkeleton} />
        </div>
        <div className={styles.logoSkeleton} />
      </div>
      <hr className={styles.separator} />
      <div className={styles.middleRow}>
        <div className={styles.middleRowCell}>
          <div className={styles.labelSkeleton} />
          <div className={styles.valueSkeleton} />
        </div>
        <div className={styles.middleRowCell}>
          <div className={styles.labelSkeleton} />
          <div className={styles.valueSkeleton} />
        </div>
        <div className={styles.middleRowCell}>
          <div className={styles.labelSkeleton} />
          <div className={styles.valueSkeleton} />
        </div>
      </div>
      <div className={styles.progressBars}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={styles.progressBarSkeleton} />
        ))}
      </div>
      <div className={styles.dates}>
        <div className={styles.dateSkeleton} />
        <div className={styles.dateSkeleton} />
      </div>
      <hr className={styles.separator} />
      <div className={styles.lastPaymentSkeleton} />
    </div>
  );
};

export default SkeletonLoanCard;
