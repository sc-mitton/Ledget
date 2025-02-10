import { useState } from 'react';
import { View } from 'react-native';
import { Pin } from 'geist-native-icons';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

import { Box, Icon, Text, Button } from '@ledget/native-ui';
import {
  useGetAccountsQuery,
  selectHomePinnedAccounts,
} from '@ledget/shared-features';
import { useAppSelector } from '@/hooks';
import Skeleton from './Skeleton';

const PinnedAccounts = () => {
  const navigation = useNavigation<any>();
  const { data: accountsData, isSuccess } = useGetAccountsQuery();
  const pinnedAccounts = useAppSelector(selectHomePinnedAccounts);

  return (
    <Animated.View layout={LinearTransition}>
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        marginBottom="ns"
      >
        <Box alignItems="center" flexDirection="row" gap="xs">
          <Icon icon={Pin} size={16} color="tertiaryText" />
          <Text color="tertiaryText">Accounts</Text>
        </Box>
        <Button
          label="Edit"
          textColor="tertiaryText"
          onPress={() => {
            navigation.navigate('PageSheetModals', {
              screen: 'PickHomeAccounts',
            });
          }}
        />
      </Box>
      <Box variant="nestedContainer">
        {!isSuccess ? (
          <Skeleton />
        ) : pinnedAccounts.length === 0 ? (
          <Skeleton />
        ) : (
          <View></View>
        )}
      </Box>
    </Animated.View>
  );
};

export default PinnedAccounts;
