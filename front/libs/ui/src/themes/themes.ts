
import { Theme } from "@nivo/core"
import { LineSvgProps } from '@nivo/line';
import { ThemeConfig } from 'antd';
import { useSchemeVar } from '../utils/hooks/use-scheme-var/use-scheme-var'

// Define the type for your base props
type NivoResponsiveLineBaseProps = Omit<LineSvgProps, 'data'>

export const useNivoResponsiveBaseProps = ({ disabled = false }: { disabled?: boolean }): NivoResponsiveLineBaseProps => {
    const [mainColorHover, mainSat, window] = useSchemeVar(['--main-color-hover', '--main-sat', '--window'])

    return ({
        enablePoints: true,
        pointColor: window,
        pointSize: 7,
        pointBorderColor: disabled ? 'transparent' : mainColorHover,
        pointBorderWidth: 1.75,
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
    const [mainHlightHover, borderColorDimmest, mTextSecondary] = useSchemeVar([
        '--main-hlight-hover', '--border-color-dimmest', '--m-text-secondary'])

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
                stroke: borderColorDimmest,
                strokeWidth: 1.5,
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

export const ledgetAntTheme: ThemeConfig = {
    token: {
        colorPrimary: '#385fa8',
        boxShadow: 'var(--antd-drop-shadow)',
        borderRadius: 8,
        colorBgContainer: 'var(--input-background)',
        colorTextPlaceholder: '#a6a6a6',
        colorBorder: 'transparent',
    },
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
                        ? focus ? '#4b539b' : '#606060'
                        : focus ? '#949de0' : '#767676',
            },
            iconColor:
                isDark
                    ? focus ? '#7b97ff' : '#cbcbcb'
                    : focus ? '#2759d8' : '#767676',
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
