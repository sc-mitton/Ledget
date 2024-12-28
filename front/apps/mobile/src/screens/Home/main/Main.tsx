import { useState } from "react";
import { StyleSheet, Dimensions, View } from "react-native"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"
import { Canvas, Rect, vec, LinearGradient } from '@shopify/react-native-skia';
import { useTheme } from "@shopify/restyle";
import { Edit2, Plus } from "geist-native-icons";

import styles from "../styles/main"
import { HomeScreenProps } from "@types"
import { useAppDispatch } from "@hooks"
import { Button, Icon, Header2, Box, Text } from "@ledget/native-ui"
import { useEffect } from "react"
import { hideBottomTabs } from "@/features/uiSlice"
import { useGetMeQuery } from "@ledget/shared-features"
import { selectWidgets } from "@/features/widgetsSlice";
import { useAppSelector } from '@hooks'
import { WidgetsGraphicDark, WidgetsGraphicLight, Widgets as WidgetsIcon } from "@ledget/media/native";
import WidgetsBento from "./WidgetsBento"
import { useAppearance } from "@/features/appearanceSlice";

const MainScreen = (props: HomeScreenProps<'Main'>) => {
  const { data: user } = useGetMeQuery();
  const dispatch = useAppDispatch()
  const [showOverlay, setShowOverlay] = useState(false)
  const theme = useTheme()
  const { mode } = useAppearance()
  const selectedStoredWidgets = useAppSelector(selectWidgets);

  useEffect(() => {
    if (props.route.params?.state === 'dropping') {
      dispatch(hideBottomTabs(false))
      setShowOverlay(false)
    }
  }, [props.route.params?.state])

  useEffect(() => {
    props.navigation.setOptions({
      header: (props: any) =>
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          {props.route.params?.state === 'picking' &&
            <Animated.View
              entering={FadeIn.delay(1000)}
              exiting={FadeOut}
              style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.widgetPickerBackground }]} /
            >}
          <Box
            paddingTop='statusBar'
            style={[styles.header]}
          >
            {props.route.params?.state === 'picking'
              ? <Box />
              : <Header2>{`Welcome, ${user?.name.first}`}</Header2>}
            <View style={styles.headerRight}>
              {['editing', 'picking'].includes(props.route.params?.state) &&
                <Button
                  label={props.route.params?.state === 'editing' ? 'Done' : 'Close'}
                  variant={'bold'}
                  borderRadius="circle"
                  marginTop='xs'
                  paddingHorizontal="l"
                  paddingVertical="xs"
                  backgroundColor={showOverlay ? 'transparent' : 'grayButton'}
                  textColor={props.route.params?.state === 'picking' ? 'blueText' : 'secondaryText'}
                  onPress={() => {
                    props.navigation.setParams({ state: 'idle' })
                    dispatch(hideBottomTabs(false))
                    setShowOverlay(false)
                  }}
                />}
              {['dropping', 'idle'].includes(props.route.params?.state) &&
                <>
                  {selectedStoredWidgets.length > 0 &&
                    <Button
                      onPress={() => { props.navigation.setParams({ state: 'editing' }) }}
                      variant='square'
                      backgroundColor='grayButton'
                      icon={<Icon icon={Edit2} color='mainText' size={18} />}
                    />}
                  <Button
                    onPress={() => {
                      props.navigation.setParams({ state: 'picking' })
                      dispatch(hideBottomTabs(true))
                      setShowOverlay(true)
                    }}
                    variant='square'
                    backgroundColor='grayButton'
                    icon={<Icon icon={WidgetsIcon} color='mainText' />}
                  />
                </>}
            </View>
          </Box>
          {props.route.params?.state === 'picking' &&
            <Canvas style={[styles.mask]}>
              <Rect x={0} y={0} width={Dimensions.get('window').width} height={44}>
                <LinearGradient
                  colors={[
                    theme.colors.widgetPickerBackground,
                    theme.colors.blueChartGradientEnd
                  ]}
                  start={vec(0, 0)}
                  end={vec(0, 44)}
                />
              </Rect>
            </Canvas>}
        </Animated.View>,
    })
  }, [mode])

  return (
    <>
      {showOverlay && (
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
      {props.route.params?.state === 'idle' && selectedStoredWidgets.length === 0 &&
        <View style={styles.graphicContainer}>
          <View style={styles.graphic}>
            {mode === 'dark'
              ? <WidgetsGraphicDark />
              : <WidgetsGraphicLight />
            }
            <View style={styles.message}>
              <Text color='tertiaryText' textAlign="center">
                Welcome to your custom dashboard where you can
                add widgets to track all your financial activity.
              </Text>
              <Button
                label="Add Widget"
                textColor='blueText'
                labelPlacement="left"
                onPress={() => {
                  props.navigation.setParams({ state: 'picking' })
                  dispatch(hideBottomTabs(true))
                  setShowOverlay(true)
                }}
                icon={<Icon icon={Plus} color='blueText' size={18} strokeWidth={2} />}
              />
            </View>
          </View>
        </View>
      }
      <WidgetsBento {...props} />
    </>
  )
}

export default MainScreen
