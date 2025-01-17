import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ArrowUpRight, ArrowDownLeft, Plus } from 'geist-native-icons';
import { BlurView } from 'expo-blur';

import styles from './styles/panel';
import { AccountsTabsScreenProps } from '@types';
import { Box, Icon, Text, Button } from '@ledget/native-ui';
import Chart from './Chart';
import Holdings from './Holdings/Holdings';
import Transactions from './Transactions/List';
import { useGetAccountsQuery } from '@ledget/shared-features';
import { useAppearance } from '@/features/appearanceSlice';

export default function Panel(props: AccountsTabsScreenProps<'Investment'>) {
  const [bottomOfContentPos, setBottomOfContentPos] = useState(0);
  const [transactionsListExpanded, setTransactionsListExpanded] =
    useState(false);
  const { data: accounts } = useGetAccountsQuery();
  const { mode } = useAppearance();

  return (
    <Box padding="pagePadding" style={styles.main}>
      {true && (
        <BlurView
          intensity={20}
          tint={mode}
          style={[StyleSheet.absoluteFill, styles.blurView]}
        >
          <Box
            style={styles.addAccountButtonContainer}
            shadowColor="mainText"
            shadowOpacity={0.4}
            shadowOffset={{ width: 0, height: 0 }}
            shadowRadius={8}
          >
            <Button
              style={styles.addAccountButton}
              textColor="blueText"
              label="Investment Account"
              onPress={() =>
                props.navigation.navigate('BottomTabs', {
                  screen: 'Profile',
                  params: {
                    screen: 'Connections',
                  },
                } as any)
              }
              fontSize={18}
              labelPlacement="left"
              icon={
                <Icon icon={Plus} size={20} strokeWidth={2} color="blueText" />
              }
            />
          </Box>
        </BlurView>
      )}
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
