import { useEffect } from 'react';
import { BlurView } from 'expo-blur';
import { TouchableOpacity, View, Platform } from 'react-native';
import {
  ParamListBase,
  TabNavigationState,
  CommonActions,
} from '@react-navigation/native';
import { Home, Activity, User } from 'geist-native-icons';
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useGetTransactionsCountQuery } from '@ledget/shared-features';
import { useTheme } from '@shopify/restyle';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import styles from './styles/bottom-nav';
import { Box, Icon } from '@ledget/native-ui';
import { useAppearance } from '@features/appearanceSlice';
import { selectHideBottomTabs, updateLastTab } from '@/features/uiSlice';
import { Institution } from '@ledget/media/native';
import { useAppSelector, useAppDispatch } from '@hooks';
import { selectBudgetMonthYear } from '@ledget/shared-features';

interface Props {
  state: TabNavigationState<ParamListBase>;
  descriptors: any;
  navigation: any;
}

interface ButtonProps extends Props {
  index?: number;
  route: { key: string; name: string; params?: any };
}

const Button = (props: ButtonProps) => {
  const dispatch = useAppDispatch();
  const { route, index, state, descriptors, navigation } = props;
  const isFocused = state.index === index;
  const des = descriptors[route.key];
  const theme = useTheme();

  const onPress = () => {
    dispatch(updateLastTab(props.index!));

    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.dispatch((state: any) => {
        return CommonActions.navigate({
          name: route.name,
        });
      });
    }
  };

  const onLongPress = () => {
    if (props.index) {
      dispatch(updateLastTab(props.index));
    }
    navigation.emit({
      type: 'tabLongPress',
      target: route.key,
    });
  };

  return (
    <TouchableOpacity
      style={[
        styles.tabButton,
        Platform.OS === 'ios' ? styles.iosTabButton : styles.androidTabButton,
      ]}
      key={route.key}
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={des?.options?.tabBarAccessibilityLabel}
      testID={des?.options?.tabBarTestID}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      {route.key.includes('Home') ? (
        <Icon
          strokeWidth={1.75}
          icon={Home}
          color={isFocused ? 'blueText' : 'secondaryText'}
        />
      ) : route.key.includes('Budget') ? (
        <FontAwesome6
          name="dollar"
          size={theme.colors.mode === 'dark' ? 19 : 18}
          color={isFocused ? theme.colors.blueText : theme.colors.secondaryText}
        />
      ) : route.key.includes('Accounts') ? (
        <Icon
          strokeWidth={1.75}
          icon={Institution}
          color={isFocused ? 'blueText' : 'secondaryText'}
        />
      ) : route.key.includes('Activity') ? (
        <Icon
          strokeWidth={1.75}
          icon={Activity}
          color={isFocused ? 'blueText' : 'secondaryText'}
        />
      ) : (
        <Icon
          strokeWidth={1.75}
          icon={User}
          color={isFocused ? 'blueText' : 'secondaryText'}
        />
      )}
    </TouchableOpacity>
  );
};

export default function Nav({ state, descriptors, navigation }: Props) {
  const { mode } = useAppearance();
  const hidden = useAppSelector(selectHideBottomTabs);
  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const { data } = useGetTransactionsCountQuery(
    { confirmed: false, month, year },
    { skip: !month || !year }
  );
  const y = useSharedValue(0);

  useEffect(() => {
    y.value = withTiming(hidden ? 150 : 0, {
      easing: Easing.bezier(0, 0.9, 0.5, 0.9).factory(),
    });
  }, [hidden]);

  return (
    <Animated.View style={{ transform: [{ translateY: y }] }}>
      <BlurView
        intensity={mode === 'dark' ? (Platform.OS === 'ios' ? 80 : 40) : 80}
        experimentalBlurMethod={'dimezisBlurView'}
        tint={mode === 'dark' ? 'dark' : 'light'}
        style={[
          styles.navBlurView,
          Platform.OS === 'ios'
            ? styles.iosNavBlurViewSpacing
            : styles.androidNavBlurViewSpacing,
        ]}
      >
        {Platform.OS === 'android' && (
          <>
            <Box
              backgroundColor="bottomNavCover"
              style={[styles.androidCover, { left: 0 }]}
            />
            <Box
              backgroundColor="bottomNavCover"
              style={[styles.androidCover, { right: 0 }]}
            />
          </>
        )}
        <Box
          backgroundColor={'bottomNavBackground'}
          style={styles.navBack}
          shadowColor="navShadow"
          shadowOffset={{ width: 0, height: 0 }}
          shadowRadius={24}
          shadowOpacity={Platform.OS === 'ios' ? 0 : 0}
          borderTopColor="bottomNavBorder"
          borderTopWidth={2}
        />
        <Box
          style={styles.nav}
          variant="bottomNav"
          backgroundColor={'transparent'}
        >
          {state.routes
            .slice(0, state.routes.length / 2)
            .map((route, index) => (
              <Button
                key={route.key}
                route={route}
                index={index}
                state={state}
                descriptors={descriptors}
                navigation={navigation}
              />
            ))}
          <View style={styles.activityButtonContainer}>
            {(data?.count || 0) > 0 && (
              <Box style={styles.indicator} backgroundColor="blueText" />
            )}
            <Button
              route={{
                key: 'Activity',
                name: 'Modals',
                params: { screen: 'Activity' },
              }}
              state={state}
              descriptors={descriptors}
              navigation={navigation}
            />
          </View>
          {state.routes
            .slice(state.routes.length / 2, state.routes.length)
            .map((route, index) => (
              <Button
                key={route.key}
                route={route}
                index={index + state.routes.length / 2}
                state={state}
                descriptors={descriptors}
                navigation={navigation}
              />
            ))}
        </Box>
      </BlurView>
    </Animated.View>
  );
}
