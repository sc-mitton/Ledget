import React, { Fragment, useState } from 'react';
import { View, TouchableHighlight, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, { ZoomOut, ZoomIn, Easing } from 'react-native-reanimated';
import OutsidePressHandler from 'react-native-outside-press';
import { useTheme } from '@shopify/restyle';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

import styles, { placementStyles, menuPlacementStyles } from './styles';
import { Box } from '../../restyled/Box';
import { Text } from '../../restyled/Text';
import { Seperator } from '../../restyled/Seperator';

/* eslint-disable-next-line */
export interface MenuProps {
  as?: 'context-menu' | 'menu';
  items: {
    label: string;
    icon?: () => JSX.Element;
    onSelect: () => void;
    newSection?: boolean;
  }[];
  touchableStyle?: ViewStyle;
  children?: React.ReactNode;
  closeOnSelect?: boolean;
  onShowChange?: (show: boolean) => void;
  disabled?: boolean;
  placement?: 'center' | 'left' | 'right';
}

export function Menu(props: MenuProps) {
  const [show, setShow] = useState(false);
  const theme = useTheme();
  const touchRef = React.useRef<View>(null);
  const [touchableKey, setTouchableKey] = useState(0);

  return (
    <>
      <OutsidePressHandler onOutsidePress={() => {
        setShow(false);
        props.onShowChange && props.onShowChange(false);
      }}>
        <View style={styles.container}>
          {props.as === 'context-menu'
            ?
            <TouchableHighlight
              ref={touchRef}
              key={touchableKey}
              underlayColor={theme.colors.whiteText}
              activeOpacity={.97}
              disabled={props.disabled}
              style={props.touchableStyle}
              onLongPress={(e) => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                props.onShowChange && props.onShowChange(!show);
                setShow(!show);
                setTouchableKey(touchableKey + 1);
              }}>
              {props.children}
            </TouchableHighlight>
            :
            <TouchableOpacity
              ref={touchRef}
              key={touchableKey}
              disabled={props.disabled}
              activeOpacity={.7}
              style={props.touchableStyle}
              onPress={(e) => {
                props.onShowChange && props.onShowChange(!show);
                setShow(!show);
                setTouchableKey(touchableKey + 1);
              }}>
              {props.children}
            </TouchableOpacity>
          }
          {show &&
            <View style={[styles.menuContainer, placementStyles[props.placement || 'center']]}>
              <Animated.View
                style={[styles.menu, menuPlacementStyles[props.placement || 'center']]}
                entering={ZoomIn.withInitialValues({ transform: [{ scale: .5 }], opacity: 0 }).duration(300).easing(Easing.elastic(.9))}
                exiting={ZoomOut.duration(150).easing(Easing.ease)}>
                <Box
                  shadowColor='menuShadowColor'
                  shadowOpacity={1}
                  shadowRadius={20}
                  elevation={15}
                  shadowOffset={{ width: 0, height: 6 }}
                  style={styles.menuOptions}
                >
                  <BlurView
                    style={styles.menuClipper} intensity={40}
                    tint={theme.colors.mode === 'dark' ? 'dark' : 'light'}
                  >
                    <Box style={styles.menuBackground} />
                    {props.items.map((item, index) => (
                      <Fragment key={`context-menu-item-${item.label.replace(' ', '-')}`}>
                        {index !== 0 &&
                          <View style={styles.seperator}>
                            <Seperator
                              variant='bare'
                              height={item.newSection ? 4 : undefined}
                              backgroundColor={item.newSection
                                ? theme.colors.mode === 'dark' ? 'mainBackground' : 'menuSeperator'
                                : 'menuSeperator'}
                            />
                          </View>}
                        <TouchableHighlight
                          style={styles.rowContainer}
                          underlayColor={theme.colors.mainText}
                          activeOpacity={0.9}
                          onPress={() => {
                            if (props.closeOnSelect) {
                              setShow(false);
                              props.onShowChange && props.onShowChange(false);
                            }
                            item.onSelect()
                          }}
                          key={`context-menu-item-${item.label.replace(' ', '-')}`}>
                          <Box backgroundColor='contextMenu' style={styles.row}>
                            <Text fontSize={15}>{item.label}</Text>
                            {item.icon && <View style={styles.icon}><item.icon /></View>}
                          </Box>
                        </TouchableHighlight>
                      </Fragment>
                    ))}
                  </BlurView>
                </Box>
              </Animated.View>
            </View>}
        </View>
      </OutsidePressHandler >
    </>
  );
}


export default Menu;
