import { useState, useEffect } from 'react';
import { useTheme } from '@shopify/restyle';
import { X } from 'geist-native-icons';
import { useNavigation } from '@react-navigation/native';
import Animated, { LinearTransition } from 'react-native-reanimated';
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
  Icon,
} from '@ledget/native-ui';
import { useGetAccountsQuery, Account } from '@ledget/shared-features';
import { hideBottomTabs } from '@/features/uiSlice';
import {
  selectHomePinnedAccounts,
  setHomePinnedAccounts,
} from '@ledget/shared-features';
import { PageSheetModalScreenProps } from '@/types';
import { View } from 'react-native';
import { capitalize, sliceString } from '@ledget/helpers';

const PickHomeAccounts = (
  props: PageSheetModalScreenProps<'PickHomeAccounts'>
) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const pinnedAccounts = useAppSelector(selectHomePinnedAccounts);

  const [selectedAccounts, setSelectedAccounts] = useState<Account[]>([
    ...pinnedAccounts,
  ]);

  const navigation = useNavigation();
  const { data: accountsData } = useGetAccountsQuery();

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <Button
          label="Done"
          variant="bold"
          textColor="blueText"
          onPress={() => onSave()}
        />
      ),
    });
  }, []);

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
    dispatch(setHomePinnedAccounts(selectedAccounts));
    props.navigation.goBack();
  };

  return (
    <Box
      backgroundColor="modalBox"
      flex={1}
      padding="pagePadding"
      maxHeight={Dimensions.get('window').height - theme.spacing.statusBar * 2}
    >
      {selectedAccounts.length > 0 && (
        <>
          <CustomScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: theme.spacing.s }}
          >
            {selectedAccounts.map((account) => (
              <Box
                key={account.id}
                backgroundColor="grayButton"
                padding="l"
                marginVertical="s"
                borderRadius={'m'}
                flexDirection="row"
                alignItems="center"
                gap="l"
              >
                <InstitutionLogo account={account.id} />
                <View>
                  <Text>{sliceString(account.name, 20)}</Text>
                  <Text color="tertiaryText">
                    {['cd', 'ira'].includes(account.type.toLowerCase())
                      ? account.type.toUpperCase()
                      : capitalize(account.type)}
                  </Text>
                </View>
                <Box marginLeft="l">
                  <Button
                    padding="xs"
                    backgroundColor="mediumGrayButton"
                    borderRadius="circle"
                    onPress={() => {
                      setSelectedAccounts(
                        selectedAccounts.filter((a) => a.id !== account.id)
                      );
                    }}
                  >
                    <Icon
                      icon={X}
                      size={16}
                      color="secondaryText"
                      strokeWidth={2}
                    />
                  </Button>
                </Box>
              </Box>
            ))}
          </CustomScrollView>
          <Seperator variant="s" />
        </>
      )}

      <CustomScrollView showsVerticalScrollIndicator={false}>
        {accountsData?.accounts
          .filter((account) => !selectedAccounts.includes(account))
          .map((account, i) => (
            <Animated.View key={account.id} layout={LinearTransition}>
              {i > 0 && <Seperator variant="s" />}
              <Button
                key={account.id}
                flexDirection="row"
                marginVertical="s"
                alignItems="center"
                width="100%"
                justifyContent="space-between"
                onPress={() => {
                  if (selectedAccounts.includes(account)) {
                    setSelectedAccounts(
                      selectedAccounts.filter((a) => a.id !== account.id)
                    );
                  } else {
                    setSelectedAccounts([...selectedAccounts, account]);
                  }
                }}
              >
                <Box flexDirection="row" alignItems="center" gap="m">
                  <InstitutionLogo account={account.id} size={24} />
                  <View>
                    <Text>{sliceString(account.name, 20)}</Text>
                    <Box flexDirection="row" gap="xs">
                      <Text color="tertiaryText" fontSize={14}>
                        {['cd', 'ira'].includes(account.type.toLowerCase())
                          ? account.type.toUpperCase()
                          : capitalize(account.type)}
                      </Text>
                      <Text color="tertiaryText" fontSize={14}>
                        &nbsp;&nbsp;&bull;&nbsp;&bull;&nbsp;
                        {account.mask}
                      </Text>
                    </Box>
                  </View>
                </Box>
                <Box flex={1} alignItems="flex-end">
                  <DollarCents
                    color="tertiaryText"
                    fontSize={16}
                    value={Big(account.balances.current).times(100).toNumber()}
                  />
                </Box>
              </Button>
            </Animated.View>
          ))}
      </CustomScrollView>
    </Box>
  );
};

export default PickHomeAccounts;
