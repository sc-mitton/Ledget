import styles from './styles/tab.module.scss';
import { useGetLiabilitiesQuery } from '@ledget/shared-features';
import LoanCard from './LoanCard';
import LinkAccountPrompt from './LinkAccountPrompt';
import SkeletonLoanCard from './SkeletonLoanCard';
import { useScreenContext } from '@ledget/ui';

const Loans = () => {
  const { data: liabilities } = useGetLiabilitiesQuery();
  const { screenSize } = useScreenContext();

  return (
    <div className={styles.main}>
      {liabilities &&
        liabilities.mortgage.length === 0 &&
        liabilities.student.length === 0 && <LinkAccountPrompt />}
      <div className={styles.cardsContainer} data-size={screenSize}>
        {liabilities ? (
          <>
            {liabilities.student
              .filter((liability) => !liability.product_not_supported)
              .map((liability) => (
                <LoanCard key={liability.account_id} liability={liability} />
              ))}
            {liabilities.mortgage
              .filter((liability) => !liability.product_not_supported)
              .map((liability) => (
                <LoanCard key={liability.account_id} liability={liability} />
              ))}
            {liabilities.student
              .filter((liability) => liability.product_not_supported)
              .map((liability) => (
                <LoanCard key={liability.account_id} liability={liability} />
              ))}
            {liabilities.mortgage
              .filter((liability) => liability.product_not_supported)
              .map((liability) => (
                <LoanCard key={liability.account_id} liability={liability} />
              ))}
          </>
        ) : (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonLoanCard key={i} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Loans;
