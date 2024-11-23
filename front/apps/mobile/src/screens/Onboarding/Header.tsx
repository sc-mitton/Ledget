import { createContext, useContext, useEffect, useState } from "react";
import { useTheme } from "@shopify/restyle";
import { useSprings } from "@react-spring/native";
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import styles from './styles/progress';
import { View } from "react-native";
import { Box, AnimatedView, BackButton } from '@ledget/native-ui';

interface ContextT {
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  setSize: React.Dispatch<React.SetStateAction<number>>;
}

const context = createContext<ContextT | undefined>(undefined)

export const useProgress = () => {
  const ctx = useContext(context);
  if (!ctx) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return ctx;
}

const WIDTH = 16;

export default function ({ children }: { children: React.ReactNode }) {
  const [index, setIndex] = useState(0);
  const [size, setSize] = useState(0);
  const theme = useTheme();
  const navigation = useNavigation();

  const [springs, api] = useSprings(size, () => ({ width: 0 }));

  useEffect(() => {
    api.start((i) => ({ width: i < index ? WIDTH : 0 }));
  }, [index, size]);

  return (
    <context.Provider value={{ setIndex, setSize }}>
      {index !== 0 &&
        <Animated.View style={[styles.header, { top: theme.spacing.statusBar }]} entering={FadeIn} exiting={FadeOut}>
          <BackButton onPress={() => navigation.goBack()} />
          <View style={[styles.progressContainer,]}>
            {springs.map((style, i) => (
              <View key={`progress-${i}`} style={[{ width: WIDTH }, styles.pill]}>
                <Box style={[styles.pillFill, styles.pillFillBack]} backgroundColor="quinaryText" />
                <AnimatedView style={[styles.pillFill, style]} >
                  <Box style={[styles.pillFill, styles.pillFillBack]} backgroundColor="mainText" />
                </AnimatedView>
              </View>
            ))}
          </View>
        </Animated.View>}
      {children}
    </context.Provider>
  )
}
