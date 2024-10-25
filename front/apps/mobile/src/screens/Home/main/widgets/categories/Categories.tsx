import { View } from 'react-native'

import styles from './styles/widget';
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

const Filled = (widget: WidgetProps<{ categories?: string[] }>) => {
  const { data: categories } = useGetCategoriesQuery()

  return (
    <View>

    </View>
  )
}

const CategoriesProgress = (widget: WidgetProps<{ categories?: string[] }>) => {
  return widget.args?.categories
    ? <Filled {...widget} />
    : <PickerOption />
}

export default CategoriesProgress
