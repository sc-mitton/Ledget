import { useState } from "react";
import { StyleSheet, Dimensions } from "react-native"
import Animated, { FadeIn, FadeOut, SlideInDown } from "react-native-reanimated"
import { Canvas, Rect, vec, LinearGradient } from '@shopify/react-native-skia';
import { useTheme } from "@shopify/restyle";

import styles from "../styles/main"
import { HomeScreenProps } from "@types"
import { useAppDispatch } from "@hooks"
import { Button, Icon, Header2, Box } from "@ledget/native-ui"
import { Widgets as WidgetsIcon } from '@ledget/media/native';
import { useEffect } from "react"
import { hideBottomTabs } from "@/features/uiSlice"
import { useGetMeQuery } from "@ledget/shared-features"
import { useAppearance } from "@/features/appearanceSlice"
import WidgetsGrid from "./WidgetsGrid"

const MainScreen = (props: HomeScreenProps<'Main'>) => {
  const { data: user } = useGetMeQuery();
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const [pickerMode, setPickerMode] = useState(false)

  useEffect(() => {
    if (pickerMode) {
      dispatch(hideBottomTabs(true))
      props.navigation.setOptions({
        header: () =>
          <Animated.View
            entering={SlideInDown.withInitialValues({ opacity: 0 })}
            exiting={FadeOut}
          >
            <Box
              paddingTop='statusBar'
              style={[styles.header]}
              backgroundColor={'widgetPickerBackground'}
            >
              <Box />
              <Button
                label='Close'
                variant='bold'
                textColor='blueText'
                paddingBottom='none'
                onPress={() => { setPickerMode(false) }}
              />
            </Box>
            <Canvas style={[styles.mask]}>
              <Rect x={0} y={0} width={Dimensions.get('window').width} height={28}>
                <LinearGradient
                  colors={[
                    theme.colors.widgetPickerBackground,
                    theme.colors.blueChartGradientEnd
                  ]}
                  start={vec(0, 0)}
                  end={vec(0, 28)}
                />
              </Rect>
            </Canvas>
          </Animated.View>,
      })
    } else {
      dispatch(hideBottomTabs(false))
      props.navigation.setOptions({
        header: () => (
          <Animated.View entering={FadeIn} exiting={FadeOut} >
            <Box paddingTop='statusBar' style={styles.header}>
              <Header2>
                {`Welcome ${user?.name.first}`}
              </Header2>
              <Button
                onPress={() => { setPickerMode(true) }}
                variant='square'
                backgroundColor='grayButton'
              >
                <Icon icon={WidgetsIcon} color='secondaryText' />
              </Button>
            </Box>
          </Animated.View>
        )
      })
    }
  }, [pickerMode])

  return (
    <>
      {pickerMode && (
        <Animated.View
          entering={SlideInDown}
          exiting={FadeOut}
          style={[styles.pickerBackground, StyleSheet.absoluteFill]}
        >
          <Box
            style={[StyleSheet.absoluteFill, styles.pickerBackground]}
            backgroundColor="widgetPickerBackground"
            borderTopLeftRadius="l"
            borderTopRightRadius="l"
          />
        </Animated.View>
      )}
      <WidgetsGrid pickerMode={pickerMode} setPickerMode={setPickerMode} />
    </>
  )
}

export default MainScreen
