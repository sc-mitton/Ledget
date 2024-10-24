import { useState } from "react";
import { StyleSheet, Dimensions, View } from "react-native"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"
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
import WidgetsGrid from "./WidgetsGrid"

const MainScreen = (props: HomeScreenProps<'Main'>) => {
  const { data: user } = useGetMeQuery();
  const dispatch = useAppDispatch()
  const theme = useTheme()
  // const [pickerMode, setPickerMode] = useState(false)
  const [state, setState] = useState<'picking' | 'editing'>()

  useEffect(() => {
    if (state === 'picking') {
      dispatch(hideBottomTabs(true))
    }
    if (state) {
      props.navigation.setOptions({
        header: () =>
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Box
              paddingTop='statusBar'
              style={[styles.header]}
              backgroundColor={state === 'picking' ? 'widgetPickerBackground' : 'mainBackground'}
            >
              {state === 'editing'
                ? <Header2>{`Welcome, ${user?.name.first}`}</Header2>
                : <Box />}
              <View>
                <Button
                  label={state === 'editing' ? 'Done' : 'Close'}
                  variant={'bold'}
                  borderRadius="circle"
                  paddingHorizontal="l"
                  paddingVertical="xs"
                  backgroundColor={state === 'picking' ? 'transparent' : 'grayButton'}
                  textColor={state === 'picking' ? 'blueText' : 'secondaryText'}
                  onPress={() => { setState(undefined) }}
                />
              </View>
            </Box>
            {state === 'picking' &&
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
              </Canvas>}
          </Animated.View>,
      })
    } else {
      dispatch(hideBottomTabs(false))
      props.navigation.setOptions({
        header: () => (
          <Animated.View entering={FadeIn} exiting={FadeOut} >
            <Box paddingTop='statusBar' style={styles.header}>
              <Header2>{`Welcome, ${user?.name.first}`}</Header2>
              <Button
                onPress={() => { setState('picking') }}
                variant='square'
                backgroundColor='grayButton'
              >
                <Icon icon={WidgetsIcon} color='mainText' />
              </Button>
            </Box>
          </Animated.View>
        )
      })
    }
  }, [state])

  return (
    <>
      {state === 'picking' && (
        <Animated.View
          entering={FadeIn}
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
      <WidgetsGrid state={state} setState={setState} />
    </>
  )
}

export default MainScreen
