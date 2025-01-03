import { View } from 'react-native';

import sharedStyles from './styles/shared';
import { OnboardingScreenProps } from '@/types';
import { Button, Box, Text } from '@ledget/native-ui';
import { TourSpendingCategories } from '@ledget/media/native';
import { useAppearance } from '@/features/appearanceSlice';
import MaskedImageWrapper from './MaskedImageWrapper';

const Tour = (props: OnboardingScreenProps<'TourSpending'>) => {
  const { mode } = useAppearance();

  return (
    <Box variant="screen">
      <View style={sharedStyles.mainContainer}>
        <MaskedImageWrapper>
          <TourSpendingCategories dark={mode === 'dark'} />
        </MaskedImageWrapper>
        <Box paddingHorizontal="xs" marginTop="l">
          <Text
            fontSize={24}
            lineHeight={28}
            variant="geistSemiBold"
            marginVertical="m"
          >
            Spending Categories
          </Text>
          <Text variant="geistRegular" color="secondaryText">
            Track your spending with custom monthly and yearly categories.
          </Text>
          <Text variant="geistRegular" color="secondaryText" marginTop="m">
            Your yearly spending categories will refresh every year on the day
            you created your first yearly category.
          </Text>
        </Box>
      </View>
      <Box paddingBottom="navHeight">
        <Button
          variant="grayMain"
          label="Continue"
          onPress={() => props.navigation.navigate('TourBills')}
        />
      </Box>
    </Box>
  );
};
export default Tour;
