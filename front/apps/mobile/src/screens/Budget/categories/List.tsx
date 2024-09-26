import { View } from 'react-native'
import { ChevronRight } from 'geist-native-icons'

import styles from './styles/list';
import { useAppSelector } from '@/hooks'
import { DollarCents, BillCatEmoji, Seperator, Icon, Text } from '@ledget/native-ui'
import { Category, useGetCategoriesQuery, selectBudgetMonthYear } from '@ledget/shared-features'

interface Props {
  period: Category['period']
}

export default function List(props: Props) {
  const { month, year } = useAppSelector(selectBudgetMonthYear)
  const { data: categories, isLoading } = useGetCategoriesQuery(
    { month, year },
    { skip: !month || !year }
  );

  return (
    <View style={styles.list}>
      {categories?.filter(c => c.period === props.period).map((c, i) => (
        <>
          {i !== 0 &&
            <View style={styles.seperator}>
              <Seperator backgroundColor='nestedContainerSeperator' />
            </View>}
          <View key={c.id} style={styles.row}>
            <View>
              <BillCatEmoji emoji={c.emoji} period={c.period} />
            </View>
            <View style={styles.name}>
              <Text>{c.name}</Text>
            </View>
            <View>
              <DollarCents value={c.amount_spent} withCents={false} />
            </View>
            <Text>/</Text>
            <View>
              <DollarCents value={c.limit_amount} withCents={false} />
            </View>
            <Icon icon={ChevronRight} color='quinaryText' />
          </View>
        </>
      ))}
    </View>
  )
}
