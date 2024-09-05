import { useState, useEffect, useContext, createContext } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';

import styles from './styles';
import type { TContext } from './types';
import { Box } from '../../restyled/Box';

const ModalPickerContext = createContext<TContext | undefined>(undefined);

export function useModalPicker() {
  const context = useContext(ModalPickerContext);
  if (context === undefined) {
    throw new Error('useModalPicker must be used within a ModalPickerProvider');
  }
  return context;
}

export function ModalPickerProvider({ children }: { children: React.ReactNode }) {
  const [showModalOverlay, setShowModalOverlay] = useState(false);
  const [modalKey, setModalKey] = useState(Math.random().toString().slice(2, 6));
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (showModalOverlay) {
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      setModalKey(Math.random().toString().slice(2, 6));
    }
  }, [showModalOverlay]);

  return (
    <ModalPickerContext.Provider value={{ setShowModalOverlay }}>
      {showModalOverlay &&
        <Animated.View style={[{ opacity }, styles.modalOverlayContainer]} key={modalKey}>
          <Box backgroundColor='modalOverlay' style={[StyleSheet.absoluteFillObject, styles.modalOverlay]} />
        </Animated.View>}
      {children}
    </ModalPickerContext.Provider>
  );
}

export default ModalPickerProvider;
