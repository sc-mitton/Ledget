import { View } from 'react-native'

import sharedStyles from './styles/shared';
import { OnboardingScreenProps } from '@/types'
import { Button, Box, Text } from '@ledget/native-ui';
import { TourSpendingCategories } from '@ledget/media/native';
import { useAppearance } from '@/features/appearanceSlice';
import MaskedImageWrapper from './MaskedImageWrapper';

const TourAccounts = (props: OnboardingScreenProps<'TourAccounts'>) => {
  const { mode } = useAppearance();

  return (
    <Box variant='screen'>
      <View style={sharedStyles.mainContainer}>
        <TourSpendingCategories dark={mode === 'dark'} />
        <Box paddingHorizontal='xs' marginTop='l'>
          <Text fontSize={24} lineHeight={28} variant='geistSemiBold' marginVertical='m'>
            Accounts
          </Text>
          <Text variant='geistRegular' color='secondaryText'>
            You can link your financial institutions to track all of your depository accounts,
            investments, and loans in one place.
          </Text>
        </Box>
      </View>
      <Box paddingBottom='navHeight'>
        <Button
          variant='main'
          label='Continue'
          onPress={() => props.navigation.navigate('AddCategories')}
        />
      </Box>
    </Box>
  )
}
export default TourAccounts
