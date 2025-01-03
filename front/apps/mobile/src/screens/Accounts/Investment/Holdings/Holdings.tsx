import { Fragment, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import {
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  ChevronRight,
} from 'geist-native-icons';
import Big from 'big.js';

import styles from './styles/holdings';
import { View } from 'react-native';
import { useAppSelector } from '@/hooks';
import {
  Box,
  CustomScrollView,
  Icon,
  Text,
  Button,
  DollarCents,
} from '@ledget/native-ui';
import {
  selectInvestmentsScreenAccounts,
  selectInvestmentsScreenWindow,
  selectPinnedHoldings,
} from '@/features/uiSlice';
import {
  useGetInvestmentsQuery,
  isInvestmentSupported,
  Holding,
  selectTrackedHoldings,
} from '@ledget/shared-features';
import { AccountsTabsScreenProps } from '@types';
import Skeleton from './Skeleton';

const Holdings = (props: AccountsTabsScreenProps<'Investment'>) => {
  const [holdings, setHoldings] = useState<Holding[]>();

  const window = useAppSelector(selectInvestmentsScreenWindow);
  const { data: investmentsData } = useGetInvestmentsQuery(
    {
      end: dayjs().format('YYYY-MM-DD'),
      start: dayjs()
        .subtract(window?.amount || 100, window?.period || 'year')
        .format('YYYY-MM-DD'),
    },
    {
      skip: !window,
    }
  );
  const accounts = useAppSelector(selectInvestmentsScreenAccounts);
  const trackedHoldings = useAppSelector(selectTrackedHoldings);
  const pinnedHoldings = useAppSelector(selectPinnedHoldings);

  useEffect(() => {
    const newHoldings = investmentsData?.results
      .reduce((acc, i) => {
        if (
          isInvestmentSupported(i) &&
          (!accounts || accounts?.some((a) => a.id === i.account_id))
        ) {
          return acc.concat(i.holdings);
        }
        return acc;
      }, [] as Holding[])
      .sort((a, b) => {
        if (
          pinnedHoldings?.includes(a.security_id || '') &&
          !pinnedHoldings?.includes(b.security_id || '')
        ) {
          return -1;
        } else if (
          !pinnedHoldings?.includes(a.security_id || '') &&
          pinnedHoldings?.includes(b.security_id || '')
        ) {
          return 1;
        } else {
          return 0;
        }
      });
    setHoldings(newHoldings);
  }, [pinnedHoldings, investmentsData, accounts]);

  return (
    <View style={styles.container}>
      <Box style={styles.header}>
        <Button
          label="Holdings"
          textColor="tertiaryText"
          labelPlacement="left"
          padding="none"
          onPress={() => {
            props.navigation.navigate('Modals', { screen: 'Holdings' });
          }}
          icon={<Icon icon={ChevronRight} size={16} color="quaternaryText" />}
        />
      </Box>
      {investmentsData && holdings ? (
        <Box variant="nestedContainer">
          <CustomScrollView contentContainerStyle={styles.holdings} horizontal>
            {holdings?.map((holding, index) => {
              let previous_institution_value,
                current_institution_value,
                percent_change: number | undefined = undefined;

              if (
                holding.security_id &&
                trackedHoldings[holding.security_id].length > 1
              ) {
                previous_institution_value =
                  trackedHoldings[holding.security_id][
                    trackedHoldings[holding.security_id].length - 1
                  ].institution_value;
                current_institution_value =
                  trackedHoldings[holding.security_id][
                    trackedHoldings[holding.security_id].length - 1
                  ].institution_value;
                percent_change = Big(current_institution_value)
                  .minus(previous_institution_value)
                  .div(previous_institution_value)
                  .times(100)
                  .toNumber();
              }

              return (
                <Fragment key={`$holding-${index}`}>
                  {index !== 0 && (
                    <Box
                      variant="divider"
                      backgroundColor="nestedContainerSeperator"
                    />
                  )}
                  <Box style={styles.holding}>
                    <View style={styles.holdingTitle}>
                      <Text fontSize={14} color="secondaryText">
                        {holding.security.ticker_symbol
                          ? holding.security.ticker_symbol?.slice(0, 6)
                          : '—'}
                      </Text>
                      <View style={styles.holdingTrend}>
                        <Text
                          fontSize={14}
                          color={
                            percent_change !== undefined
                              ? percent_change < 0
                                ? 'redText'
                                : 'greenText'
                              : 'tertiaryText'
                          }
                        >
                          {percent_change !== undefined
                            ? `${percent_change}%`
                            : '—'}
                        </Text>
                        {percent_change !== undefined ? (
                          <Icon
                            icon={
                              percent_change === 0
                                ? ArrowRight
                                : percent_change < 0
                                ? ArrowDownRight
                                : ArrowUpRight
                            }
                            size={13}
                            color={percent_change < 0 ? 'redText' : 'greenText'}
                            strokeWidth={2}
                          />
                        ) : null}
                      </View>
                    </View>
                    {holding.institution_value && (
                      <DollarCents
                        value={Big(holding.institution_value)
                          .times(100)
                          .toNumber()}
                      />
                    )}
                  </Box>
                </Fragment>
              );
            })}
          </CustomScrollView>
        </Box>
      ) : (
        <Skeleton />
      )}
    </View>
  );
};

export default Holdings;
