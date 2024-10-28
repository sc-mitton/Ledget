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

export type ColorNumberProps = RestyleProps & {
  value: number,
  backgroundColor: & BoxProps['backgroundColor'],
  size?: number,
};

export const ColorNumber = (props: ColorNumberProps) => {
  const { value, backgroundColor, size = 24, ...rest } = props;

  const textProps = useRestyle(restyleTextFunctions, rest);

  return (
    <View style={[styles.container, { width: size, height: size, }]}>
      <Box
        width={size}
        height={size}
        borderRadius={'circle'}
        backgroundColor={backgroundColor}
      />
      <View style={styles.circleNumberContainer}>
        <View style={styles.circleNumber}>
          <Text {...textProps}>{`${value}`}</Text>
        </View>
      </View>
    </View>
  )
};
