import { View } from 'react-native'

import sharedStyles from './styles/shared';
import { OnboardingScreenProps } from '@/types'
import { Button, Box } from '@ledget/native-ui';
import { useUpdateUserMutation } from '@ledget/shared-features';

const AddBills = (props: OnboardingScreenProps<'AddBills'>) => {
  const [updateUser] = useUpdateUserMutation();

  return (
    <Box variant='screen'>
      <View style={sharedStyles.mainContainer}>
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
