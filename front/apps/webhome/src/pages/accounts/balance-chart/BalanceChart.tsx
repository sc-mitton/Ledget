
import { useEffect, useState } from 'react'

import { ResponsiveLine } from '@nivo/line'
import { useLocation } from 'react-router-dom'
import dayjs from 'dayjs'

import './BalanceChart.scss'
import { useLazyGetAccountBalanceHistoryQuery } from '@features/accountsSlice'
import {
    ResponsiveLineContainer,
    useMinimalistNivoResponsiveBaseProps,
    useMinimalistNivoResponsiveLineTheme,
    DollarCents,
    ChartTip,
    BlueFadedSquareRadio,
} from '@ledget/ui'
import { useAccountsContext } from '../context'
import pathMappings from '../path-mappings'

export const BalanceChart = () => {
    const { accounts } = useAccountsContext()
    const location = useLocation()
    const [getAccountBalance, { data: balanceHistoryData }] = useLazyGetAccountBalanceHistoryQuery()
    const nivoBaseProps = useMinimalistNivoResponsiveBaseProps({
        primaryColor: '--blue-medium',
        gradientColorStart: '--blue-medium',
        gradientColorEnd: '--window2'
    })
    const nivoTheme = useMinimalistNivoResponsiveLineTheme({ primaryColor: '--blue-medium' })
    const [yBoundaries, setYBoundaries] = useState<[number, number]>([0, 0])
    const [window, setWindow] = useState<'5M' | '1Y' | 'MAX'>('5M')

    useEffect(() => {
        const start =
            window === '5M' ? dayjs().subtract(5, 'months').startOf('month').unix() :
                window === '1Y' ? dayjs().subtract(1, 'year').startOf('month').unix() :
                    dayjs().subtract(5, 'years').startOf('month').unix()

        if (accounts) {
            getAccountBalance({
                start,
                end: dayjs().endOf('month').unix(),
                type: pathMappings.getAccountType(location) as 'depository' | 'investment'
            })
        }
    }, [location.pathname, window])

    // Set the y boundaries every time
    useEffect(() => {
        if (balanceHistoryData) {
            let min: number = Infinity
            let max: number = -Infinity
            for (const account of balanceHistoryData) {
                for (const item of account.history) {
                    min = Math.min(min, item.balance)
                    max = Math.max(max, item.balance)
                }
            }
            setYBoundaries([min * .875, max * 1.125])
        }
    }, [accounts, balanceHistoryData])

    return (
        <div className='balance-history'>
            <div className='balance-history--chart'>
                <div>
                    <ResponsiveLineContainer>
                        {accounts &&
                            <ResponsiveLine
                                data={[{
                                    id: 'balance',
                                    data: Object.entries(
                                        balanceHistoryData?.reduce((acc, account) => {
                                            for (const item of account.history) {
                                                if (!acc[item.month]) {
                                                    acc[item.month] = 0
                                                }
                                                acc[item.month] += item.balance
                                            }
                                            return acc
                                        }, {} as Record<string, number>) || {}
                                    ).map(([month, balance]) => ({
                                        x: month,
                                        y: balance
                                    }))
                                }]}
                                tooltip={({ point }) => {
                                    return (
                                        <ChartTip position={point.index >= accounts.length / 2 ? 'left' : 'right'}>
                                            <span>{`${dayjs(point.data.x).format('MMM')}`}</span>
                                            &nbsp;&nbsp;
                                            <DollarCents value={point.data.y as number} />
                                        </ChartTip>
                                    )
                                }}
                                yScale={{
                                    type: 'linear',
                                    min: yBoundaries[0] - (yBoundaries[1] - yBoundaries[0]) * 0.5,
                                    max: yBoundaries[1] + (yBoundaries[1] - yBoundaries[0]) * 0.5
                                }}
                                xScale={{
                                    type: "time",
                                    format: "%Y-%m-%d",
                                    precision: "minute",
                                    useUTC: false
                                }}
                                margin={{ top: 8, right: 12, bottom: 32, left: 10 }}
                                {...nivoBaseProps}
                                theme={nivoTheme}
                                axisBottom={{
                                    format: (value) => dayjs(value).format(window === '5M' ? 'MMM' : 'MMM YY'),
                                    tickValues:
                                        window === '5M' ? 'every 1 month' :
                                            window === '1Y' ? 'every 2 months' :
                                                'every 4 months'
                                }}
                            />

                        }
                    </ResponsiveLineContainer>
                </div>
            </div>
            <div className='balance-history--buttons'>
                <BlueFadedSquareRadio
                    onClick={() => setWindow('5M')}
                    selected={window === '5M'}
                >
                    5M
                </BlueFadedSquareRadio>
                <BlueFadedSquareRadio
                    onClick={() => setWindow('1Y')}
                    selected={window === '1Y'}
                >
                    1Y
                </BlueFadedSquareRadio>
                <BlueFadedSquareRadio
                    onClick={() => setWindow('MAX')}
                    selected={window === 'MAX'}
                >
                    MAX
                </BlueFadedSquareRadio>
            </div>
        </div>
    )
}
