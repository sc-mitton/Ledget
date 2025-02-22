import { View } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Svg, Circle } from 'react-native-svg';

import styles from './styles/emoji-progress-circle';
import { Box, Text } from '@ledget/native-ui';
import { useAppearance } from '@/features/appearanceSlice';

interface ProgressEmojiProps {
  emoji?: string | null;
  period?: 'month' | 'year' | 'once';
  progress?: number;
  children?: React.ReactNode;
}

function EmojiProgressCircle(props: ProgressEmojiProps) {
  const theme = useTheme();
  const { mode } = useAppearance();

  return (
    <Box style={styles.progressEmoji} backgroundColor="nestedContainer">
      <View style={styles.absEmojiContainer}>
        <Box
          borderRadius="circle"
          backgroundColor="nestedContainer"
          style={styles.absEmoji}
        >
          <Svg viewBox="0 0 230 230" style={styles.billCatEmojiContainer}>
            <Circle
              cx={115}
              cy={115}
              r={100}
              fill="none"
              opacity={0.5}
              stroke={
                props.period === 'year'
                  ? theme.colors.yearBorder
                  : props.period === 'month'
                  ? theme.colors.monthBorder
                  : theme.colors.pulseBox
              }
              strokeWidth={18}
            />
            <Circle
              cx={115}
              cy={115}
              r={100}
              fill="none"
              opacity={mode === 'dark' ? 0.7 : 0.4}
              stroke={
                props.period === 'year'
                  ? theme.colors.yearColor
                  : props.period === 'month'
                  ? theme.colors.monthColor
                  : theme.colors.quaternaryText
              }
              strokeLinecap="round"
              strokeWidth={18}
              transform="rotate(-90 115 115)"
              strokeDasharray={`${
                props.progress
                  ? parseFloat(Math.min(1, props.progress).toFixed(2)) * 628
                  : 0
              }, 628`}
            />
          </Svg>
        </Box>
      </View>
      {props.emoji ? <Text>{props.emoji}</Text> : props.children}
    </Box>
  );
}

export default EmojiProgressCircle;
