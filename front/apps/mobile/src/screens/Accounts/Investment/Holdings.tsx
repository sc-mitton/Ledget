import dayjs from 'dayjs'

import { View } from "react-native";
import { useAppSelector } from '@/hooks';
import { selectInvestmentsScreenWindow } from '@/features/uiSlice';
import { useGetInvestmentsQuery } from '@ledget/shared-features';

const Holdings = () => {
  const window = useAppSelector(selectInvestmentsScreenWindow)
  const { data: investmentsData } = useGetInvestmentsQuery({
    start: dayjs().format('YYYY-MM-DD'),
    end: dayjs().subtract(window?.amount || 100, window?.period || 'year').format('YYYY-MM-DD')
  })

  return (
    <View></View>
  )
}

export default Holdings;
