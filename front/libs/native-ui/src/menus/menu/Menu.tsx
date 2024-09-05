import React, { useState } from 'react';
import { View, TouchableHighlight, TouchableOpacity, ViewStyle, Platform } from 'react-native';
import Animated, { ZoomOut, ZoomIn, Easing } from 'react-native-reanimated';
import OutsidePressHandler from 'react-native-outside-press';
import { useTheme } from '@shopify/restyle';
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
                borderColor='contextMenuBorder'
                borderWidth={1}
                shadowColor='menuShadowColor'
                shadowOpacity={1}
                shadowRadius={12}
                shadowOffset={{ width: 0, height: 4 }}
                style={styles.menuOptions}
              >
                <View style={styles.menuClipper}>
                  <Box backgroundColor='contextMenu' style={styles.menuBackground} />
                  {props.items.map((item, index) => (
                    <>
                      {index !== 0 &&
                        <Seperator
                          variant='bare'
                          backgroundColor={Platform.OS === 'ios' ? 'menuSeperator' : 'transparent'}
                        />}
                      <TouchableHighlight
                        style={styles.rowContainer}
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
                    </>
                  ))}
                </View>
              </Box>
            </Animated.View>
          </View>}
      </View>
    </OutsidePressHandler >
  );
}


export default Menu;
