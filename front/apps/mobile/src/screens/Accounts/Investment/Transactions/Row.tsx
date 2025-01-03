import { View } from 'react-native';
import { ArrowUpRight, ArrowDownLeft } from 'geist-native-icons';
import dayjs from 'dayjs';
import Big from 'big.js';

import styles from './styles/row';
import { Text, Icon, DollarCents } from '@ledget/native-ui';
import { InvestmentTransaction } from '@ledget/shared-features';
import { Section } from './types';

const Row = ({
  transaction,
}: {
  transaction: InvestmentTransaction;
  index: number;
  section: Section;
}) => {
  return (
    <View style={styles.row}>
      <View>
        <Text>
          {transaction.name?.toLocaleLowerCase().startsWith('buy') && (
            <Icon icon={ArrowDownLeft} />
          )}
          {transaction.name?.toLocaleLowerCase().startsWith('sell') && (
            <Icon icon={ArrowUpRight} />
          )}
          {(transaction.name || '').length > 20
            ? (
                transaction.name?.replace('BUY ', ' ').replace('SELL ', ' ') ||
                ''
              ).slice(0, 20) + '...'
            : transaction.name?.replace('BUY ', ' ').replace('SELL ', ' ')}
        </Text>
        <Text color="tertiaryText">
          {dayjs(transaction.date).format('M/D/YY')}
        </Text>
      </View>
      <View style={styles.amount}>
        <DollarCents
          color={(transaction.amount || 0) < 0 ? 'greenText' : 'mainText'}
          value={Big(transaction.amount || 0)
            .times(100)
            .toNumber()}
        />
      </View>
    </View>
  );
};

export default Row;
