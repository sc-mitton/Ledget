import { useEffect, useState } from 'react'
import { Big } from 'big.js'
import dayjs from 'dayjs'

import styles from './styles/screen'
import { BudgetScreenProps } from '@types'
import { useGetCategorySpendingHistoryQuery } from '@ledget/shared-features'
import { Box } from '@ledget/native-ui'

import EmojiHeader from './Header'
import Menu from './Menu'
import Chart from './Chart'
import HistoryBox from './HistoryBox'
import AlertsBox from './AlertsBox'

const tempChartData = [
  { date: dayjs().startOf('month').subtract(3, 'month').format('YYYY-MM-DD'), amount_spent: 15 },
  { date: dayjs().startOf('month').subtract(2, 'month').format('YYYY-MM-DD'), amount_spent: 25 },
  { date: dayjs().startOf('month').subtract(1, 'month').format('YYYY-MM-DD'), amount_spent: 20 },
  { date: dayjs().startOf('month').format('YYYY-MM-DD'), amount_spent: 35 },
  { date: dayjs().format('YYYY-MM-DD'), amount_spent: 30 },
]

const Category = (props: BudgetScreenProps<'Category'>) => {
  const [chartData, setChartData] = useState(tempChartData);
  const [usingFakeData, setUsingFakeData] = useState(true);

  const { data: fetchedSpendingData } = useGetCategorySpendingHistoryQuery({
    categoryId: props.route.params.category.id,
  })

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => <Menu {...props} />,
    })
  }, [])

  useEffect(() => {
    if ((fetchedSpendingData?.length || 0) > 3) {
      setChartData(fetchedSpendingData?.map((item) => ({
        date: dayjs(`${item.year}-${item.month}-01`).format('MM-DD-YYYY'),
        amount_spent: Big(item.amount_spent).toNumber()
      })) || [])
      setUsingFakeData(false);
    }
  }, [fetchedSpendingData])

  return (
    <Box variant='nestedScreen'>
      <EmojiHeader category={props.route.params.category} />
      <Chart
        data={chartData}
        usingFakeData={usingFakeData}
        notEnoughData={(fetchedSpendingData?.length || 0) < 3}
        category={props.route.params.category}
      />
      <Box style={styles.boxesContainer} marginBottom='navHeight'>
        <HistoryBox {...props} />
        <AlertsBox category={props.route.params.category} />
      </Box>
    </Box>
  )
}
export default Category
