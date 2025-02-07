import { HomeScreenProps } from '@/types';
import { Box } from '@ledget/native-ui';

import PinnedCategories from './pinned-categories/PinnedCategories';
import PinnedAccounts from './pinned-accounts/PinnedAccounts';

/*
What type of information do I want to display here?

The main theme of the app is roll over, so there one main panel to show some stats for that.

Window 1
- Spent this month
- Remaining for this month's budget
- Remaining for this year's budget

- Saved over the last six month
- Invested over the last six months

- Projected Leftovers

Window 2
- Window for pinning categories

Window 2
- Window for pinning accounts and their balances
*/

const Screen = ({ navigation, route }: HomeScreenProps<'Main'>) => {
  return (
    <Box variant="nestedScreen">
      <Box variant="nestedContainer"></Box>
      <PinnedCategories />
      <PinnedAccounts />
    </Box>
  );
};

export default Screen;
