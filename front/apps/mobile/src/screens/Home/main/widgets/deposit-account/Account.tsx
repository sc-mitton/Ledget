import { View } from 'react-native';

import PickOption from './PickOption';
import { WidgetProps } from '@features/widgetsSlice';
import Filled from './Filled';
import Selector from './Selector';

const AccountsBalance = (widget: WidgetProps<{ account: string }>) => {
  return widget.id ? (
    widget.args ? (
      <Filled {...widget} />
    ) : (
      <Selector {...widget} />
    )
  ) : (
    <PickOption />
  );
};

export default AccountsBalance;
