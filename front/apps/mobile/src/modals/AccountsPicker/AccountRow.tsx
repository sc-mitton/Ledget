import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@shopify/restyle';
import Big from 'big.js';

import styles from './styles/account-row';
import {
  Box,
  Text,
  DollarCents,
  InstitutionLogo,
  Icon,
  Seperator,
} from '@ledget/native-ui';
import type { Account } from '@ledget/shared-features';
import { useAppearance } from '@/features/appearanceSlice';
import { ChevronRight } from 'geist-native-icons';

interface AccountP {
  account: Account;
  selected?: boolean;
  onPress: () => void;
  onLongPress: () => void;
  draggable?: boolean;
  index: number;
  detailedView?: boolean;
  isSelected?: boolean;
  last?: boolean;
}

const AccountRow = (props: AccountP) => {
  const [pressed, setPressed] = useState(false);
  const maskViewHeight = useSharedValue(0);
  const { mode } = useAppearance();

  useEffect(() => {
    if (props.detailedView) {
      maskViewHeight.value = withTiming(20, { duration: 200 });
    } else {
      maskViewHeight.value = withTiming(0, { duration: 200 });
    }
  }, [props.detailedView]);

  const animation = useAnimatedStyle(() => {
    return {
      height: maskViewHeight.value,
    };
  });

  useEffect(() => {
    if (props.detailedView) {
      setPressed(false);
    }
  }, [props.detailedView]);

  return (
    <>
      {props.index !== 0 && !props.detailedView && (
        <View style={styles.seperator}>
          <Seperator variant="bare" backgroundColor={'modalSeperator'} />
        </View>
      )}
      <Box
        borderColor={props.detailedView ? 'modalBorder' : 'transparent'}
        borderWidth={1.5}
        shadowColor="navShadow"
        borderRadius={'l'}
        shadowOpacity={props.detailedView ? (mode === 'dark' ? 1 : 0.5) : 0}
        shadowRadius={props.detailedView ? 16 : 0}
        shadowOffset={{ width: 0, height: 4 }}
        elevation={props.detailedView ? 10 : 0}
        style={styles.accountCard}
      >
        <TouchableOpacity
          onPress={props.onPress}
          activeOpacity={0.99}
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          onLongPress={() => {
            if (!props.draggable) return;
            props.onLongPress();
          }}
        >
          <Box
            backgroundColor="modalBox100"
            style={[styles.accountCardInfo, { opacity: pressed ? 0.7 : 1 }]}
          >
            <View style={styles.institutionLogoContainer}>
              {props.selected && (
                <Box style={styles.selectedIndicator} borderColor="blueText" />
              )}
              <InstitutionLogo account={props.account.id} size={22} />
            </View>
            <View style={styles.accountInfo}>
              <Text color={props.isSelected ? 'blueTextSecondary' : 'mainText'}>
                {props.account.name.length > 20 && !props.detailedView
                  ? `${props.account.name.slice(0, 20)}...`
                  : props.account.name}
              </Text>
              <Animated.View style={animation}>
                <Text
                  color={
                    props.isSelected ? 'blueTextSecondary' : 'secondaryText'
                  }
                  fontSize={14}
                >
                  &bull;&nbsp;&bull;&nbsp;{props.account.mask}
                </Text>
              </Animated.View>
            </View>
            <View style={styles.balance}>
              <DollarCents
                color={props.isSelected ? 'blueTextSecondary' : 'mainText'}
                value={Big(props.account.balances.current)
                  .times(100)
                  .toNumber()}
              />
              <Icon icon={ChevronRight} color="quinaryText" strokeWidth={2} />
            </View>
          </Box>
        </TouchableOpacity>
      </Box>
    </>
  );
};

export default AccountRow;
