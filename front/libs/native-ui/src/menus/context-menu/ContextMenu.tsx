import React, { useState } from 'react';
import { View, TouchableHighlight, ViewStyle, Platform } from 'react-native';
import Animated, { ZoomOut, ZoomIn, Easing } from 'react-native-reanimated';
import OutsidePressHandler from 'react-native-outside-press';
import { useTheme } from '@shopify/restyle';
import * as Haptics from 'expo-haptics';

import styles from './styles';
import { Box } from '../../restyled/Box';
import { Text } from '../../restyled/Text';
import { Seperator } from '../../restyled/Seperator';

/* eslint-disable-next-line */
export interface ContextMenuProps {
  items: {
    label: string;
    icon: () => JSX.Element;
    onSelect: () => void;
  }[];
  touchableStyle?: ViewStyle;
  children?: React.ReactNode;
  onShowChange?: (show: boolean) => void;
  disabled?: boolean;
}

export function ContextMenu(props: ContextMenuProps) {
  const [show, setShow] = useState(false);
  const theme = useTheme();
  const touchRef = React.useRef<TouchableHighlight>(null);
  const [touchableKey, setTouchableKey] = useState(0);

  return (
    <OutsidePressHandler onOutsidePress={() => {
      setShow(false);
      props.onShowChange && props.onShowChange(false);
    }}>
      <View style={styles.container}>
        <TouchableHighlight
          ref={touchRef}
          key={touchableKey}
          disabled={props.disabled}
          underlayColor={theme.colors.whiteText}
          activeOpacity={.97}
          style={props.touchableStyle}
          onLongPress={(e) => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            props.onShowChange && props.onShowChange(!show);
            setShow(!show);
            setTouchableKey(touchableKey + 1);
          }}>
          {props.children}
        </TouchableHighlight>
        {show &&
          <View style={[styles.menuContainer]}>
            <Animated.View
              style={styles.menu}
              entering={ZoomIn.withInitialValues({ transform: [{ scale: .2 }], opacity: 0 }).duration(200).easing(Easing.ease)}
              exiting={ZoomOut.withInitialValues({ transform: [{ scale: 1 }] }).duration(200).easing(Easing.ease)}>
              <Box
                borderColor='contextMenuBorder'
                borderWidth={1}
                shadowColor='menuShadowColor'
                shadowOpacity={1}
                shadowRadius={12}
                shadowOffset={{ width: 0, height: 4 }}
                style={styles.menuOptions}
              >
                <Box backgroundColor='contextMenu' style={styles.menuBackground} />
                {props.items.map((item, index) => (
                  <>
                    <TouchableHighlight
                      style={styles.row}
                      activeOpacity={0.6}
                      onPress={item.onSelect}
                      key={`context-menu-item-${index}`}>
                      <>
                        <Text fontSize={15}>{item.label}</Text>
                        <View style={styles.icon}><item.icon /></View>
                      </>
                    </TouchableHighlight>
                    {index < props.items.length - 1 &&
                      <Seperator
                        variant='bare'
                        backgroundColor={Platform.OS === 'ios' ? 'menuSeperator' : 'transparent'}
                      />}
                  </>
                ))}
              </Box>
            </Animated.View>
          </View>}
      </View>
    </OutsidePressHandler >
  );
}


export default ContextMenu;
