
import { Theme } from "@nivo/core"
import { LineSvgProps } from '@nivo/line';
import { useSchemeVar } from './hooks/use-scheme-var/use-scheme-var'

// Define the type for your base props
type NivoResponsiveLineBaseProps = Omit<LineSvgProps, 'data'>

export const useNivoResponsiveBaseProps = ({ disabled = false }: { disabled?: boolean }): NivoResponsiveLineBaseProps => {
    const [mainColorHover, mainSat, window] = useSchemeVar(['--monthly-color-hover', '--blue', '--window'])

    return ({
        enablePoints: true,
        pointColor: window,
        pointSize: disabled ? 0 : 7,
        pointBorderColor: disabled ? 'transparent' : mainColorHover,
        pointBorderWidth: disabled ? 0 : 1.75,
        enableArea: true,
        enableGridX: false,
        enableGridY: true,
        lineWidth: 1,
        curve: 'catmullRom',
        colors: [!disabled ? mainColorHover : 'transparent'],
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
        }
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
