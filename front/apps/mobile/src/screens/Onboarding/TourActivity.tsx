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
        <Box paddingHorizontal="xs" marginBottom="xxl" marginTop="xxxl">
          <Text
            fontSize={24}
            lineHeight={28}
            variant="geistSemiBold"
            marginVertical="m"
          >
            Activity
          </Text>
          <Text variant="geistRegular" color="secondaryText">
            Get updates for any new spending from your accounts. Swipe to
            confirm the transaction's spending category or bill.
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
