import { useState, useMemo, useEffect } from 'react'
import { View, TouchableOpacity } from 'react-native'
import Animated, { LinearTransition, FadeIn, FadeOut } from 'react-native-reanimated'
import { ChevronRight, CheckInCircle } from 'geist-native-icons'
import dayjs from 'dayjs'

import styles from './styles/list';
import { useGetBillsQuery, selectBudgetMonthYear, TransformedBill } from '@ledget/shared-features'
import { DollarCents, Button, BillCatLabel, Icon, Text } from '@ledget/native-ui'
import { useAppSelector } from '@/hooks'
import { BudgetScreenProps } from '@types'
import SkeletonList from '../SkeletonList/SkeletonList'
import { useBudgetContext } from '../context'

const COLLAPSED_MAX = 5;

function FilledList(props: BudgetScreenProps<'Main'> & { bills: TransformedBill[] }) {
  const [expanded, setExpanded] = useState(false)
  const { billsIndex } = useBudgetContext()

  const hasOverflow = useMemo(() => {
    return (props.bills?.length || 0) > COLLAPSED_MAX
  }, [props.bills,])

  return (
    <View style={styles.list}>
      <View style={[styles.rows, hasOverflow && styles.rowsWithOverflow]}>
        {props.bills?.filter(c => c.period === (billsIndex === 0 ? 'month' : 'year'))
          .slice(0, expanded ? undefined : COLLAPSED_MAX)
          .map((item, index) => (
            <Animated.View key={item.id} exiting={FadeOut}>
              <TouchableOpacity
                style={styles.row}
                activeOpacity={0.7}
                onPress={() => props.navigation.navigate('Bill', { bill: item })}
              >
                <View>
                  <BillCatLabel emoji={item.emoji} period={item.period} name={item.name} >
                    <Text fontSize={15} color='monthColor'>
                      &nbsp;{dayjs(item.date).format('M-D')}
                    </Text>
                  </BillCatLabel>
                </View>
                <View style={styles.amount}>
                  <DollarCents value={item.upper_amount} withCents={false} />
                </View>
                <Icon icon={CheckInCircle} color={item.is_paid ? 'blueText' : 'quaternaryText'} />
                <Icon icon={ChevronRight} color='quinaryText' />
              </TouchableOpacity>
            </Animated.View>
          ))}
      </View>
      {hasOverflow &&
        <Animated.View style={styles.expandButtonContainer} layout={LinearTransition}>
          <Button
            style={styles.expandButton}
            onPress={() => { setExpanded(!expanded) }}
            label={
              expanded
                ? 'View Less'
                : `+${(props.bills?.length || 0) - COLLAPSED_MAX}  View All`
            }
            textColor='quinaryText'
          />
        </Animated.View>}
    </View>
  )
}

export default function (props: BudgetScreenProps<'Main'>) {
  const [bills, setBills] = useState<TransformedBill[]>()
  const { month, year } = useAppSelector(selectBudgetMonthYear)
  const { data } = useGetBillsQuery(
    { month, year },
    { skip: !month || !year }
  );

  useEffect(() => {
    setBills(data?.filter(c =>
      !props.route.params?.day || dayjs(c.date).isSame(dayjs().day(props.route.params?.day))));
  }, [data])

  return (
    <>
      {bills
        ? <FilledList {...props} bills={bills} />
        : <SkeletonList />
      }
    </>
  )
}
