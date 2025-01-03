import { useState } from 'react';
import { View } from 'react-native';
import { ArrowUpRight, ArrowDownLeft } from 'geist-native-icons';

import styles from './styles/panel';
import { AccountsTabsScreenProps } from '@types';
import { Box, Icon, Text } from '@ledget/native-ui';
import Chart from './Chart';
import Holdings from './Holdings/Holdings';
import Transactions from './Transactions/List';

export default function Panel(props: AccountsTabsScreenProps<'Investment'>) {
  const [bottomOfContentPos, setBottomOfContentPos] = useState(0);
  const [transactionsListExpanded, setTransactionsListExpanded] =
    useState(false);

  return (
    <Box padding="pagePadding" style={styles.main}>
      <Box style={styles.main}>
        <View
          onLayout={(event) => {
            setBottomOfContentPos(event.nativeEvent.layout.height + 12);
          }}
        >
          <Chart />
          <Holdings {...props} />
          <View style={styles.legend}>
            <View style={styles.transactionsHeader}>
              <Text color="tertiaryText">Transactions</Text>
            </View>
            <Icon
              color="tertiaryText"
              icon={ArrowDownLeft}
              size={14}
              strokeWidth={2}
            />
            <Text color="tertiaryText" fontSize={15}>
              Buy
            </Text>
            <Icon
              color="tertiaryText"
              icon={ArrowUpRight}
              size={14}
              strokeWidth={2}
            />
            <Text color="tertiaryText" fontSize={15}>
              Sell
            </Text>
          </View>
        </View>
        <Transactions
          onStateChange={(state) => {
            setTransactionsListExpanded(state === 'expanded' ? true : false);
          }}
          collapsedTop={bottomOfContentPos}
          expandedTop={12}
          {...props}
        />
      </Box>
    </Box>
  );
}
