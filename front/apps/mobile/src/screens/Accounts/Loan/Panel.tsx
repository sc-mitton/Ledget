import { ScrollView } from 'react-native';

import styles from './styles/panel';
import { AccountsTabsScreenProps } from '@types';
import { Box } from '@ledget/native-ui';
import { useGetLiabilitiesQuery } from '@ledget/shared-features';
import LoanCard from './LoanCard';
import SkeletonLoanCard from './SkeletonLoanCard';
import LinkAccountPrompt from '../LinkAccountPrompt';

export default function Panel(props: AccountsTabsScreenProps<'Loan'>) {
  const { data: liabilities } = useGetLiabilitiesQuery();

  return (
    <Box padding="pagePadding" style={styles.main}>
      <LinkAccountPrompt {...props} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.cardsScrollViewContainer}
      >
        <Box height={12} width={'100%'} />
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
            {Array.from({ length: 2 }).map((_, i) => (
              <SkeletonLoanCard key={i} />
            ))}
          </>
        )}
        <Box marginBottom="navHeight" width={'100%'} />
      </ScrollView>
    </Box>
  );
}
