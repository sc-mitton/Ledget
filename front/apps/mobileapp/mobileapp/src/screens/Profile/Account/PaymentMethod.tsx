import { View } from 'react-native';

import styles from './styles/payment-method';
import { useGetPaymentMethodQuery } from '@ledget/shared-features';
import { Box, Text, Header3, Icon } from '@ledget/native-ui';
import { CreditCard } from 'geist-native-icons';

const PaymentMethod = () => {
  const { data: paymentMethod } = useGetPaymentMethodQuery();

  const expDate = paymentMethod
    ? new Date(paymentMethod?.exp_year, paymentMethod?.exp_month)
    : new Date();

  return (
    <>
      <Header3>Payment Method</Header3>
      <Box variant='nestedContainer' backgroundColor='nestedContainer'>
        <View style={styles.content}>
          <Icon icon={CreditCard} />
          <View>
            <Text>
              {paymentMethod?.brand.charAt(0).toUpperCase()}
              {paymentMethod?.brand.slice(1)}
              &nbsp;&nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;
              {paymentMethod?.last4}
            </Text>
            <Text>
              {`Exp. ${expDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short'
              })}`}
            </Text>
          </View>
        </View>
      </Box>
    </>
  )
}

export default PaymentMethod
