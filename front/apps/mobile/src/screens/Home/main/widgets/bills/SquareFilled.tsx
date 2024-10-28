import { View } from 'react-native'
import dayjs from 'dayjs';
import { Calendar } from 'geist-native-icons';

import sharedStyles from './styles/shared'
import { WidgetProps } from '@features/widgetsSlice'
import { useAppSelector } from '@hooks'
import { Text, ColorNumber, Button, Icon } from '@ledget/native-ui'
import { selectBudgetMonthYear, selectBillMetaData } from '@ledget/shared-features'
import { navigationRef } from '@types';

const SquareFilled = (props: WidgetProps & { loading: boolean }) => {
  const { month, year } = useAppSelector(selectBudgetMonthYear)

  const {
    yearly_bills_paid,
    monthly_bills_paid,
    number_of_monthly_bills,
    number_of_yearly_bills
  } = useAppSelector(selectBillMetaData)

  const onCalendarPress = () => {
    if (navigationRef.isReady()) {
      navigationRef.navigate('Modals', { screen: 'BillsCalendar', params: { month, year } })
    }
  }

  return (
    <View style={sharedStyles.container}>
      <Text color='secondaryText' fontSize={13}>
        {dayjs(`${year}-${month}-01`).format('MMMM')}&nbsp;
        Bills Paid
      </Text>
      <Text fontSize={28} lineHeight={30} variant='bold'>
        {props.loading ? '0 / 0' : `${monthly_bills_paid + yearly_bills_paid} / ${number_of_monthly_bills}`}
      </Text>
      <View style={sharedStyles.calendarButtonContainer}>
        <Button
          variant='square'
          backgroundColor='mediumGrayButton'
          padding='xs'
          onPress={onCalendarPress}
          icon={<Icon icon={Calendar} color='secondaryText' />}
        />
        <View style={sharedStyles.numbers}>
          <ColorNumber
            value={props.loading ? 0 : number_of_monthly_bills}
            color='monthColor'
            backgroundColor='monthBackground'
            fontSize={14}
          />
          <ColorNumber
            value={props.loading ? 0 : number_of_yearly_bills}
            color='yearColor'
            backgroundColor='yearBackground'
            fontSize={14}
          />
        </View>
      </View>
    </View>
  )
}

export default SquareFilled
