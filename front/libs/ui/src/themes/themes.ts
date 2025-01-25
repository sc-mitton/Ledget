import { Theme } from '@nivo/core';
import { LineSvgProps } from '@nivo/line';
import { useSchemeVar } from './hooks/use-scheme-var/use-scheme-var';

// Define the type for your base props
type NivoResponsiveLineBaseProps = Omit<LineSvgProps, 'data'>;

export const useNivoResponsiveBaseProps = ({
  disabled = false,
  primaryColor = '--blue',
  gradientColorStart = '--blue',
  gradientColorEnd,
  borderColor,
  curve = 'linear',
  ...rest
}: {
  disabled?: boolean;
  primaryColor?: `--${string}`;
  gradientColorStart?: `--${string}`;
  gradientColorEnd?: `--${string}`;
  borderColor?: `--${string}`;
  curve?: NivoResponsiveLineBaseProps['curve'];
} & NivoResponsiveLineBaseProps): NivoResponsiveLineBaseProps => {
  const primary = useSchemeVar(primaryColor);
  const gradientColors = useSchemeVar(
    gradientColorEnd
      ? [gradientColorStart, gradientColorEnd]
      : gradientColorStart
  );

  return {
    enablePoints: true,
    pointColor: 'transparent',
    enableArea: true,
    enableGridX: false,
    enableGridY: true,
    lineWidth: 2,
    curve,
    colors: [primary || 'transparent'],
    useMesh: !disabled,
    defs: [
      {
        id: 'gradientC',
        type: 'linearGradient',
        colors: [
          {
            offset: 0,
            color: gradientColors
              ? typeof gradientColors === 'string'
                ? gradientColors
                : gradientColors[0]
              : 'transparent',
          },
          {
            offset: 100,
            color: gradientColors
              ? typeof gradientColors === 'string'
                ? gradientColors
                : gradientColors[1]
              : 'transparent',
          },
        ],
      },
    ],
    fill: [{ match: '*', id: 'gradientC' }],
    motionConfig: {
      mass: 1,
      friction: 70,
      tension: 400,
    },
    crosshairType: 'bottom',
    ...rest,
  };
};

export const useNivoResponsiveLineTheme = (): Theme => {
  const [borderColor, mTextSecondary] = useSchemeVar([
    '--border-color',
    '--m-text-secondary',
  ]);

  return {
    crosshair: {
      line: {
        stroke: borderColor,
        strokeWidth: 1.5,
        strokeDasharray: 'solid',
      },
    },
    grid: {
      line: {
        stroke: borderColor,
        strokeWidth: 1,
        strokeDasharray: '2, 2',
        fill: mTextSecondary,
      },
    },
    axis: {
      ticks: {
        line: { strokeWidth: 0 },
        text: {
          fontSize: 12,
          fontFamily: 'inherit',
          fontWeight: 400,
          fill: mTextSecondary,
        },
      },
    },
  };
};

export const useMinimalistNivoResponsiveBaseProps = ({
  primaryColor = '--blue',
  gradientColorStart = '--blue',
  gradientColorEnd,
  borderColor,
  curve = 'linear',
}: {
  primaryColor?: `--${string}`;
  gradientColorStart?: `--${string}`;
  gradientColorEnd?: `--${string}`;
  borderColor?: `--${string}`;
  curve?: NivoResponsiveLineBaseProps['curve'];
}): NivoResponsiveLineBaseProps => {
  const primary = useSchemeVar(primaryColor);
  const gradientColors = useSchemeVar(
    gradientColorEnd
      ? [gradientColorStart, gradientColorEnd]
      : gradientColorStart
  );

  return {
    enablePoints: true,
    enableArea: true,
    pointColor: primary,
    pointSize: 0,
    enableGridY: false,
    enableGridX: true,
    lineWidth: 2,
    curve,
    colors: [primary || 'transparent'],
    useMesh: true,
    motionConfig: {
      mass: 1,
      friction: 70,
      tension: 400,
    },
    enableCrosshair: false,
    axisBottom: {
      tickSize: 0,
      tickPadding: 10,
      tickRotation: 0,
      legendOffset: 36,
      legendPosition: 'middle',
    },
    axisLeft: {
      tickSize: 0,
      tickPadding: 10,
      tickRotation: 0,
      legend: '',
      legendOffset: -40,
      legendPosition: 'middle',
      format: (value: number) => '',
    },
    defs: [
      {
        id: 'gradientC',
        type: 'linearGradient',
        colors: [
          {
            offset: 0,
            color: gradientColors
              ? typeof gradientColors === 'string'
                ? gradientColors
                : gradientColors[0]
              : 'transparent',
          },
          {
            offset: 100,
            color: gradientColors
              ? typeof gradientColors === 'string'
                ? gradientColors
                : gradientColors[1]
              : 'transparent',
          },
        ],
      },
    ],
    fill: [{ match: '*', id: 'gradientC' }],
  };
};

export const useMinimalistNivoResponsiveLineTheme = ({
  primaryColor = '--blue',
}: {
  primaryColor?: `--${string}`;
}): Theme => {
  const primary = useSchemeVar(primaryColor);

  return {
    grid: {
      line: {
        opacity: 0,
        strokeWidth: 0,
      },
    },
    text: {
      fontSize: 11,
      fontWeight: 500,
      fill: primary,
      outlineColor: 'transparent',
    },
    axis: {
      ticks: {
        line: { strokeWidth: 0 },
        text: {
          fontSize: 12,
          fontFamily: 'inherit',
          fontWeight: 400,
          fill: 'var(--m-text-quaternary)',
        },
      },
    },
  };
};

export const useStripeCardTheme = ({
  focus,
  isDark,
}: {
  focus: boolean;
  isDark?: boolean;
}) => ({
  style: {
    base: {
      fontFamily: 'Source Sans Pro, sans-serif',
      color: isDark ? '#e2e2e9' : '#292929',
      fontSmoothing: 'antialiased',
      fontSize: '1.05em',
      '::placeholder': {
        color: isDark
          ? focus
            ? '#c7d8ff'
            : '#606060'
          : focus
          ? '#9c9cf0'
          : '#a1a1a1',
      },
      iconColor: isDark
        ? focus
          ? '#a7b9eb'
          : '#e3e7f1'
        : focus
        ? '#7575f0'
        : '#a1a1a1',
      ':disabled': {
        color: '#767676',
        iconColor: '#767676',
      },
    },
    invalid: {
      fontFamily: 'Source Sans Pro, sans-serif',
      color: '#f47788',
      iconColor: '#f47788',
    },
  },
});
