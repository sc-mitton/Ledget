
import { Theme } from "@nivo/core"
import { LineSvgProps } from '@nivo/line';
import { ThemeConfig } from 'antd'; ``

// Define the type for your base props
type NivoResponsiveLineBaseProps = Omit<LineSvgProps, 'data'>

export function nivoResponsiveLineBaseProps({ disabled = false }: { disabled?: boolean }): NivoResponsiveLineBaseProps {
    return ({
        enablePoints: true,
        enableArea: true,
        enableGridX: false,
        enableGridY: true,
        lineWidth: 1,
        curve: 'catmullRom',
        colors: [!disabled ? 'var(--main-color-hover)' : 'transparent'],
        useMesh: !disabled,
        defs: [
            {
                id: 'gradientC',
                type: 'linearGradient',
                colors: [
                    { offset: 0, color: 'var(--main-sat)', opacity: disabled ? 0 : 1, },
                    { offset: 100, color: 'var(--window)', opacity: disabled ? 0 : 1, },
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

export const nivoResponsiveLineTheme: Theme = {
    crosshair: {
        line: {
            stroke: 'var(--main-hlight)',
            strokeWidth: 1.5,
            strokeDasharray: 'solid',
        },
    },
    grid: {
        line: {
            stroke: 'var(--subtle-border-color)',
            strokeWidth: 1.5,
            strokeDasharray: 'solid',
            fill: 'var(--m-text-secondary)',
        },
    },
    axis: {
        ticks: {
            line: { strokeWidth: 0 },
            text: {
                fontSize: 12,
                fontFamily: 'inherit',
                fontWeight: 400,
                fill: 'var(--m-text-secondary)',
            },
        },
    },
}

export const ledgetAntTheme: ThemeConfig = {
    token: {
        colorPrimary: '#2d3353',
        boxShadow: 'var(--antd-drop-shadow)',
        borderRadius: 8,
        colorBgContainer: 'var(--input-background)',
        colorBorder: 'var(--input-border-color)',
        colorTextPlaceholder: '#a6a6a6',
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
                    ? focus ? '#7b97ff' : '#595959'
                    : focus ? '#0000ff' : '#767676',
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
