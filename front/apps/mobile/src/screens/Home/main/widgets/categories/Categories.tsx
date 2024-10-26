import { useEffect, useState } from 'react';
import { View } from 'react-native'
import dayjs from 'dayjs';
import Big from 'big.js';

import styles from './styles/widget';
import sharedStyles from './styles/shared';
import { useGetCategoriesQuery, Category, selectBudgetMonthYear } from '@ledget/shared-features'
import { WidgetProps } from '@features/widgetsSlice'
import { Text, DollarCents } from '@ledget/native-ui';
import EmojiProgressCircle from "./EmojiProgressCircle"
import PickerOption from './PickerOption'
import Selector from './Selector';
import { useAppSelector } from '@/hooks';

const Filled = (widget: WidgetProps<{ categories?: string[] }>) => {
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
        <View
          key={`categories-widget-${category.id}`}
          style={widget.shape === 'rectangle' ? styles.rectangleCell : styles.squareCell}
        >
          <View style={styles.cell}>
            {widget.shape === 'rectangle'
              ?
              <View>
                <EmojiProgressCircle progress={Big(category.amount_spent || 0).div(category.limit_amount).toNumber()}>
                  <Text>{category.emoji}</Text>
                </EmojiProgressCircle>
              </View>
              :
              <EmojiProgressCircle progress={Big(category.amount_spent || 0).div(category.limit_amount).toNumber()}>
                <Text>{category.emoji}</Text>
              </EmojiProgressCircle>
            }
            {(widget.shape === 'rectangle') &&
              <View>
                <Text color='secondaryText' fontSize={13}>{category.name}</Text>
                <View style={styles.amountsContainer}>
                  <DollarCents fontSize={14} value={Big(category.amount_spent || 0).times(100).toNumber()} withCents={false} />
                  <Text fontSize={12}>/</Text>
                  <DollarCents fontSize={14} value={Big(category.limit_amount).toNumber()} withCents={false} />
                </View>
              </View>}
          </View>
        </View>
      ))}
    </View>
  )
}

const CategoriesProgress = (widget: WidgetProps<{ categories?: string[] }>) => {
  return widget.id
    ? widget.args?.categories
      ? <Filled {...widget} />
      : <Selector {...widget} />
    : <PickerOption />
}

export default CategoriesProgress
