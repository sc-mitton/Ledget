import { ViewBase, View } from 'react-native';

import sharedStyles from './styles/sharedStyles';
import styles from './styles/skeleton';
import { PulseText } from '@ledget/native-ui';
import { WidgetProps } from '@/features/widgetsSlice';

const Skeleton = (widget: WidgetProps) => (
  <View style={styles.container}>
    <View style={sharedStyles.topRow}>
      <View>
        <View style={styles.topRowHeader}>
          <PulseText numberOfLines={1} width={32} borderRadius="xs" />
        </View>
        <View style={sharedStyles.currencyContainer}>
          <PulseText numberOfLines={2} width={64} borderRadius="xs" />
        </View>
      </View>
      {widget.shape === 'rectangle' && (
        <View>
          <View style={styles.topRowHeader}>
            <PulseText numberOfLines={1} width={32} borderRadius="xs" />
          </View>
          <View style={sharedStyles.currencyContainer}>
            <PulseText numberOfLines={2} width={64} borderRadius="xs" />
          </View>
        </View>
      )}
      <View>
        <View style={styles.topRowHeader}>
          <PulseText numberOfLines={1} width={32} borderRadius="xs" />
        </View>
        <View style={sharedStyles.currencyContainer}>
          <PulseText numberOfLines={2} width={64} borderRadius="xs" />
        </View>
      </View>
    </View>
    <View style={styles.skeletonBarsBox}>
      <PulseText
        style={styles.skeletonBarsBox}
        numberOfLines={3}
        borderRadius="s"
      />
    </View>
    <View style={styles.bottomRow}>
      <PulseText numberOfLines={2} width={48} />
    </View>
  </View>
);

export default Skeleton;
