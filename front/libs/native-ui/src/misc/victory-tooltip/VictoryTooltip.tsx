import { ChartPressState, ChartBounds } from 'victory-native';
import { useDerivedValue } from 'react-native-reanimated';
import {
  Text as SkText,
  vec,
  Circle,
  RoundedRect,
  Line as SkLine,
  SkFont
} from '@shopify/react-native-skia';

/* eslint-disable-next-line */
export interface VictoryTooltipProps {
  font: SkFont | null;
  state: ChartPressState<{
    x: string;
    y: { balance: number };
  }>,
  xAxisTip?: boolean;
  chartBounds: ChartBounds
  color: string;
  xAxisTipColor?: string;
  dotColor: string;
  borderColor: string;
  backgroundColor?: string;
  lineOffset?: number;
  verticalCrosshair?: boolean;
}

export const VictoryTooltip = (props: VictoryTooltipProps) => {
  const {
    state,
    font,
    chartBounds,
    dotColor,
    color,
    borderColor,
    backgroundColor,
    lineOffset = 0,
    verticalCrosshair = false,
    xAxisTip = false,
    xAxisTipColor
  } = props;

  const value = useDerivedValue(() => {
    return "$" + `${state.y.balance.value.value}`.split('.')[0];
  }, [state]);

  const rectHeight = 24;

  const rectWidth = useDerivedValue(() => {
    if (!font) {
      return 0;
    }
    return font.measureText(value.value).width + 16;
  }, [value, font]);

  const lineTop = useDerivedValue(() => {
    return vec(state.x.position.value, state.y.balance.position.value);
  }, [state]);

  const lineBottom = useDerivedValue(() => {
    return vec(state.x.position.value, chartBounds.bottom + lineOffset);
  }, [state, lineOffset, chartBounds]);

  const textYPosition = useDerivedValue(() => {
    return state.y.balance.position.value - 16;
  }, [value]);

  const textXPosition = useDerivedValue(() => {
    if (!font) {
      return 0;
    } else if (state.x.position.value > chartBounds.right - 50) {
      return state.x.position.value - font.measureText(value.value).width - 6
    } else if (state.x.position.value < chartBounds.left + 50) {
      return state.x.position.value + 6;
    }

    return (
      state.x.position.value - font.measureText(value.value).width / 2
    );
  }, [value, font, state, chartBounds]);

  const rectXPosition = useDerivedValue(() => {
    return textXPosition.value - 8;
  }, [value, rectWidth]);

  const rectYPosition = useDerivedValue(() => {
    return textYPosition.value - rectHeight / 1.5;
  }, [value, rectHeight]);


  const tooltipDate = useDerivedValue(() => {
    if (!state.x.value.value) return ''
    return state.x.value.value
  }, [state])

  const tooltipDateXPos = useDerivedValue(() => {
    if (!font) {
      return 0;
    } else if (state.x.position.value > chartBounds.right - 50) {
      return state.x.position.value - font.measureText(tooltipDate.value).width - 6
    } else if (state.x.position.value < chartBounds.left + 50) {
      return state.x.position.value + 6;
    }

    return (
      state.x.position.value - font.measureText(tooltipDate.value).width / 2
    )
  }, [state, font, tooltipDate])

  return (
    <>
      {verticalCrosshair &&
        <SkLine
          p1={lineTop}
          p2={lineBottom}
          strokeCap={'round'}
          strokeWidth={2}
          color={borderColor}
        />}
      {xAxisTip && (
        <SkText
          text={tooltipDate}
          font={font}
          color={xAxisTipColor || color}
          x={tooltipDateXPos}
          y={chartBounds.bottom}
        />
      )}
      <RoundedRect
        x={rectXPosition}
        y={rectYPosition}
        width={rectWidth}
        height={rectHeight}
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
      <Circle
        cx={state.x.position}
        cy={state.y.balance.position}
        r={3}
        color={dotColor}
      />
    </>
  )
}
