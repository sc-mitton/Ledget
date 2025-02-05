import { ChartPressState, ChartBounds } from 'victory-native';
import {
  useDerivedValue,
  SharedValue,
  withTiming,
  useSharedValue,
  Easing,
  withRepeat,
  withSequence,
  withDelay,
  interpolate,
} from 'react-native-reanimated';
import {
  Text as SkText,
  vec,
  Circle,
  RoundedRect,
  Line as SkLine,
  SkFont,
  Group,
} from '@shopify/react-native-skia';
import { useEffect, useState } from 'react';

/* eslint-disable-next-line */
export interface VictoryTooltipProps {
  font: SkFont | null;
  state: ChartPressState<{
    x: string;
    y: { balance: number };
  }>;
  isActive: SharedValue<boolean>;
  chartBounds: ChartBounds;
  color: string;
  xAxisTipColor?: string;
  dotColor: string;
  borderColor: string;
  backgroundColor?: string;
  lineOffset?: number;
  hidden?: ('point' | 'verticalCrossHair' | 'tip' | 'xTip')[];
  duration?: number;
}

const RECT_HEIGHT = 24;
const DEFAULT_DURATION = 200;

export const VictoryTooltip = (props: VictoryTooltipProps) => {
  const {
    isActive,
    state,
    font,
    chartBounds,
    dotColor,
    color,
    borderColor,
    backgroundColor,
    lineOffset = 0,
    duration = DEFAULT_DURATION,
    xAxisTipColor,
  } = props;

  const [isSet, setIsSet] = useState(false);
  const innerPulseRadius = useSharedValue(0);
  const outerPulseRadius = useSharedValue(3);
  const groupScale = useSharedValue(1);

  useEffect(() => {
    if (state.isActive.value) {
      setTimeout(() => {
        setIsSet(true);
      }, 0);
    } else {
      setIsSet(false);
    }
  }, [state.isActive.value]);

  useEffect(() => {
    if (state.isActive.value) {
      groupScale.value = withTiming(1, { duration: 200 });
      innerPulseRadius.value = withTiming(3, { duration: 200 });
      outerPulseRadius.value = withDelay(
        200,
        withRepeat(
          withSequence(
            withTiming(12, {
              duration: 1400,
              easing: Easing.inOut(Easing.ease),
            }),
            withTiming(3, { duration: 0 })
          ),
          -1,
          true
        )
      );
    } else {
      innerPulseRadius.value = 0;
      outerPulseRadius.value = 3;
      groupScale.value = 0;
    }
  }, [state.isActive.value]);

  const value = useDerivedValue(() => {
    return (
      '$' +
      `${state.y.balance.value.value}`
        .split('.')[0]
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    );
  }, [state]);

  const animatedTransform = useDerivedValue(() => {
    return [{ scale: groupScale.value }];
  });

  const animatedPulseInnerRadius = useDerivedValue(() => {
    return innerPulseRadius.value;
  }, [innerPulseRadius]);

  const animatedPulseOuterRadius = useDerivedValue(() => {
    return outerPulseRadius.value;
  }, [outerPulseRadius]);

  const animatedPulseOpacity = useDerivedValue(() => {
    return interpolate(outerPulseRadius.value, [8, 12], [0.2, 0]);
  }, [outerPulseRadius]);

  const rectWidth = useDerivedValue(() => {
    let width: number;
    if (!font) {
      width = 0;
    } else {
      width = font.measureText(value.value).width + 16;
    }
    return width;
  }, [value, font]);

  const circleX = useDerivedValue(() => {
    return isSet
      ? withTiming(state.x.position.value, {
          duration,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        })
      : state.x.position.value;
  }, [state, isSet]);

  const circleY = useDerivedValue(() => {
    return isSet
      ? withTiming(state.y.balance.position.value, {
          duration,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        })
      : state.y.balance.position.value;
  }, [state, isSet]);

  const lineTop = useDerivedValue(() => {
    return vec(circleX.value, circleY.value);
  }, [circleX, circleY]);

  const lineBottom = useDerivedValue(() => {
    return vec(circleX.value, chartBounds.bottom + lineOffset);
  }, [state, lineOffset, chartBounds]);

  const textYPosition = useDerivedValue(() => {
    return isSet
      ? withTiming(state.y.balance.position.value - 16, {
          duration,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        })
      : state.y.balance.position.value - 16;
  }, [value, isSet]);

  const textXPosition = useDerivedValue(() => {
    let pos: number;
    if (!font) {
      pos = 0;
    } else if (state.x.position.value > chartBounds.right - 50) {
      pos = state.x.position.value - font.measureText(value.value).width - 16;
    } else if (state.x.position.value < chartBounds.left + 50) {
      pos = state.x.position.value + 16;
    } else {
      pos = state.x.position.value - font.measureText(value.value).width / 2;
    }

    return isSet
      ? withTiming(pos, { duration, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
      : pos;
  }, [value, font, state, chartBounds, isSet]);

  const rectXPosition = useDerivedValue(() => {
    return textXPosition.value - 8;
  }, [textXPosition]);

  const rectYPosition = useDerivedValue(() => {
    return textYPosition.value - 26 / 1.5;
  }, [value]);

  const tooltipDate = useDerivedValue(() => {
    if (!state.x.value.value) {
      return '';
    } else {
      return new Date(state.x.value.value).toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
      });
    }
  }, [state]);

  const tooltipDateXPos = useDerivedValue(() => {
    let pos: number;
    if (!font) {
      pos = 0;
    } else if (state.x.position.value > chartBounds.right - 50) {
      pos =
        state.x.position.value - font.measureText(tooltipDate.value).width - 6;
    } else if (state.x.position.value < chartBounds.left + 50) {
      pos = state.x.position.value + 6;
    } else {
      pos =
        state.x.position.value - font.measureText(tooltipDate.value).width / 2;
    }

    return isSet
      ? withTiming(pos, { duration, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
      : pos;
  }, [state, font, tooltipDate, isSet]);

  const tooltipDateYPos = useDerivedValue(() => {
    return textYPosition.value + 44;
  }, [textYPosition]);

  return (
    <>
      {!props.hidden?.includes('verticalCrossHair') && isActive.value && (
        <SkLine
          p1={lineTop}
          p2={lineBottom}
          strokeCap={'round'}
          strokeWidth={2}
          color={borderColor}
        />
      )}
      <Group
        transform={animatedTransform}
        origin={{ x: circleX.value, y: circleY.value }}
      >
        {!props.hidden?.includes('xTip') && isActive.value && (
          <SkText
            text={tooltipDate}
            font={font}
            color={xAxisTipColor || color}
            x={tooltipDateXPos}
            y={chartBounds.bottom}
          />
        )}
        {!props.hidden?.includes('tip') && isActive.value && (
          <>
            <RoundedRect
              x={rectXPosition}
              y={rectYPosition}
              width={rectWidth}
              height={RECT_HEIGHT}
              r={12}
              color={backgroundColor}
            />
            <SkText
              x={textXPosition}
              y={textYPosition}
              font={font}
              color={color}
              text={value}
            />
          </>
        )}
      </Group>
      {!props.hidden?.includes('point') && isActive.value && (
        <>
          <Circle
            cx={circleX}
            cy={circleY}
            r={animatedPulseInnerRadius}
            color={dotColor}
          />
          <Circle
            cx={circleX}
            cy={circleY}
            r={animatedPulseOuterRadius}
            opacity={animatedPulseOpacity}
            color={dotColor}
          />
        </>
      )}
    </>
  );
};
