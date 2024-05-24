
import { useEffect, useState } from 'react'

import { ResponsiveLine } from '@nivo/line'

import dayjs from 'dayjs'

import './BalanceChart.scss'
import {
    ResponsiveLineContainer,
    useMinimalistNivoResponsiveBaseProps,
    useMinimalistNivoResponsiveLineTheme,
    DollarCents,
    ChartTip,
} from '@ledget/ui'
import { useAccountsContext } from '../context'

export const BalanceChart = ({ color = '--blue' }: { color?: `--${string}` }) => {
    const { accounts } = useAccountsContext()
    const nivoBaseProps = useMinimalistNivoResponsiveBaseProps(color)
    const nivoTheme = useMinimalistNivoResponsiveLineTheme(color)
    const [yBoundaries, setYBoundaries] = useState<[number, number]>([0, 0])

    useEffect(() => {
        if (accounts) {
            const data = Object.entries(accounts?.reduce((acc, account) => {
                if (account.balance_history) {
                    for (const item of account.balance_history) {
                        if (!acc[item.month]) {
                            acc[item.month] = 0
                        }
                        acc[item.month] += item.balance
                    }
                }
                return acc
            }, {} as Record<string, number>))
            setYBoundaries([
                data.reduce((acc, [, balance]) => Math.min(acc, balance), Infinity),
                data.reduce((acc, [, balance]) => Math.max(acc, balance), -Infinity)
            ])
        }
    }, [accounts])

    return (
        <div id='balance-history'>
            <h4>Balance</h4>
            <div style={{ position: 'relative' }}>
                <ResponsiveLineContainer>
                    {accounts &&
                        <ResponsiveLine
                            data={[{
                                id: 'balance',
                                data: Object.entries(accounts?.reduce((acc, account) => {
                                    if (account.balance_history) {
                                        for (const item of account.balance_history) {
                                            if (!acc[item.month]) {
                                                acc[item.month] = 0
                                            }
                                            acc[item.month] += item.balance
                                        }
                                    }
                                    return acc
                                }, {} as Record<string, number>))
                                    .map(([month, balance]) => ({
                                        x: dayjs(month).format('MMM'),
                                        y: balance
                                    }))
                            }]}
                            tooltip={({ point }) => (
                                <ChartTip position={point.index >= accounts.length / 2 ? 'left' : 'right'}>
                                    <span>{`${point.data.x}`}</span>
                                    &nbsp;&nbsp;
                                    <DollarCents value={point.data.y as number} />
                                </ChartTip>
                            )
                            }
                            yScale={{
                                type: 'linear',
                                min: yBoundaries[0] - (yBoundaries[1] - yBoundaries[0]) * 0.5,
                                max: yBoundaries[1] + (yBoundaries[1] - yBoundaries[0]) * 0.5
                            }}
                            margin={{ top: 8, right: 12, bottom: 32, left: 10 }}
                            {...nivoBaseProps}
                            theme={nivoTheme}
                        />

                    }
                </ResponsiveLineContainer>
            </div>
        </div>
    )
}
