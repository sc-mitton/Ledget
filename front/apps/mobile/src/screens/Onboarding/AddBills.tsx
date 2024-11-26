import { View } from 'react-native'

import sharedStyles from './styles/shared';
import { OnboardingScreenProps } from '@/types'
import { Button, Box, Text, Checkbox } from '@ledget/native-ui';
import { useUpdateUserMutation, useGetRecurringTransactionsQuery } from '@ledget/shared-features';

const AddBills = (props: OnboardingScreenProps<'AddBills'>) => {
  const { data } = useGetRecurringTransactionsQuery();
  const [updateUser] = useUpdateUserMutation();

  return (
    <Box variant='screen'>
      <View style={sharedStyles.mainContainer}>
        <View style={sharedStyles.header}>
          <Text fontSize={24} lineHeight={28} variant='geistSemiBold' marginTop='xxxl' marginBottom='s'>
            Add Bills
          </Text>
          <Text color='secondaryText'>
            Confirm any of your reaccuring payments
          </Text>
        </View>
        <Box variant='nestedContainer' style={sharedStyles.form}>

        </Box>
      </View>
      <Box paddingBottom='navHeight'>
        <Button
          variant='main'
          label='Finish'
          onPress={() => {
            updateUser({ is_onboarded: true })
            props.navigation.navigate('BottomTabs', { screen: 'Budget' } as any)
          }}
        />
      </Box>
    </Box>
  )
}
export default AddBills
