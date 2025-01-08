import { View } from 'react-native';

import sharedStyles from './styles/shared';
import { OnboardingScreenProps } from '@/types';
import { Button, Box, Text } from '@ledget/native-ui';
import { TourAccounts as TourAccountsGraphic } from '@ledget/media/native';
import { useAppearance } from '@/features/appearanceSlice';
import MaskedImageWrapper from './MaskedImageWrapper';

const TourAccounts = (props: OnboardingScreenProps<'TourAccounts'>) => {
  const { mode } = useAppearance();

  return (
    <Box variant="screen">
      <Box style={sharedStyles.mainContainer} marginTop="xxxl">
        <TourAccountsGraphic dark={mode === 'dark'} />
        <Box paddingHorizontal="xs" marginTop="l">
          <Text fontSize={28} lineHeight={32} marginVertical="m" variant="bold">
            Accounts
          </Text>
          <Text color="secondaryText">
            You can link your financial institutions to track all of your
            depository accounts, investments, and loans in one place.
          </Text>
        </Box>
      </Box>
      <Box paddingBottom="navHeight">
        <Button
          variant="grayMain"
          label="Continue"
          onPress={() => props.navigation.navigate('Connect')}
        />
      </Box>
    </Box>
  );
};
export default TourAccounts;
