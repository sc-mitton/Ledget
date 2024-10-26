import { View } from 'react-native'

import styles from './styles/credit-cards-balance';
import { useGetCategoriesQuery } from '@ledget/shared-features'
import { WidgetProps } from '@features/widgetsSlice'
import { useAppDispatch } from '@/hooks'
import PickerOption from './PickerOption'

const Selector = () => {
  const dispatch = useAppDispatch()

  return (
    <View>

    </View>
  )
}

const Filled = (widget: WidgetProps) => {
  const { data: categories } = useGetCategoriesQuery()

  return (
    <View>

    </View>
  )
}

const CreditCardsBalance = (widget: WidgetProps) => {
  return widget.args
    ? <Filled {...widget} />
    : <PickerOption />
}

export default CreditCardsBalance
