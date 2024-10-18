import { StyleSheet } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import styles from '../styles/widgets-grid';
import { Box } from "@ledget/native-ui";
import { useAppSelector } from "@hooks";
import { selectAvailableWidgets, selectCurrentWidgets } from "@/features/widgetsSlice";
import { useRef } from "react";
import { HomeScreenProps } from '@types';
import { getGridPositions } from './helpers';

const WidgetsGrid = (props: HomeScreenProps<'Main'>) => {
  const containerWidth = useRef(0);

  const currentWidgets = useAppSelector(selectCurrentWidgets);
  const availableWidgets = useAppSelector(selectAvailableWidgets);

  const scrollY = useSharedValue(0);
  const gridPositions = useSharedValue(getGridPositions(currentWidgets, availableWidgets))

  return (
    <>
      <Box style={styles.currentWidgets} variant='nestedScreen'>

      </Box>
      <Box
        style={[styles.container, StyleSheet.absoluteFill]}
        onLayout={(e) => containerWidth.current = e.nativeEvent.layout.width}
      >
        <Box variant='nestedScreen'>

        </Box>
      </Box>
    </>
  )
}

export default WidgetsGrid;
