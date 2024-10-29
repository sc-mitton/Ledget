
import { WidgetProps } from '@features/widgetsSlice'
import PickerOption from './PickerOption'
import Widget from './Widget';

const CreditCardsBalance = (widget: WidgetProps<{ accounts: string[] }>) => {
  return widget.id
    ? <Widget {...widget} />
    : <PickerOption />
}

export default CreditCardsBalance
