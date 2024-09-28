import { useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native'
import { ChevronRight } from 'geist-native-icons'
import { useSpringRef, useTransition } from '@react-spring/web';
import Big from 'big.js';

import styles from './styles/list';
import { useAppSelector } from '@/hooks'
import { DollarCents, BillCatEmoji, Icon, Text, AnimatedView, Button } from '@ledget/native-ui'
import SkeletonList from '../SkeletonList/SkeletonList';
import { Category, useGetCategoriesQuery, selectBudgetMonthYear } from '@ledget/shared-features'
import { BudgetScreenProps } from '@types';

type Props = {
  period: Category['period']
} & BudgetScreenProps<'Main'>

const COLLAPSED_MAX = 5;

const FilledList = (props: Props & { categories?: Category[] }) => {
  const [expanded, setExpanded] = useState(false)

  const hasOverflow = useMemo(() => {
    return (props.categories?.filter(c => c.period === props.period).length || 0) > COLLAPSED_MAX
  }, [props.categories, props.period])

  const api = useSpringRef();
  const transitions = useTransition(props.categories?.filter(c => c.period === props.period), {
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
    <View style={styles.list}>
      <View style={[styles.rows, hasOverflow && styles.rowsWithOverflow]}>
        {transitions((style, item, _, i) => (
          item && (
            <>
              <AnimatedView key={item.id} style={style}>
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => props.navigation.navigate('Category', { category: item })}
                >
                  <View>
                    <BillCatEmoji emoji={item.emoji} period={item.period} />
                  </View>
                  <View style={styles.name}>
                    <Text>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
                  </View>
                  <View>
                    <DollarCents value={Big(item.amount_spent || 0).times(100).toNumber()} withCents={false} />
                  </View>
                  <Text>/</Text>
                  <View>
                    <DollarCents value={Big(item.limit_amount || 0).toNumber()} withCents={false} />
                  </View>
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
                : `+${(props.categories?.filter(c => c.period === props.period).length || 0) - COLLAPSED_MAX}  View All`
            }
            textColor='quinaryText'
          />
        </View>}
    </View>
  )
}

export default function List(props: Props) {
  const { month, year } = useAppSelector(selectBudgetMonthYear)
  const { data: categories } = useGetCategoriesQuery(
    { month, year },
    { skip: !month || !year }
  );

  return (
    <>
      {categories
        ? <FilledList {...props} categories={categories} />
        : <SkeletonList />
      }
    </>
  )
}
