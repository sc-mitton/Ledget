import { TextProps, View } from 'react-native';

import styles from './styles/widget-header';
import { Text } from '@ledget/native-ui';

const WidgetHeader = (props: TextProps) => {
  return (
    <>
      <View style={styles.widgetHeader}>
        <Text fontSize={13} color="secondaryText" variant="bold">
          {props.children}
        </Text>
      </View>
    </>
  );
};

export default WidgetHeader;
