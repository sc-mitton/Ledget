import { useMemo, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { ChevronRight } from 'geist-native-icons'
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition
} from 'react-native-reanimated'
import Big from 'big.js'

import styles from './styles/list';
import { DollarCents, ProgressEmoji, Icon, Text, Button } from '@ledget/native-ui'
import { Category } from '@ledget/shared-features'
import { BudgetScreenProps } from '@types'

type Props = {
  period: Category['period']
  categories: Category[]
} & BudgetScreenProps<'Main'>

const COLLAPSED_MAX = 5;

const List = (props: Props) => {
  const [expanded, setExpanded] = useState(false)
  const [maxAmountSpentSize, setMaxAmountSpentSize] = useState(0)
  const [maxLimitAmountSize, setMaxLimitAmountSize] = useState(0)

  const hasOverflow = useMemo(() => {
    return (props.categories?.filter(c => c.period === props.period).length || 0) > COLLAPSED_MAX
  }, [props.categories, props.period])

  return (
    <View>
      <View style={[styles.rows, hasOverflow && styles.rowsWithOverflow]}>
        {props.categories?.filter(c => c.period === props.period)
          .slice(0, expanded ? undefined : COLLAPSED_MAX)
          .map((item, index) =>
            <Animated.View key={item.id} entering={FadeIn} exiting={FadeOut}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.row}
                onPress={() => props.navigation.navigate('Category', { category: item })}
              >
                <View>
                  <ProgressEmoji
                    size={20}
                    progress={Math.max(Big(item.amount_spent || 0).div(item.limit_amount || 1).toNumber(), .02)}
                    emoji={item.emoji}
                    period={item.period}
                  />
                </View>
                <View style={styles.name}>
                  <Text>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
                </View>
                <View
                  style={[styles.amountSpent, { width: maxAmountSpentSize || 'auto' }]}
                  onLayout={({ nativeEvent }) => {
                    setMaxAmountSpentSize(Math.max(nativeEvent.layout.width, maxAmountSpentSize))
                  }}
                >
                  <DollarCents value={Big(item.amount_spent || 0).times(100).toNumber()} withCents={false} />
                </View>
                <Text>/</Text>
                <View
                  style={[styles.limitAmount, { width: maxLimitAmountSize || 'auto' }]}
                  onLayout={({ nativeEvent }) => {
                    setMaxLimitAmountSize(Math.max(nativeEvent.layout.width, maxLimitAmountSize))
                  }}
                >
                  <DollarCents value={Big(item.limit_amount || 0).toNumber()} withCents={false} />
                </View>
                <Icon icon={ChevronRight} color='quinaryText' />
              </TouchableOpacity>
            </Animated.View>
          )}
      </View>
      {hasOverflow &&
        <Animated.View style={styles.expandButtonContainer} layout={LinearTransition}>
          <Button
            style={styles.expandButton}
            onPress={() => {
              setExpanded(!expanded)
            }}
            label={
              expanded
                ? 'View Less'
                : `View More +${(props.categories?.filter(c => c.period === props.period).length || 0) - COLLAPSED_MAX}`
            }
            textColor='quinaryText'
          />
        </Animated.View>}
    </View>
  )
}

export default List;
