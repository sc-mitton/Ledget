import { useEffect } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring
} from 'react-native-reanimated';
import { useTheme } from '@shopify/restyle';
import { ArrowDown } from 'geist-native-icons';

import styles from './styles/empty-list';
import { useTransactionsSyncMutation } from '@ledget/shared-features';
import { defaultSpringConfig, Text, Icon } from '@ledget/native-ui';
import { useAppSelector } from '@/hooks';
import { selectAccountsTabCreditAccounts, selectAccountsTabDepositAccounts } from '@/features/uiSlice';
import { AccountsTabsScreenProps } from '@types';

const EmptyList = (props: AccountsTabsScreenProps<'Depository' | 'Credit'>) => {
  const accounts = useAppSelector(
    props.route.name === 'Depository' ? selectAccountsTabDepositAccounts : selectAccountsTabCreditAccounts)

  const arrowIconY = useSharedValue(5)
  const theme = useTheme()
  const [syncTransactions, { isLoading: isSyncing }] = useTransactionsSyncMutation()

  useEffect(() => {
    arrowIconY.value = withRepeat(
      withSequence(
        withSpring(3, defaultSpringConfig),
        withSpring(8, defaultSpringConfig)
      ),
      -1, true
    );
  }, [])

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          onRefresh={() => {
            if (accounts) {
              syncTransactions({ accounts: accounts.map(a => a.id) })
            }
          }}
          refreshing={isSyncing}
          style={{ transform: [{ scaleY: .7 }, { scaleX: .7 }] }}
          colors={[theme.colors.blueText]}
          progressBackgroundColor={theme.colors.modalBox}
          tintColor={theme.colors.secondaryText}
        />}
      contentContainerStyle={styles.emptyBoxContainer}>
      <Text color='quaternaryText'>No transactions</Text>
      <Animated.View style={{ transform: [{ translateY: arrowIconY }] }}>
        <Icon icon={ArrowDown} color='quaternaryText' strokeWidth={2} />
      </Animated.View>
    </ScrollView>
  )
}
export default EmptyList
