import { useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native'
import { ChevronRight } from 'geist-native-icons'
import { useSpringRef, useTransition } from '@react-spring/web';
import { useNavigation } from '@react-navigation/native';

import styles from './styles/list';
import { useAppSelector } from '@/hooks'
import { DollarCents, BillCatEmoji, Seperator, Icon, Text, AnimatedView, Button } from '@ledget/native-ui'
import { Category, useGetCategoriesQuery, selectBudgetMonthYear } from '@ledget/shared-features'
import { BudgetScreenProps } from '@types';

interface Props {
  period: Category['period']
}

const COLLAPSED_MAX = 5;

export default function List(props: Props) {
  const { month, year } = useAppSelector(selectBudgetMonthYear)
  const [expanded, setExpanded] = useState(false)
  const { data: categories, isLoading } = useGetCategoriesQuery(
    { month, year },
    { skip: !month || !year }
  );
  const { navigation } = useNavigation<BudgetScreenProps<'Main'>>();

  const hasOverflow = useMemo(() => {
    return (categories?.filter(c => c.period === props.period).length || 0) > COLLAPSED_MAX
  }, [categories, props.period])

  const api = useSpringRef();
  const transitions = useTransition(categories?.filter(c => c.period === props.period), {
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
                {i !== 0 &&
                  <View style={styles.seperator}>
                    <Seperator backgroundColor='nestedContainerSeperator' variant='bare' />
                  </View>}
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => navigation.navigate('Category', { id: item.id })}
                >
                  <View>
                    <BillCatEmoji emoji={item.emoji} period={item.period} />
                  </View>
                  <View style={styles.name}>
                    <Text>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
                  </View>
                  <View>
                    <DollarCents value={item.amount_spent} withCents={false} />
                  </View>
                  <Text>/</Text>
                  <View>
                    <DollarCents value={item.limit_amount} withCents={false} />
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
                : `+${(categories?.filter(c => c.period === props.period).length || 0) - COLLAPSED_MAX}  View All`
            }
            textColor='quinaryText'
          />
        </View>}
    </View>
  )
}
