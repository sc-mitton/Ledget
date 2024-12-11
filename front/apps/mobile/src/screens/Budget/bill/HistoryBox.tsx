import { useMemo, useRef, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { Clock, CheckInCircle, XCircle } from "geist-native-icons";
import { groupBy } from "lodash-es";
import dayjs from "dayjs";

import styles from "./styles/history-box";
import { View } from "react-native";
import { Bill } from "@ledget/shared-features";
import {
  Box,
  BoxHeader,
  Icon,
  PagerView,
  TPagerViewRef,
  Button,
  Seperator,
  Text
} from "@ledget/native-ui";
import { useNavigation } from "@react-navigation/native";
import { BudgetScreenProps } from "@types";

const MonthlyBillHistory = ({ bill }: { bill: Bill }) => {
  const { navigation } = useNavigation<BudgetScreenProps<'Bill'>>();

  const pagerViewRef = useRef<TPagerViewRef>(null);
  const [page, setPage] = useState(0);

  const instances = useMemo(() => {
    if (bill.period === 'once') {
      return {
        [`${bill.year}`]: [dayjs(`${bill.year}-${bill.month}-${bill.day}`).format('YYYY-MM-DD')]
      }
    }

    let instances: string[] = [];
    let start = dayjs(bill.created)
    const numberOfInstance = dayjs().diff(start, bill.period)
    for (let i = numberOfInstance; i >= 0; i--) {
      instances.push(start.add(i, bill.period).format('YYYY-MM-DD'))
    }

    return groupBy(instances, (instance) => dayjs(instance).year())
  }, [bill])

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.yearsScrollView}
      >
        {Object.keys(instances).map((year, index) => (
          <Button
            key={`year-${index}-button`}
            variant='borderedPill'
            textColor={page === index ? 'secondaryText' : 'quinaryText'}
            onPress={() => pagerViewRef.current?.setPage(index)}
            label={year}
          />
        ))}
      </ScrollView>
      <Seperator backgroundColor="nestedContainerSeperator" />
      <PagerView
        initialPage={page}
        onPageSelected={({ nativeEvent }) => setPage(nativeEvent.position)}
        ref={pagerViewRef}
      >
        {Object.keys(instances).map((year) => (
          <View key={`year-${year}`} style={styles.grid}>
            {instances[year].map((month) => {
              const transactionId = bill.transactions?.find((transaction) =>
                dayjs(transaction.date).format('YYYY-MM-DD') === month
              )?.id

              return (
                <TouchableOpacity
                  key={`history-${month}-${year}`}
                  disabled={!transactionId}
                  onPress={() => {
                    if (transactionId) {
                      navigation.navigate('Transaction', { transaction: transactionId })
                    }
                  }}
                  style={styles.monthCell}>
                  {transactionId
                    ? <Icon icon={CheckInCircle} size={16} color={'successIcon'} />
                    : <Icon icon={XCircle} size={16} color={'secondaryText'} />
                  }
                  <Text>{dayjs(month).format('MMM')}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        ))}
      </PagerView>
    </>
  )
}

const History = ({ bill }: { bill: Bill }) => {
  return (
    <>
      <BoxHeader>
        <View style={styles.clockIcon}>
          <Icon icon={Clock} size={16} color='tertiaryText' />
        </View>
        Payment History
      </BoxHeader>
      <Box variant='nestedContainer' style={styles.historyBox}>
        {bill.period === 'month'
          ? <MonthlyBillHistory bill={bill} />
          : bill.period === 'year'
            ? <View style={styles.grid}>
              {Array.from({ length: dayjs().diff(dayjs(bill.created, bill.period),) }, (_, i) => (
                <View key={`instance-${i}`} style={styles.monthCell}>
                  <Icon icon={CheckInCircle} size={16} color='successIcon' />
                  <Text>{dayjs(bill.created).add(i, 'year').format('MMM YYYY')}</Text>
                </View>
              ))}
            </View>
            : null
        }
      </Box>
    </>
  )
}

export default History;
