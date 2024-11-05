import { WidgetProps } from '@features/widgetsSlice';
import PickerOption from './PickerOption';
import Filled from './Filled';

const SpendingVsIncome = (widget: WidgetProps) => {
  return widget.args
    ? <Filled {...widget} />
    : <PickerOption />
}

export default SpendingVsIncome
