import { View } from 'react-native'

import sharedStyles from './styles/shared';
import { OnboardingScreenProps } from '@/types'
import { Button, Box, Text } from '@ledget/native-ui';
import { TourBills } from '@ledget/media/native';
import { useAppearance } from '@/features/appearanceSlice';
import MaskedImageWrapper from './MaskedImageWrapper';

const Tour = (props: OnboardingScreenProps<'TourBills'>) => {
  const { mode } = useAppearance();

  return (
    <Box variant='screen'>
      <View style={sharedStyles.mainContainer}>
        <MaskedImageWrapper>
          <TourBills dark={mode === 'dark'} />
        </MaskedImageWrapper>
        <Box paddingHorizontal='xs' marginTop='l'>
          <Text fontSize={24} lineHeight={28} variant='geistSemiBold' marginVertical='m'>
            Bills
          </Text>
          <Text variant='geistRegular' color='secondaryText'>
            All monthly reacurring payments, or one-time payments, can be tracked here.
          </Text>
        </Box>
      </View>
      <Box paddingBottom='navHeight'>
        <Button
          variant='grayMain'
          label='Continue'
          onPress={() => props.navigation.navigate('TourActivity')}
        />
      </Box>
    </Box>
  )
}

export default Tour
