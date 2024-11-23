import { createContext, useContext, useEffect, useState } from "react";
import { useTheme } from "@shopify/restyle";
import { useSprings } from "@react-spring/native";

import styles from './styles/progress';
import { View } from "react-native";
import { Box, AnimatedView } from '@ledget/native-ui';

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

const WIDTH = 24;

export default function ({ children }: { children: React.ReactNode }) {
  const [index, setIndex] = useState(0);
  const [size, setSize] = useState(0);
  const theme = useTheme();

  const [springs, api] = useSprings(size, () => ({ width: 0 }));

  useEffect(() => {
    api.start((i) => ({ width: i < index ? WIDTH : 0 }));
  }, [index, size]);

  return (
    <context.Provider value={{ setIndex, setSize }}>
      {index !== 0 &&
        <View style={[styles.progressContainer, { top: theme.spacing.statusBar * 1.75 }]}>
          {springs.map((style, i) => (
            <View key={`progress-${i}`} style={[{ width: WIDTH }, styles.pill]}>
              <Box style={[styles.pillFill, styles.pillFillBack]} backgroundColor="quinaryText" />
              <AnimatedView style={[styles.pillFill, style]} >
                <Box style={[styles.pillFill, styles.pillFillBack]} backgroundColor="mainText" />
              </AnimatedView>
            </View>
          ))}
        </View>}
      {children}
    </context.Provider>
  )
}
