import { RefreshControl, ScrollView } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { ArrowDown } from 'geist-native-icons';

import styles from './styles/empty-list';
import { useTransactionsSyncMutation } from '@ledget/shared-features';
import { Text, Icon } from '@ledget/native-ui';
import { useAppSelector } from '@/hooks';
import {
  selectAccountsTabCreditAccounts,
  selectAccountsTabDepositAccounts,
} from '@/features/uiSlice';
import { AccountsTabsScreenProps } from '@types';
import LottieView from 'lottie-react-native';
import { arrowDown } from '@ledget/media/lotties';

const EmptyList = (props: AccountsTabsScreenProps<'Depository' | 'Credit'>) => {
  const accounts = useAppSelector(
    props.route.name === 'Depository'
      ? selectAccountsTabDepositAccounts
      : selectAccountsTabCreditAccounts
  );

  const theme = useTheme();
  const [syncTransactions, { isLoading: isSyncing }] =
    useTransactionsSyncMutation();

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          onRefresh={() => {
            if (accounts) {
              syncTransactions();
            }
          }}
          refreshing={isSyncing}
          style={styles.refreshControl}
          colors={[theme.colors.blueText]}
          progressBackgroundColor={theme.colors.modalBox}
          tintColor={theme.colors.secondaryText}
        />
      }
      contentContainerStyle={styles.emptyBoxContainer}
    >
      <Text color="quaternaryText">No Transactions</Text>
      <LottieView
        autoPlay
        loop
        style={{ width: 24, height: 24 }}
        colorFilters={[
          {
            keypath: 'arrow-down',
            color: theme.colors.quaternaryText,
          },
        ]}
        source={arrowDown}
      />
    </ScrollView>
  );
};
export default EmptyList;
