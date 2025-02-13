import { useState, useEffect } from 'react';
import { useTheme } from '@shopify/restyle';
import { X } from 'geist-native-icons';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { StyleSheet } from 'react-native';
import { TrendingUp, CreditCard } from 'geist-native-icons';
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
import { CurrencyNote } from '@ledget/media/native';
import { useGetAccountsQuery, Account } from '@ledget/shared-features';
import { hideBottomTabs } from '@/features/uiSlice';
import {
  selectHomePinnedAccounts,
  setHomePinnedAccounts,
  popToast,
} from '@ledget/shared-features';
import { PageSheetModalScreenProps } from '@/types';
import { View } from 'react-native';
import { capitalize, sliceString } from '@ledget/helpers';
import { useAppearance } from '@/features/appearanceSlice';

const styles = StyleSheet.create({
  xButton: {
    position: 'absolute',
    right: -12,
    top: -12,
  },
  horizontalScroll: {
    marginLeft: -12,
  },
  horizontalScrollContent: {
    paddingLeft: 12,
    paddingVertical: 12,
  },
});

const AccountIcon = ({ type }: { type: Account['type'] }) => {
  if (type === 'credit')
    return <Icon icon={CreditCard} size={15} color="tertiaryText" />;
  if (type === 'investment')
    return <Icon icon={TrendingUp} size={15} color="tertiaryText" />;
  if (type === 'depository')
    return <Icon icon={CurrencyNote} size={15} color="tertiaryText" />;
  return null;
};

const PickHomeAccounts = (
  props: PageSheetModalScreenProps<'PickHomeAccounts'>
) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { mode } = useAppearance();
  const { data: accountsData } = useGetAccountsQuery();
  const pinnedAccounts = useAppSelector(selectHomePinnedAccounts);

  const [selectedAccounts, setSelectedAccounts] = useState<Account[]>([
    ...(accountsData?.accounts.filter((account) =>
      pinnedAccounts.includes(account.id)
    ) || []),
  ]);

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
    dispatch(
      setHomePinnedAccounts(selectedAccounts.map((account) => account.id))
    );
  }, [selectedAccounts]);

  useEffect(() => {
    dispatch(hideBottomTabs(true));
    return () => {
      dispatch(hideBottomTabs(false));
    };
  }, []);

  const onSave = () => {
    dispatch(
      setHomePinnedAccounts(selectedAccounts.map((account) => account.id))
    );
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
            style={styles.horizontalScroll}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {selectedAccounts.map((account) => (
              <Box
                marginRight="l"
                key={account.id}
                backgroundColor="grayButton"
                padding="l"
                shadowColor="menuShadowColor"
                shadowOpacity={mode === 'dark' ? 0.3 : 0}
                shadowRadius={4}
                shadowOffset={{ width: 0, height: 2 }}
                elevation={7}
                borderRadius={'m'}
                flexDirection="row"
                alignItems="center"
                paddingRight="xl"
                gap="l"
              >
                <InstitutionLogo account={account.id} />
                <View>
                  <Text>{sliceString(account.name, 20)}</Text>
                  <Box flexDirection="row" gap="s" alignItems="center">
                    <AccountIcon type={account.type} />
                    <Text color="tertiaryText">
                      {['cd', 'ira'].includes(account.type.toLowerCase())
                        ? account.type.toUpperCase()
                        : capitalize(account.type)}
                    </Text>
                  </Box>
                </View>
                <Button
                  variant="circleButton"
                  backgroundColor={
                    mode === 'light' ? 'grayButton' : 'mediumGrayButton'
                  }
                  borderColor="modalBox"
                  borderWidth={4}
                  onPress={() => {
                    setSelectedAccounts(
                      selectedAccounts.filter((a) => a.id !== account.id)
                    );
                  }}
                  style={styles.xButton}
                  icon={
                    <Icon
                      icon={X}
                      size={14}
                      strokeWidth={2.5}
                      color="secondaryText"
                    />
                  }
                />
              </Box>
            ))}
          </CustomScrollView>
          <Seperator
            variant="s"
            backgroundColor={
              mode === 'dark' ? 'modalSeperator' : 'mainScreenSeperator'
            }
          />
        </>
      )}

      <CustomScrollView showsVerticalScrollIndicator={false}>
        {accountsData?.accounts
          .filter((account) => !selectedAccounts.includes(account))
          .map((account, i) => (
            <Animated.View key={account.id} layout={LinearTransition}>
              {i > 0 && (
                <Seperator
                  variant="s"
                  backgroundColor={
                    mode === 'dark' ? 'modalSeperator' : 'mainScreenSeperator'
                  }
                />
              )}
              <Button
                key={account.id}
                flexDirection="row"
                marginVertical="s"
                alignItems="center"
                width="100%"
                justifyContent="space-between"
                onPress={() => {
                  if (selectedAccounts.length >= 4) {
                    dispatch(
                      popToast({
                        message: 'You can only pin up to 4 accounts',
                        type: 'info',
                        location: 'bottom',
                      })
                    );
                  } else if (selectedAccounts.includes(account)) {
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
                    <Box flexDirection="row" gap="s" alignItems="center">
                      <AccountIcon type={account.type} />
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
