import { useState } from "react";
import { StyleSheet, Dimensions, View } from "react-native"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"
import { Canvas, Rect, vec, LinearGradient } from '@shopify/react-native-skia';
import { useTheme } from "@shopify/restyle";
import { Edit2 } from "geist-native-icons";

import styles from "../styles/main"
import { HomeScreenProps } from "@types"
import { useAppDispatch } from "@hooks"
import { Button, Icon, Header2, Box } from "@ledget/native-ui"
import { Widgets as WidgetsIcon } from '@ledget/media/native';
import { useEffect } from "react"
import { hideBottomTabs } from "@/features/uiSlice"
import { useGetMeQuery } from "@ledget/shared-features"
import WidgetsBento from "./WidgetsBento"

const MainScreen = (props: HomeScreenProps<'Main'>) => {
  const { data: user } = useGetMeQuery();
  const dispatch = useAppDispatch()
  const [showOverlay, setShowOverlay] = useState(false)

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
          <Box
            paddingTop='statusBar'
            style={[styles.header]}
            backgroundColor={showOverlay ? 'widgetPickerBackground' : 'transparent'}
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
                  <Button
                    onPress={() => { props.navigation.setParams({ state: 'editing' }) }}
                    variant='square'
                    backgroundColor='grayButton'
                    icon={<Icon icon={Edit2} color='mainText' size={18} />}
                  />
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
        </Animated.View>,
    })
  }, [])

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
      <WidgetsBento {...props} />
    </>
  )
}

export default MainScreen
