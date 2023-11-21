
import { Theme } from "@nivo/core"
import { LineSvgProps } from '@nivo/line';

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
    })
}

export const nivoResponsiveLineTheme: Theme = {
    crosshair: {
        line: {
            stroke: 'var(--main-hlight5)',
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
                fill: 'var(--m-secondary)',
            },
        },
    },
}
