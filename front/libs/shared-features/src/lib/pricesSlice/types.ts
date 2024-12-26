export type Price = {
  id: string
  nickname: string
  unit_amount: number
  metadata: {
    trial_period_days: number
  },
  interval: 'month' | 'year'
}
