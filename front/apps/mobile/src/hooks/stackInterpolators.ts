import { useCallback } from 'react';
import { Animated } from 'react-native';
import { useTheme } from '@shopify/restyle';

export const useCardStyleInterpolator = (app?: 'main' | 'authentication') => {
  const theme = useTheme();

  const cardStyleInterpolator = useCallback(({ current, next, inverted, layouts: { screen } }: any) => {

    const progress = Animated.add(
      current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      }),
      next
        ? next.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        })
        : 0
    );

    return ({
      cardStyle: {
        opacity: progress,
        transform: [
          {
            translateX: Animated.multiply(
              progress.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [screen.width, 0, screen.width * -0.3],
                extrapolate: 'clamp',
              }),
              inverted
            ),
          },
        ],
      },
      containerStyle: {
        backgroundColor: app === 'authentication' ? theme.colors.accountsMainBackground : theme.colors.mainBackground,
        opacity: progress,
      }
    })
  }, [theme]);

  return cardStyleInterpolator;
}
