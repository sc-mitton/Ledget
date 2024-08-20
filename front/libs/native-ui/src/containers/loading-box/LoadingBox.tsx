
import styles from './styles';
import { BoxProps } from "../../restyled/Box";
import { Spinner } from "../../animated/loading-indicators/Spinner";
import { View } from 'react-native';

export const LoadingBox = ({ loading, children, style, ...rest }: BoxProps & { loading?: boolean }) => {

  return (
    <View {...rest} style={[style, styles.outerContainer]}>
      {loading ?
        <Spinner />
        : children}
    </View>
  );
};
