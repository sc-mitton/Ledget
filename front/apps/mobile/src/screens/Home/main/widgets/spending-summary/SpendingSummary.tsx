import { View } from 'react-native'

import PickerOption from './PickerOption'
import { WidgetProps } from '@features/widgetsSlice'


const Filled = (props: WidgetProps) => {
  return (
    <View></View>
  )
}

const SpendingSummary = (widget: WidgetProps) => {
  return widget.id ? <Filled {...widget} /> : <PickerOption />
}

export default SpendingSummary
