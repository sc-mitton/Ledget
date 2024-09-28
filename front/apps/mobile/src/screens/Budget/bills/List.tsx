import { useState, useMemo, useEffect } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { useSpringRef, useTransition } from '@react-spring/web'
import { ChevronRight, CheckInCircle } from 'geist-native-icons'
import dayjs from 'dayjs'

import styles from './styles/list';
import { useGetBillsQuery, selectBudgetMonthYear, TransformedBill } from '@ledget/shared-features'
import { DollarCents, AnimatedView, Button, BillCatLabel, Icon, Text } from '@ledget/native-ui'
import { useAppSelector } from '@/hooks'
import { BudgetScreenProps } from '@types'
import SkeletonList from '../SkeletonList/SkeletonList'

const COLLAPSED_MAX = 5;

function FilledList(props: BudgetScreenProps<'Main'> & { bills: TransformedBill[] }) {
  const [expanded, setExpanded] = useState(false)

  const hasOverflow = useMemo(() => {
    return (props.bills?.length || 0) > COLLAPSED_MAX
  }, [props.bills,])

  const api = useSpringRef();
  const transitions = useTransition(props.bills, {
    from: (item, index) => ({
      opacity: expanded ? 1 : index > COLLAPSED_MAX - 1 ? 0 : 1,
      maxHeight: expanded ? 100 : index > COLLAPSED_MAX - 1 ? 0 : 100,
    }),
    enter: (item, index) => ({
      opacity: expanded ? 1 : index > COLLAPSED_MAX - 1 ? 0 : 1,
      maxHeight: expanded ? 100 : index > COLLAPSED_MAX - 1 ? 0 : 100,
    }),
    config: { duration: 200 },
    ref: api,
  });

  useEffect(() => { api.start() }, [])

  useEffect(() => {
    if (expanded) {
      api.start((index: number) => ({
        maxHeight: expanded ? 100 : index > COLLAPSED_MAX - 1 ? 0 : 100
      }));
      api.start((index: number) => ({
        opacity: expanded ? 1 : index > COLLAPSED_MAX - 1 ? 0 : 1,
        delay: 100
      }))
    } else {
      api.start((index: number) => ({
        opacity: expanded ? 1 : index > COLLAPSED_MAX - 1 ? 0 : 1,
      }));
      api.start((index: number) => ({
        maxHeight: expanded ? 100 : index > COLLAPSED_MAX - 1 ? 0 : 100,
        delay: 200
      }))
    }
  }, [expanded])

  return (
    <View>
      <View style={[styles.rows, hasOverflow && styles.rowsWithOverflow]}>
        {transitions((style, item, _, i) => (
          item && (
            <>
              <AnimatedView key={item.id} style={style}>
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => props.navigation.navigate('Category', { id: item.id })}
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
                  <Icon icon={CheckInCircle} color={item.is_paid ? 'blueText' : 'tertiaryText'} />
                  <Icon icon={ChevronRight} color='quinaryText' />
                </TouchableOpacity>
              </AnimatedView>
            </>
          )))}
      </View>
      {hasOverflow &&
        <View style={styles.expandButtonContainer}>
          <Button
            style={styles.expandButton}
            onPress={() => setExpanded(!expanded)}
            label={
              expanded
                ? 'View Less'
                : `+${(props.bills?.length || 0) - COLLAPSED_MAX}  View All`
            }
            textColor='quinaryText'
          />
        </View>}
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
