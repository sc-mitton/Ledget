import { View } from 'react-native';

import styles from './styles/payment-method';
import { useGetPaymentMethodQuery } from '@ledget/shared-features';
import { Box, Text, BoxHeader, Icon, ChevronTouchable } from '@ledget/native-ui';
import { CreditCard } from 'geist-native-icons';
import { ChevronRightButton } from './shared';

const PaymentMethod = () => {
  const { data: paymentMethod } = useGetPaymentMethodQuery();

  const expDate = paymentMethod
    ? new Date(paymentMethod?.exp_year, paymentMethod?.exp_month)
    : new Date();

  return (
    <>
      <BoxHeader>Payment Method</BoxHeader>
      <Box variant='nestedContainer' backgroundColor='nestedContainer'>
        <ChevronTouchable >
          <Icon icon={CreditCard} />
          <View style={styles.cardInfo}>
            <Text>
              {paymentMethod?.brand.charAt(0).toUpperCase()}
              {paymentMethod?.brand.slice(1)}
              &nbsp;&nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;
              {paymentMethod?.last4}
            </Text>
            <Text color='secondaryText'>
              {`Exp. ${expDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short'
              })}`}
            </Text>
          </View>
        </ChevronTouchable>
      </Box>
    </>
  )
}

export default PaymentMethod
