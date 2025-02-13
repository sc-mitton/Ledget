import { View, NativeModules } from 'react-native';

import styles from './styles/stack';
import { ToastItem as TToastItem } from '@ledget/shared-features';
import ToastItem from './Item';

const { StatusBarManager } = NativeModules;

export const ToastStack = ({ stack }: { stack: TToastItem[] }) => {
  return (
    <>
      <View style={[styles.toastStack, { top: StatusBarManager.HEIGHT + 8 }]}>
        {stack
          .filter((t) => t.location === 'top' || t.location === undefined)
          .map((item, index) => (
            <ToastItem {...item} index={index} key={item.id} />
          ))}
      </View>
      <View style={[styles.toastStack, styles.bottomToastStack]}>
        {stack
          .filter((t) => t.location === 'bottom')
          .map((item, index) => (
            <ToastItem {...item} index={index} key={item.id} />
          ))}
      </View>
    </>
  );
};
