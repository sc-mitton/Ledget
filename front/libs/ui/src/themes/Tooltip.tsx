import { FC, HTMLProps } from 'react'

import './styles/Tooltip.scss'

export const ChartTip: FC<HTMLProps<HTMLDivElement> & { position?: 'left' | 'right' }> = ({ children, position }) => {
    const styles = {
        left: {
            transform: 'translate(-55%, 50%)'
        },
        right: {
            transform: 'translate(55%, 50%)'
        }
    }

    return (
        <div className={'chart-tip'} style={position ? styles[position] : undefined}>
            {children}
        </div>
    )
}
