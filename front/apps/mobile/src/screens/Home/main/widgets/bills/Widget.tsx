import PickerOption from './PickerOption';
import { WidgetProps } from '@features/widgetsSlice';
import { useAppSelector } from '@hooks';
import {
  useGetBillsQuery,
  selectBudgetMonthYear,
} from '@ledget/shared-features';

import RectangleFilled from './RectangleFilled';
import SquareFilled from './SquareFilled';

const Bills = (widget: WidgetProps) => {
  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const { isLoading } = useGetBillsQuery(
    { month, year },
    { skip: !month || !year }
  );

  return widget.id ? (
    widget.shape === 'square' ? (
      <SquareFilled {...widget} loading={isLoading} />
    ) : (
      <RectangleFilled {...widget} loading={isLoading} />
    )
  ) : (
    <PickerOption loading={isLoading} />
  );
};

export default Bills;
