import { BlurView } from 'expo-blur';
import { TouchableOpacity } from 'react-native';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import { Home, DollarSign, Activity, User } from 'geist-native-icons';

import styles from './styles/bottom-nav';
import { Box, Icon } from '@ledget/native-ui';
import { useAppearance } from '@features/appearanceSlice';
import { Institution } from '@ledget/media/native';


interface Props {
  state: TabNavigationState<ParamListBase>;
  descriptors: any;
  navigation: any;
}

export default function Nav({ state, descriptors, navigation }: Props) {
  const { mode } = useAppearance();

  return (
    <>
      <BlurView
        intensity={mode === 'dark' ? 40 : 20}
        tint={mode === 'dark' ? 'dark' : 'light'}
        style={styles.navBlurView}
      >
        <Box
          backgroundColor={'bottomNavBackground'}
          style={styles.navBack}
          shadowColor='navShadow'
          shadowOffset={{ width: 0, height: -5 }}
          shadowRadius={20}
          shadowOpacity={.95}
          borderTopColor='bottomNavBorder'
          borderTopWidth={1}
        />
        <Box
          style={styles.nav}
          variant='bottomNav'
          backgroundColor={'transparent'}
        >
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const { options } = descriptors[route.key];

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
              >
                {route.name === 'Home'
                  ? <Icon icon={Home} color={isFocused ? 'activeIcon' : 'mainText'} />
                  : route.name === 'Budget'
                    ? <Icon icon={DollarSign} color={isFocused ? 'activeIcon' : 'mainText'} />
                    : route.name === 'Accounts'
                      ? <Icon icon={Institution} color={isFocused ? 'activeIcon' : 'mainText'} />
                      : route.name === 'Activity'
                        ? <Icon icon={Activity} color={isFocused ? 'activeIcon' : 'mainText'} />
                        : <Icon icon={User} color={isFocused ? 'activeIcon' : 'mainText'} />
                }
              </TouchableOpacity>
            );
          })}
        </Box>
      </BlurView>
    </>
  );
}

