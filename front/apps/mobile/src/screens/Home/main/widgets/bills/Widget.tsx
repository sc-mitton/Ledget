import { View } from 'react-native'

import PickerOption from './PickerOption'
import { WidgetProps } from '@features/widgetsSlice'

const Filled = (props: WidgetProps) => {
  return (
    <View></View>
  )
}

const Bills = (widget: WidgetProps) => {
  return widget.id ? <Filled {...widget} /> : <PickerOption />
}

export default Bills
