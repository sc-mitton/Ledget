import { Investment } from '@ledget/shared-features';
import { WidgetProps } from '@features/widgetsSlice';
import { windows } from './constants';

export type Props = WidgetProps<{
  window?: (typeof windows)[number];
  investment: string;
}>;
