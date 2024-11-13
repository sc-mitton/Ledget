import { useEffect, useState } from 'react';
import { View } from 'react-native'
import Big from 'big.js';

import styles from './styles/widget';
import { useGetCategoriesQuery, Category, selectBudgetMonthYear } from '@ledget/shared-features'
import { WidgetProps } from '@features/widgetsSlice'
import { Text, DollarCents, Box } from '@ledget/native-ui';
import EmojiProgressCircle from "./EmojiProgressCircle"
import PickerOption from './PickerOption'
import Selector from './Selector';
import { useAppSelector } from '@/hooks';

const Categories = (widget: WidgetProps<{ categories?: string[] }>) => {
  const { month, year } = useAppSelector(selectBudgetMonthYear)
  const { data: fetchedCategories } = useGetCategoriesQuery(
    { month, year, spending: true },
    { skip: !month || !year },
  )
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    if (fetchedCategories) {
      setCategories(fetchedCategories.filter(category =>
        widget.args?.categories?.includes(category.id)))
    }
  }, [widget.args?.categories, fetchedCategories])

  return (
    <View style={[widget.shape === 'rectangle' ? styles.rectangleContainer : styles.squareContainer]}>
      {categories.slice(0, 4).map(category => (
        <Box
          backgroundColor='nestedContainer'
          key={`categories-widget-${category.id}`}
          style={widget.shape === 'rectangle' ? styles.rectangleCell : styles.squareCell}
        >
          <View style={styles.cell}>
            {widget.shape === 'rectangle'
              ?
              <View>
                <EmojiProgressCircle progress={Big(category.amount_spent || 0).div(category.limit_amount || 1).toNumber()}>
                  <Text>{category.emoji}</Text>
                </EmojiProgressCircle>
              </View>
              :
              <EmojiProgressCircle progress={Big(category.amount_spent || 0).div(category.limit_amount || 1).toNumber()}>
                <Text>{category.emoji}</Text>
              </EmojiProgressCircle>
            }
            {(widget.shape === 'rectangle') &&
              <View>
                <Text color='secondaryText' fontSize={13}>{category.name}</Text>
                <View style={styles.amountsContainer}>
                  <DollarCents fontSize={14} value={Big(category.amount_spent || 0).times(100).toNumber()} withCents={false} />
                  <Text fontSize={12}>/</Text>
                  <DollarCents fontSize={14} value={Big(category.limit_amount || 0).toNumber()} withCents={false} />
                </View>
              </View>}
          </View>
        </Box>
      ))}
    </View>
  )
}

const CategoriesProgress = (widget: WidgetProps<{ categories?: string[] }>) => {
  const { month, year } = useAppSelector(selectBudgetMonthYear)
  const { isSuccess, isLoading } = useGetCategoriesQuery(
    { month, year, spending: true },
    { skip: !month || !year },
  )

  return widget.id && isSuccess
    ? widget.args?.categories
      ? <Categories {...widget} />
      : <Selector {...widget} />
    : <PickerOption loading={isLoading} />
}

export default CategoriesProgress
