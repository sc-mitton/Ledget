import { StyleSheet } from "react-native"
import { BlurView } from "expo-blur"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"

import styles from "../styles/main"
import { HomeScreenProps } from "@types"
import { useAppDispatch } from "@hooks"
import { Button, Icon, Header2 } from "@ledget/native-ui"
import { Widgets as WidgetsIcon } from '@ledget/media/native';
import { useEffect } from "react"
import { hideBottomTabs } from "@/features/uiSlice"
import { useGetMeQuery } from "@ledget/shared-features"
import { useAppearance } from "@/features/appearanceSlice"
import WidgetsGrid from "./WidgetsGrid"

const MainScreen = (props: HomeScreenProps<'Main'>) => {
  const { data: user } = useGetMeQuery();
  const dispatch = useAppDispatch()
  const { mode } = useAppearance()

  useEffect(() => {
    if (props.route.params?.editMode) {
      dispatch(hideBottomTabs(true))
      props.navigation.setOptions({
        headerRight: () =>
          <Animated.View style={styles.headerRight} entering={FadeIn} exiting={FadeOut}>
            <Button
              label='Close'
              textColor='blueText'
              onPress={() => {
                props.navigation.setParams({ editMode: false });
              }}
            />
          </Animated.View>,
        headerLeft: () => null
      })
    } else {
      dispatch(hideBottomTabs(false))
      props.navigation.setOptions({
        headerRight: () => (
          <Animated.View style={styles.headerRight} entering={FadeIn} exiting={FadeOut}>
            <Button
              onPress={() => {
                props.navigation.setParams({ editMode: props.route.params?.editMode ? false : true });
              }}
              variant='square'

              backgroundColor='grayButton'
            >
              <Icon icon={WidgetsIcon} color='secondaryText' />
            </Button>
          </Animated.View>
        ),
        headerLeft: () =>
          <Animated.View style={styles.headerLeft} entering={FadeIn} exiting={FadeOut}>
            <Header2>
              {`Welcome ${user?.name.first}`}
            </Header2>
          </Animated.View>
      })
    }
  }, [props.route.params?.editMode])

  return (
    <>
      {props.route.params?.editMode && (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={[styles.overlay, StyleSheet.absoluteFill]}>
          <BlurView
            intensity={40}
            style={[StyleSheet.absoluteFill, styles.overlay]}
            tint={mode === 'dark' ? 'dark' : 'light'}
          />
        </Animated.View>
      )}
      <WidgetsGrid {...props} />
    </>
  )
}

export default MainScreen
