import { ScrollView, View } from 'react-native';
import { ArrowUpRight, ArrowDownLeft } from 'geist-native-icons';
import Big from 'big.js';
import dayjs from 'dayjs';

import styles from './styles';
import { AccountsScreenProps } from '@types';
import { DollarCents, Box, Text, Icon } from '@ledget/native-ui';

const InvestmentTransaction = (
  props: AccountsScreenProps<'InvestmentTransaction'>
) => {
  return (
    <Box variant={'nestedScreen'} flex={1}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <DollarCents
            color={
              props.route.params.transaction.amount &&
              props.route.params.transaction.amount < 0
                ? 'greenText'
                : 'mainText'
            }
            value={Big(props.route.params.transaction.amount || 0)
              .times(100)
              .toNumber()}
            fontSize={36}
          />
          <View style={styles.subHeader}>
            <View style={styles.buySellIconContainer}>
              <View style={styles.buySellIcon}>
                {props.route.params.transaction.name
                  ?.toLowerCase()
                  .includes('buy') && (
                  <Icon icon={ArrowDownLeft} strokeWidth={2} />
                )}
                {props.route.params.transaction.name
                  ?.toLowerCase()
                  .includes('sell') && (
                  <Icon icon={ArrowUpRight} strokeWidth={2} />
                )}
              </View>
            </View>
            <Text color="secondaryText" textAlign="center">
              {props.route.params.transaction.name}
            </Text>
          </View>
        </View>
        {(props.route.params.transaction.price ||
          props.route.params.transaction.quantity ||
          props.route.params.transaction.fees ||
          props.route.params.transaction.date) && (
          <Box variant="nestedContainer">
            <View style={styles.leftColumn}>
              {props.route.params.transaction.date !== undefined && (
                <Text color="tertiaryText">Date</Text>
              )}
              {props.route.params.transaction.price !== undefined && (
                <Text color="tertiaryText">Price</Text>
              )}
              {props.route.params.transaction.quantity !== undefined && (
                <Text color="tertiaryText">Quantity</Text>
              )}
              {props.route.params.transaction.fees !== undefined && (
                <Text color="tertiaryText">Fees</Text>
              )}
            </View>
            <View>
              {props.route.params.transaction.date !== undefined && (
                <Text>
                  {dayjs(props.route.params.transaction.date).format(
                    'MMM D, YYYY'
                  )}
                </Text>
              )}
              {props.route.params.transaction.price !== undefined && (
                <Text>${props.route.params.transaction.price}</Text>
              )}
              {props.route.params.transaction.quantity !== undefined && (
                <Text>{props.route.params.transaction.quantity}</Text>
              )}
              {props.route.params.transaction.fees !== undefined && (
                <Text>{props.route.params.transaction.fees}</Text>
              )}
            </View>
          </Box>
        )}
        {(props.route.params.transaction.type ||
          props.route.params.transaction.subtype) && (
          <Box variant="nestedContainer">
            <View style={styles.leftColumn}>
              {props.route.params.transaction.type !== undefined && (
                <Text color="tertiaryText">Type</Text>
              )}
              {props.route.params.transaction.subtype !== undefined && (
                <Text color="tertiaryText">Sub Type</Text>
              )}
            </View>
            <View>
              {props.route.params.transaction.type !== undefined && (
                <Text>{props.route.params.transaction.type}</Text>
              )}
              {props.route.params.transaction.subtype !== undefined && (
                <Text>{props.route.params.transaction.subtype}</Text>
              )}
            </View>
          </Box>
        )}
        {(props.route.params.transaction.security.name ||
          props.route.params.transaction.security.ticker_symbol) && (
          <Box variant="nestedContainer" style={styles.section}>
            {props.route.params.transaction.security.name !== undefined && (
              <View style={styles.gridRow}>
                <Text color="tertiaryText">Security Name</Text>
                <Text style={styles.name}>
                  {props.route.params.transaction.security.name}
                </Text>
              </View>
            )}
            {props.route.params.transaction.security.ticker_symbol !==
              undefined && (
              <View style={styles.gridRow}>
                <Text color="tertiaryText">Ticker</Text>
                <Text>
                  {props.route.params.transaction.security.ticker_symbol}
                </Text>
              </View>
            )}
          </Box>
        )}
      </ScrollView>
    </Box>
  );
};

export default InvestmentTransaction;
