import { ScrollView } from 'react-native';

import { HomeScreenProps } from '@/types';
import { Box, Theme } from '@ledget/native-ui';
import PinnedCategories from './pinned-categories/PinnedCategories';
import PinnedAccounts from './pinned-accounts/PinnedAccounts';
import Summary from './summary/Summary';
import { useTheme } from '@shopify/restyle';

const Screen = (props: HomeScreenProps<'Main'>) => {
  const theme = useTheme<Theme>();
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: theme.spacing.navHeight }}
    >
      <Box paddingHorizontal="pagePadding" paddingTop="statusBar">
        <Box paddingTop="statusBar" gap="m">
          <Summary />
          <PinnedCategories />
          <PinnedAccounts {...props} />
        </Box>
      </Box>
    </ScrollView>
  );
};

export default Screen;
