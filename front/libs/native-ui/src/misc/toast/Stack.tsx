import { View, NativeModules } from 'react-native';

import styles from './styles/stack';
import { ToastItem as TToastItem } from "@ledget/shared-features";
import ToastItem from "./Item";

const { StatusBarManager } = NativeModules;

export const ToastStack = ({ stack }: { stack: TToastItem[] }) => {
  return (
    <View style={[styles.toastStack, { top: StatusBarManager.HEIGHT + 8 }]}>
      {stack.map((item, index) => (
        <ToastItem {...item} index={index} key={item.id} />
      ))}
    </View>
  )
}
