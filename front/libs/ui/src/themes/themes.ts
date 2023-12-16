
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
        },
    },
    axis: {
        ticks: {
            line: { strokeWidth: 0 },
            text: {
                fontSize: 12,
                fontFamily: 'inherit',
                fontWeight: 400,
                fill: 'var(--m-secondary-text)',
            },
        },
    },
}

export const ledgetAntTheme: ThemeConfig = {
    token: {
        colorPrimary: '#5c6087',
        boxShadowSecondary: 'var(--mid-elevation-drop-shadow)',
        borderRadius: 8,
        colorBgContainer: '#e8e8e8',
        colorTextPlaceholder: '#a6a6a6',
    },
}


export const stripeCardTheme = (focus: boolean) => ({
    style: {
        base: {
            fontFamily: "Source Sans Pro, sans-serif",
            color: '#292929',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: focus ? '#949de0' : '#767676',
            },
            iconColor: focus ? '#0000ff' : '#292929',
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
