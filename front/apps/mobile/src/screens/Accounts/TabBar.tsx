import { ScrollView, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolate } from 'react-native-reanimated';
import { ParamListBase, TabNavigationState, CommonActions } from '@react-navigation/native';
import { Clock, CreditCard, TrendingUp } from 'geist-native-icons';

import styles from './styles/tabs';
import { CurrencyNote } from '@ledget/media/native';
import { Icon, Button } from '@ledget/native-ui';

interface Props {
  state: TabNavigationState<ParamListBase>;
  descriptors: any;
  navigation: any;
}

interface ButtonProps extends Props {
  index?: number,
  route: { key: string, name: string, params?: any }
}

const TabButton = (props: ButtonProps) => {
  const { route, index, state, descriptors, navigation } = props;
  const isFocused = state.index === index;
  const des = descriptors[route.key];

  const onPress = () => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.dispatch((state: any) => {
        return CommonActions.navigate({
          name: route.name
        });
      });
    }
  };

  const onLongPress = () => {
    navigation.emit({
      type: 'tabLongPress',
      target: route.key,
    });
  };

  return (
    <Button
      style={styles.tabButton}
      label={route.name}
      variant={isFocused ? 'bluePill' : 'grayPill'}
      key={route.key}
      labelPlacement='left'
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={des?.options?.tabBarAccessibilityLabel}
      testID={des?.options?.tabBarTestID}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={styles.buttonIcon} >
        {route.name.toLowerCase() === 'depository'
          ? <Icon icon={CurrencyNote} />
          : route.name.toLowerCase() === 'credit'
            ? <Icon icon={CreditCard} />
            : route.name.toLowerCase() === 'investment'
              ? <Icon icon={TrendingUp} />
              : route.name.toLowerCase() === 'loan'
                ? <Icon icon={Clock} />
                : null
        }
      </View>
    </Button>
  )
}

const Tabs = ({ state, descriptors, navigation }: Props) => {

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.tabs}
      contentContainerStyle={styles.tabsContent}
    >
      {state.routes.map((route, index) => (
        <TabButton
          key={route.key}
          route={route}
          index={index}
          state={state}
          descriptors={descriptors}
          navigation={navigation}
        />
      ))}
    </ScrollView>
  )
}

export default Tabs
