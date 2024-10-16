import { ScrollView, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolate } from 'react-native-reanimated';
import { ParamListBase, TabNavigationState, CommonActions } from '@react-navigation/native';
import { Clock, CreditCard, TrendingUp } from 'geist-native-icons';

import styles from './styles/tab-bar';
import { CurrencyNote } from '@ledget/media/native';
import { Icon, Button, Seperator } from '@ledget/native-ui';

const labelMap = {
  'Depository': 'Accounts',
  'Credit': 'Cards',
  'Investment': 'Investments',
  'Loan': 'Loans'
}

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
      label={(labelMap as any)[route.name]}
      variant={isFocused ? 'bluePill' : 'grayPill'}
      key={route.key}
      fontSize={15}
      labelPlacement='right'
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={des?.options?.tabBarAccessibilityLabel}
      testID={des?.options?.tabBarTestID}
      onPress={onPress}
      disabled={isFocused}
      onLongPress={onLongPress}
      icon={
        route.name.toLowerCase() === 'depository'
          ? <Icon size={16} strokeWidth={1.75} icon={CurrencyNote} color={isFocused ? 'whiteText' : 'secondaryText'} />
          : route.name.toLowerCase() === 'credit'
            ? <Icon size={16} strokeWidth={1.75} icon={CreditCard} color={isFocused ? 'whiteText' : 'secondaryText'} />
            : route.name.toLowerCase() === 'investment'
              ? <Icon size={16} strokeWidth={1.75} icon={TrendingUp} color={isFocused ? 'whiteText' : 'secondaryText'} />
              : route.name.toLowerCase() === 'loan'
                ? <Icon size={16} strokeWidth={1.75} icon={Clock} color={isFocused ? 'whiteText' : 'secondaryText'} />
                : null
      }
    />
  )
}

const Tabs = ({ state, descriptors, navigation }: Props) => {

  return (
    <>
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
      <View style={styles.seperator}>
        <Seperator backgroundColor='mainScreenSeperator' height={2} />
      </View>
    </>
  )
}

export default Tabs
