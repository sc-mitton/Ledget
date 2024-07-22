import { View } from 'react-native';

import styles from './styles/plan';
import { Box, BoxHeader, Text, ChevronTouchable } from '@ledget/native-ui';
import { useGetSubscriptionQuery, useGetNextInvoiceQuery, useGetMeQuery } from '@ledget/shared-features';
import { ChevronRightButton } from './shared';

const Plans = () => {
  const { data: subscription } = useGetSubscriptionQuery();
  const { data: nextInvoice } = useGetNextInvoiceQuery();
  const { data: user } = useGetMeQuery();
  const nextTimeStamp = nextInvoice?.next_payment_date
    ? new Date(nextInvoice.next_payment_date * 1000)
    : subscription
      ? new Date(subscription?.current_period_end * 1000)
      : new Date();
  const nextDate = nextTimeStamp.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <>
      <BoxHeader>Plan</BoxHeader>
      <Box variant='nestedContainer' backgroundColor='nestedContainer'>
        <ChevronTouchable>
          <View style={styles.columns}>
            <View style={styles.rows}>
              <Text>Renews</Text>
              <Text>{subscription?.cancel_at_period_end ? 'Ending On' : 'Next Payment'}</Text>
              {nextInvoice?.balance! > 0 && <Text>Account Credit</Text>}
              <Text>Member Since</Text>
            </View>
            <View style={styles.rows}>
              {subscription &&
                <Text color='secondaryText'>{`${subscription.plan.interval}ly`}</Text>}
              {subscription &&
                <Text color='secondaryText'>
                  {subscription?.cancel_at_period_end
                    ? nextDate
                    : `$${subscription?.plan.amount / 100} on ${nextDate}`}
                </Text>}
              {(nextInvoice && nextInvoice?.balance > 0) &&
                <Text color='secondaryText'>{`$${nextInvoice.balance / -100}`}</Text>}
              <Text color='secondaryText'>
                {new Date(user?.created_on || new Date()).toLocaleDateString(
                  'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </Text>
            </View>
          </View>
        </ChevronTouchable>
      </Box>
    </>
  )
}

export default Plans
