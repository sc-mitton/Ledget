import { View } from 'react-native';
import { useTheme } from '@shopify/restyle';
import {
  ColorProps,
  color,
  composeRestyleFunctions,
  useRestyle,
} from '@shopify/restyle';
import LottieView from 'lottie-react-native';

import { Theme } from '../../theme';
import styles from './styles/spinner';

type RestyleProps = ColorProps<Theme>;
const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([color]);

export const Spinner = ({
  fill,
  ...rest
}: RestyleProps & { fill?: string }) => {
  const restyledProps = useRestyle(restyleFunctions, rest);
  const rawColor = (restyledProps as any).style[0].color;
  const theme = useTheme();

  return (
    <View style={styles.mainContainer}>
      <View style={styles.spinnerContainer}>
        <LottieView
          autoPlay
          loop
          style={{ width: 24, height: 24 }}
          colorFilters={[
            {
              keypath: '360spin slow',
              color: fill || rawColor || theme.colors.quaternaryText,
            },
            {
              keypath: '720spin',
              color: fill || rawColor || theme.colors.quaternaryText,
            },
            {
              keypath: '360spin',
              color: fill || rawColor || theme.colors.quaternaryText,
            },
            {
              keypath: '360 spin',
              color: fill || rawColor || theme.colors.quaternaryText,
            },
          ]}
          source={require('../../assets/loading.json')}
        />
      </View>
    </View>
  );
};
