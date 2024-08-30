import { Check, AlertCircle } from 'geist-native-icons';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import styles from './styles/item';
import { ToastItem as TToastItem, tossToast } from "@ledget/shared-features";
import { Box } from "../../restyled/Box";
import { Icon } from "../../restyled/Icon";
import { Text } from '../../restyled/Text';
import { Button } from '../../restyled/Button';

export const ToastItem = (props: TToastItem) => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  return (
    <Box
      backgroundColor="toast"
      style={styles.toastItem}
      borderColor='toastBorder'
      borderWidth={1}
      shadowColor='mainBackground'
      shadowOffset={{ width: 0, height: 6 }}
      shadowOpacity={1}
      shadowRadius={12}
    >
      <View style={styles.iconContainer}>
        {props.type === 'success' && <Icon icon={Check} color='successIcon' />}
        {props.type === 'error' && <Icon icon={AlertCircle} color="alert" />}
      </View>
      <View style={styles.messageContainer}><Text>{props.message}</Text></View>
      {props.actionLink &&
        <Button
          textColor='secondaryText'
          fontSize={15}
          label={props.actionMessage}
          onPress={() => {
            const args = Array.isArray(props.actionLink) ? props.actionLink : [props.actionLink];
            navigation.navigate(...args);
            dispatch(tossToast(props.id));
          }} />}
    </Box>
  )
}

export default ToastItem
