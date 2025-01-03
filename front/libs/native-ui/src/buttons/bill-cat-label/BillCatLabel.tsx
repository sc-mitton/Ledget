import { View } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import { useTheme } from '@shopify/restyle';

import styles from './styles';
import { Box, BoxProps } from '../../restyled/Box';
import { Text } from '../../restyled/Text';

interface BillCatEmojiProps {
  emoji?: string | null;
  period: 'month' | 'year' | 'once';
  hasBorder?: boolean;
  size?: number;
}

interface BillCatLabelProps extends BillCatEmojiProps {
  name: string;
  children?: React.ReactNode;
  selected?: boolean;
  padding?: number;
  fontSize?: number;
}

interface ProgressEmojiProps extends BillCatEmojiProps {
  progress: number;
}

export function ProgressEmoji(props: ProgressEmojiProps) {
  const theme = useTheme();

  return (
    <View style={styles.progressEmoji}>
      <View style={styles.absEmojiContainer}>
        <Box
          backgroundColor={
            props.period === 'year' ? 'yearBackground' : 'monthBackground'
          }
          borderRadius="circle"
          style={styles.absEmoji}
        >
          <Svg viewBox="0 0 100 100" style={styles.billCatEmojiContainer}>
            <Circle
              cx={50}
              cy={50}
              r={48}
              fill="none"
              opacity={1}
              stroke={
                props.period === 'year'
                  ? theme.colors.yearBorder
                  : theme.colors.monthBorder
              }
              strokeWidth={5}
            />
            <Circle
              cx={50}
              cy={50}
              r={48}
              fill="none"
              stroke={
                props.period === 'year'
                  ? theme.colors.yearColor
                  : theme.colors.monthColor
              }
              strokeLinecap="round"
              strokeWidth={5}
              transform="rotate(-90 50 50)"
              strokeDasharray={`${
                props.progress
                  ? parseFloat(Math.min(1, props.progress).toFixed(2)) * 300
                  : 0
              }, 300`}
            />
          </Svg>
        </Box>
      </View>
      <Text>{props.emoji}</Text>
    </View>
  );
}

export function BillCatEmoji(props: BillCatEmojiProps) {
  const { hasBorder = true, size = 32 } = props;

  return (
    <View style={styles.billCatEmojiContainer}>
      <View style={styles.billCatEmoji}>
        <Box
          backgroundColor={
            props.period === 'year' ? 'yearBackground' : 'monthBackground'
          }
          borderColor={props.period === 'year' ? 'yearBorder' : 'monthBorder'}
          borderWidth={hasBorder ? 1.5 : 0}
          style={[
            styles.background,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        />
      </View>
      <Text>{props.emoji}</Text>
    </View>
  );
}

export function BillCatLabel(props: BillCatLabelProps) {
  const { name, emoji, period, padding = 2, fontSize = 16 } = props;

  return (
    <Box
      style={[styles.billCatLabel, { paddingVertical: padding }]}
      borderWidth={1}
      borderColor={
        props.selected
          ? period === 'year'
            ? 'yearBorder2'
            : 'monthBorder2'
          : period === 'year'
          ? 'yearBackground'
          : 'monthBackground'
      }
      backgroundColor={period === 'year' ? 'yearBackground' : 'monthBackground'}
    >
      <Text>{emoji}</Text>
      <Text
        fontSize={fontSize}
        color={period === 'year' ? 'yearColor' : 'monthColor'}
      >
        {`${name.charAt(0).toUpperCase()}${name.slice(1)}`}
      </Text>
      {props.children}
    </Box>
  );
}

export default BillCatLabel;
