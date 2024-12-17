import { useCallback } from 'react';
import { Animated, NativeModules } from 'react-native';
import { useTheme } from '@shopify/restyle';

const { StatusBarManager } = NativeModules;
const TOP_OF_MODAL = StatusBarManager.HEIGHT + 16;

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
          }
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

export const useModifiedDefaultModalStyleInterpolator = () => {
  const theme = useTheme();

  const modalStyleInterpolator = useCallback(({ current, next, inverted, layouts: { screen } }: any) => {

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
        opacity: Animated.multiply(
          progress.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [0, 1, .2],
            extrapolate: 'clamp',
          }),
          inverted
        ),
        shadowColor: theme.colors.modalShadow,
        shadowOpacity: progress.interpolate({
          inputRange: [0, 1, 2],
          outputRange: [0, 0.5, 0],
          extrapolate: 'clamp',
        }),
        shadowRadius: !next ? 10 : 0,
        shadowOffset: { width: 0, height: !next ? -4 : 0, },
        transform: [
          {
            translateY: Animated.multiply(
              progress.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [screen.height, !next ? TOP_OF_MODAL : 0, 0],
                extrapolate: 'clamp',
              }),
              inverted
            ),
          },
          {
            scale: Animated.multiply(
              progress.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [1, 1, .9],
                extrapolate: 'clamp',
              }),
              inverted
            ),
          }
        ],
      }
    })
  }, [theme]);

  return modalStyleInterpolator;
}

export const useModalStyleInterpolator = (args?: { slideOut?: boolean }) => {
  const theme = useTheme();

  const modalStyleInterpolator = useCallback(({ current, next, inverted, layouts: { screen } }: any) => {

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
        shadowColor: theme.colors.modalShadow,
        shadowOpacity: 0.4,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: -4 },
        transform: [
          {
            translateY: Animated.multiply(
              progress.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [
                  100,
                  0,
                  args?.slideOut === false ? 0 : -100
                ],
                extrapolate: 'clamp',
              }),
              inverted
            ),
          },
        ],
      },
      overlayStyle: {
        backgroundColor: theme.colors.modalOverlay,
        opacity: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, .7],
          extrapolate: 'clamp',
        }),
      },
    })
  }, [theme]);

  return modalStyleInterpolator;
}

export const useZoomCardStyleInterpolator = () => {
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
            scale: progress.interpolate({
              inputRange: [0, 1, 2],
              outputRange: [0.8, 1, 1.1],
              extrapolate: 'clamp',
            }),
          },
        ],
      },
      containerStyle: {
        backgroundColor: theme.colors.mainBackground,
        opacity: progress,
      }
    })
  }, [theme]);

  return cardStyleInterpolator;
}

export const useFullScreenModalStyleInterpolator = () => {
  // A modal interpolator that covers the whole screen and fades in from the bottom
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
            translateY: Animated.multiply(
              progress.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [screen.height, 0, 0],
                extrapolate: 'clamp',
              }),
              inverted
            ),
          },
        ],
      },
      containerStyle: {
        backgroundColor: theme.colors.mainBackground,
        opacity: progress,
      }
    })
  }, [theme]);

  return cardStyleInterpolator;
}
