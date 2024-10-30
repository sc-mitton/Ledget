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
  const theme = useTheme()

  useEffect(() => {
    if ('picking' === props.route.params.state) {
      dispatch(hideBottomTabs(true))
    } else {
      dispatch(hideBottomTabs(false))
    }
  }, [props.route.params])

  useEffect(() => {
    props.navigation.setOptions({
      header: () =>
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          <Box
            paddingTop='statusBar'
            style={[styles.header]}
            backgroundColor={props.route.params.state === 'picking' ? 'widgetPickerBackground' : 'mainBackground'}
          >
            {props.route.params.state === 'picking'
              ? <Box />
              : <Header2>{`Welcome, ${user?.name.first}`}</Header2>}
            <View style={styles.headerRight}>
              {['editing', 'picking'].includes(props.route.params.state) &&
                <Button
                  label={props.route.params.state === 'editing' ? 'Done' : 'Close'}
                  variant={'bold'}
                  borderRadius="circle"
                  marginTop='xs'
                  paddingHorizontal="l"
                  paddingVertical="xs"
                  backgroundColor={props.route.params.state === 'picking' ? 'transparent' : 'grayButton'}
                  textColor={props.route.params.state === 'picking' ? 'blueText' : 'secondaryText'}
                  onPress={() => {
                    props.navigation.setParams({ state: 'idle' })
                  }}
                />}
              {['dropping', 'idle'].includes(props.route.params.state) &&
                <>
                  <Button
                    onPress={() => { props.navigation.setParams({ state: 'editing' }) }}
                    variant='square'
                    backgroundColor='grayButton'
                    icon={<Icon icon={Edit2} color='mainText' size={18} />}
                  />
                  <Button
                    onPress={() => { props.navigation.setParams({ state: 'picking' }) }}
                    variant='square'
                    backgroundColor='grayButton'
                    icon={<Icon icon={WidgetsIcon} color='mainText' />}
                  />
                </>}
            </View>
          </Box>
          {props.route.params.state === 'picking' &&
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
  }, [props.route.params.state])

  return (
    <>
      {props.route.params.state === 'picking' && (
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
