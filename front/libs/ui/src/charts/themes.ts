
import { Theme } from "@nivo/core"
import { LineSvgProps } from '@nivo/line';

// Define the type for your base props
type NivoResponsiveLineBaseProps = Omit<LineSvgProps, 'data'>

export const nivoResponsiveLineBaseProps: NivoResponsiveLineBaseProps = {
    enablePoints: true,
    enableArea: true,
    enableGridX: false,
    enableGridY: false,
    lineWidth: 1,
    theme: {
        crosshair: {
            line: {
                stroke: 'var(--main-hlight5)',
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
    },
    curve: 'catmullRom',
    colors: ['var(--main-color-hover)'],
    useMesh: true,
    defs: [
        {
            id: 'gradientC',
            type: 'linearGradient',
            colors: [
                { offset: 0, color: 'var(--main-sat)' },
                { offset: 100, color: 'var(--window)' },
            ],
        },
    ],
    fill: [{ match: '*', id: 'gradientC' }],
}



export const nivoResponsiveLineTheme: Theme = {
    crosshair: {
        line: {
            stroke: 'var(--main-hlight5)',
            strokeWidth: 2,
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
            }
        }
    }
}
