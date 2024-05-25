
import { Theme } from "@nivo/core"
import { LineSvgProps } from '@nivo/line';
import { useSchemeVar } from './hooks/use-scheme-var/use-scheme-var'

// Define the type for your base props
type NivoResponsiveLineBaseProps = Omit<LineSvgProps, 'data'>

export const useNivoResponsiveBaseProps = ({ disabled = false }: { disabled?: boolean }): NivoResponsiveLineBaseProps => {
    const [mainColor, mainSat, window] = useSchemeVar(['--monthly-background-color-darker', '--blue', '--window'])

    return ({
        enablePoints: true,
        pointColor: window,
        pointSize: disabled ? 0 : 7,
        pointBorderColor: disabled ? 'transparent' : mainColor,
        pointBorderWidth: disabled ? 0 : 1,
        enableArea: true,
        enableGridX: false,
        enableGridY: true,
        lineWidth: 1,
        curve: 'natural',
        colors: [!disabled ? mainColor : 'transparent'],
        useMesh: !disabled,
        defs: [
            {
                id: 'gradientC',
                type: 'linearGradient',
                colors: [
                    { offset: 0, color: mainSat, opacity: disabled ? 0 : 1, },
                    { offset: 100, color: window, opacity: disabled ? 0 : 1, },
                ],
            },
        ],
        fill: [{ match: '*', id: 'gradientC' }],
        motionConfig: {
            mass: 1,
            friction: 70,
            tension: 400,
        },
        crosshairType: "bottom"
    })
}

export const useNivoResponsiveLineTheme = (): Theme => {
    const [mainHlightHover, borderColor, mTextSecondary] = useSchemeVar([
        '--blue-light-hover', '--border-color', '--m-text-secondary'])

    return ({
        crosshair: {
            line: {
                stroke: mainHlightHover,
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
    })
}

export const useMinimalistNivoResponsiveBaseProps = (
    { primaryColor = '--blue', gradientColorStart = '--blue', gradientColorEnd }:
        { primaryColor?: `--${string}`, gradientColorStart?: `--${string}`, gradientColorEnd?: `--${string}` }
): NivoResponsiveLineBaseProps => {
    const primary = useSchemeVar(primaryColor)
    const gradientColors = useSchemeVar(gradientColorEnd ? [gradientColorStart, gradientColorEnd] : gradientColorStart)

    return ({
        enablePoints: true,
        enableArea: true,
        pointColor: primary,
        pointSize: 5,
        pointBorderColor: primary,
        pointBorderWidth: 1,
        enableGridY: false,
        enableGridX: false,
        lineWidth: 1.5,
        curve: 'natural',
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
                        offset: 0, color: gradientColors
                            ? typeof gradientColors === 'string' ? gradientColors
                                : gradientColors[0] : 'transparent'
                    },
                    {
                        offset: 50, color: gradientColors
                            ? typeof gradientColors === 'string' ? gradientColors
                                : gradientColors[1] : 'transparent'
                    },
                ],
            },
        ],
        fill: [{ match: '*', id: 'gradientC' }],
    })
}

export const useMinimalistNivoResponsiveLineTheme = ({ primaryColor = '--blue' }: { primaryColor?: `--${string}` }): Theme => {
    const primary = useSchemeVar(primaryColor)

    return ({
        text: {
            fontSize: 11,
            fontWeight: 500,
            fill: primary,
            outlineColor: "transparent"
        },
        axis: {
            ticks: {
                line: { strokeWidth: 0 },
                text: {
                    fontSize: 12,
                    fontFamily: 'inherit',
                    fontWeight: 400,
                    fill: primary,
                },
            },
        },
    })
}


export const useStripeCardTheme = ({ focus, isDark }: { focus: boolean, isDark?: boolean }) => ({
    style: {
        base: {
            fontFamily: "Source Sans Pro, sans-serif",
            color: isDark ? '#e2e2e9' : '#292929',
            fontSmoothing: 'antialiased',
            fontSize: '1.05em',
            '::placeholder': {
                color:
                    isDark
                        ? focus ? '#c7d8ff' : '#606060'
                        : focus ? '#9c9cf0' : '#a1a1a1',
            },
            iconColor:
                isDark
                    ? focus ? '#a7b9eb' : '#e3e7f1'
                    : focus ? '#7575f0' : '#a1a1a1',
            ':disabled': {
                color: '#767676',
                iconColor: '#767676'
            }
        },
        invalid: {
            fontFamily: 'Source Sans Pro, sans-serif',
            color: '#f47788',
            iconColor: '#f47788'
        }
    }
})
