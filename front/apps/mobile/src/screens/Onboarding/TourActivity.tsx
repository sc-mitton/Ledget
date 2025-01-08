import { View } from 'react-native';

import sharedStyles from './styles/shared';
import { OnboardingScreenProps } from '@/types';
import { Button, Box, Text } from '@ledget/native-ui';
import { TourActivity } from '@ledget/media/native';
import { useAppearance } from '@/features/appearanceSlice';
import MaskedImageWrapper from './MaskedImageWrapper';

const Tour = (props: OnboardingScreenProps<'TourActivity'>) => {
  const { mode } = useAppearance();

  return (
    <Box variant="screen">
      <View style={sharedStyles.mainContainer}>
        <Box
          marginBottom="xxl"
          marginTop="xxxl"
          width={'100%'}
          paddingHorizontal="xxs"
        >
          <Text fontSize={28} lineHeight={32} variant="bold" marginVertical="m">
            Activity
          </Text>
          <Text color="secondaryText">
            Get updates on new spending from your accounts. Swipe to confirm the
            transaction's spending category or bill.
          </Text>
        </Box>
        <MaskedImageWrapper maskPosition="top">
          <TourActivity dark={mode === 'dark'} />
        </MaskedImageWrapper>
      </View>
      <Box paddingBottom="navHeight">
        <Button
          variant="grayMain"
          label="Continue"
          onPress={() => props.navigation.navigate('TourAccounts')}
        />
      </Box>
    </Box>
  );
};

export default Tour;
