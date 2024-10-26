import { View } from "react-native";
import {
  useRestyle,
  typography,
  TextProps,
  composeRestyleFunctions,
  createText
} from '@shopify/restyle';

import styles from './styles/circle-number';
import { BoxProps, Box } from "./Box";
import { Theme } from '../theme';
import { useRef } from "react";

const Text = createText();

type RestyleProps = TextProps<Theme>;

const restyleTextFunctions = composeRestyleFunctions<Theme, RestyleProps>([typography]);

export type ColorNumberProps = RestyleProps & { value: number, backgroundColor: & BoxProps['backgroundColor'] };

export const ColorNumber = (props: ColorNumberProps) => {
  const { value, backgroundColor, ...rest } = props;
  const circleSize = useRef<number>();

  const textProps = useRestyle(restyleTextFunctions, rest);

  return (
    <View onLayout={(e) => { circleSize.current = e.nativeEvent.layout.width * 3 }}>
      <View style={styles.circleNumberContainer}>
        <Box
          style={styles.circleNumber}
          width={circleSize.current}
          height={circleSize.current}
          borderRadius={'circle'}
          backgroundColor={backgroundColor}
        />
      </View>
      <Text {...textProps}>
        {`${value}`}
      </Text>
    </View>
  )
};
