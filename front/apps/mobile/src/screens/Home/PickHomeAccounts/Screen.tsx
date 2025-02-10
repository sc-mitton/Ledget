import { useState, Fragment, useEffect } from 'react';
import { useTheme } from '@shopify/restyle';
import Big from 'big.js';
import { Dimensions } from 'react-native';

import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  Text,
  DollarCents,
  Box,
  InstitutionLogo,
  Button,
  Seperator,
  CustomScrollView,
} from '@ledget/native-ui';
import { useGetAccountsQuery, Account } from '@ledget/shared-features';
import { hideBottomTabs } from '@/features/uiSlice';
import {
  selectHomePinnedAccounts,
  setHomePinnedAccounts,
} from '@ledget/shared-features';
import { ModalScreenProps } from '@/types';
import { View } from 'react-native';

const PickHomeAccounts = (props: ModalScreenProps<'PickAccounts'>) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const pinnedAccounts = useAppSelector(selectHomePinnedAccounts);

  const [selectedAccounts, setSelectedAccounts] = useState<Account[]>([
    ...pinnedAccounts,
  ]);

  const { data: accountsData } = useGetAccountsQuery();

  useEffect(() => {
    dispatch(setHomePinnedAccounts(selectedAccounts));
  }, [selectedAccounts]);

  useEffect(() => {
    dispatch(hideBottomTabs(true));
    return () => {
      dispatch(hideBottomTabs(false));
    };
  }, []);

  const onSave = () => {
    if (selectedAccounts.length > 0) {
      dispatch(setHomePinnedAccounts(selectedAccounts));
    }
    props.navigation.goBack();
  };

  return (
    <Box
      backgroundColor="modalBox"
      flex={1}
      padding="pagePadding"
      maxHeight={Dimensions.get('window').height - theme.spacing.statusBar * 2}
    >
      <CustomScrollView showsVerticalScrollIndicator={false}>
        {accountsData?.accounts.map((account, i) => (
          <Fragment key={account.id}>
            {i > 0 && <Seperator variant="s" />}
            <Button
              key={account.id}
              flexDirection="row"
              alignItems="center"
              width="100%"
              justifyContent="space-between"
              onPress={() => {
                setSelectedAccounts([...selectedAccounts, account]);
              }}
            >
              <Box flexDirection="row" alignItems="center" gap="s">
                <InstitutionLogo account={account.id} size={24} />
                <View>
                  <Text>{account.name}</Text>
                  <Text>
                    &bull;&nbsp;&bull;&nbsp;{account.balances.current}
                  </Text>
                </View>
              </Box>
              <DollarCents
                value={Big(account.balances.current).times(100).toNumber()}
              />
            </Button>
          </Fragment>
        ))}
      </CustomScrollView>
      <Button
        variant="grayMain"
        label="Save"
        onPress={onSave}
        marginVertical="l"
      />
    </Box>
  );
};

export default PickHomeAccounts;
