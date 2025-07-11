import { createContext, useContext, useEffect, useState } from 'react';
import { useTheme } from '@shopify/restyle';
import { useSprings } from '@react-spring/native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import styles from './styles/progress';
import { View } from 'react-native';
import { Box, AnimatedView, BackButton } from '@ledget/native-ui';
import { navigationRef } from '@/types';

interface ContextT {
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  setSize: React.Dispatch<React.SetStateAction<number>>;
}

const context = createContext<ContextT | undefined>(undefined);

export const useProgress = () => {
  const ctx = useContext(context);
  if (!ctx) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return ctx;
};

const WIDTH = 6;

export default function ({ children }: { children: React.ReactNode }) {
  const [index, setIndex] = useState(0);
  const [size, setSize] = useState(0);
  const theme = useTheme();

  const [springs, api] = useSprings(size, () => ({
    width: WIDTH,
    height: WIDTH,
    opacity: 0.3,
  }));

  useEffect(() => {
    api.start((i) => ({
      to: async (next) => {
        const isActive = i + 1 === index;
        const isBefore = i < index;
        await next({
          width: isActive ? WIDTH * 2.25 : WIDTH,
          opacity: isBefore || isActive ? 1 : 0.3,
        });
        await next({
          width: WIDTH,
          opacity: isBefore || isActive ? 1 : 0.3,
        });
      },
    }));
  }, [index, size]);

  return (
    <context.Provider value={{ setIndex, setSize }}>
      {index !== 0 && (
        <Animated.View
          style={[styles.header, { height: theme.spacing.statusbar }]}
          entering={FadeIn}
          exiting={FadeOut}
        >
          <Box
            backgroundColor="mainBackground"
            paddingTop="statusBar"
            shadowColor="mainBackground"
            shadowOffset={{ width: 0, height: 0 }}
            shadowOpacity={1}
            shadowRadius={16}
            style={styles.headerBox}
          >
            <View style={styles.backButton}>
              {index !== 0 && (
                <BackButton onPress={() => navigationRef.goBack()} />
              )}
            </View>
            <View style={[styles.progressContainer]}>
              {springs.map((style, i) => (
                <AnimatedView style={[styles.pill, style]} key={`pill-${i}`}>
                  <Box style={[styles.pillFill]} backgroundColor="mainText" />
                </AnimatedView>
              ))}
            </View>
          </Box>
        </Animated.View>
      )}
      {children}
    </context.Provider>
  );
}
