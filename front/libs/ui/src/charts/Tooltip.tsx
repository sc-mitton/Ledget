import { FC, HTMLProps } from 'react'

import './styles/Tooltip.scss'

export const ChartTip: FC<HTMLProps<HTMLDivElement>> = ({ children }) => {
    return (
        <div className={'chart-tip'}>
            {children}
        </div>
    )
}
