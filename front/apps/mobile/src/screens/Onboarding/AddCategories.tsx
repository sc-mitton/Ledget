import { View } from 'react-native'

import sharedStyles from './styles/shared';
import { OnboardingScreenProps } from '@/types'
import { Button, Box } from '@ledget/native-ui';

const AddCategories = (props: OnboardingScreenProps<'AddCategories'>) => {

  return (
    <Box variant='screen'>
      <View style={sharedStyles.mainContainer}>
      </View>
      <Box paddingBottom='navHeight'>
        <Button
          variant='main'
          label='Save and Continue'
          onPress={() => props.navigation.navigate('AddBills')}
        />
      </Box>
    </Box>
  )
}
export default AddCategories
