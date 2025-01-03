import { ViewBase, View } from 'react-native';

import sharedStyles from './styles/sharedStyles';
import styles from './styles/skeleton';
import { PulseBox } from '@ledget/native-ui';
import { WidgetProps } from '@/features/widgetsSlice';

const Skeleton = (widget: WidgetProps) => (
  <View style={styles.container}>
    <View style={sharedStyles.topRow}>
      <View>
        <View style={styles.topRowHeader}>
          <PulseBox height="s" width={32} borderRadius="xs" />
        </View>
        <View style={sharedStyles.currencyContainer}>
          <PulseBox height="reg" width={64} borderRadius="xs" />
        </View>
      </View>
      {widget.shape === 'rectangle' && (
        <View>
          <View style={styles.topRowHeader}>
            <PulseBox height="s" width={32} borderRadius="xs" />
          </View>
          <View style={sharedStyles.currencyContainer}>
            <PulseBox height="reg" width={64} borderRadius="xs" />
          </View>
        </View>
      )}
      <View>
        <View style={styles.topRowHeader}>
          <PulseBox height="s" width={32} borderRadius="xs" />
        </View>
        <View style={sharedStyles.currencyContainer}>
          <PulseBox height="reg" width={64} borderRadius="xs" />
        </View>
      </View>
    </View>
    <View style={styles.skeletonBarsBox}>
      <PulseBox style={styles.skeletonBarsBox} height="l" borderRadius="s" />
    </View>
    <View style={styles.bottomRow}>
      <PulseBox height="reg" width={48} />
    </View>
  </View>
);

export default Skeleton;
