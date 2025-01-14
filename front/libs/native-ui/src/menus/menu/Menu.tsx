import React, { Fragment, useState } from 'react';
import {
  View,
  TouchableHighlight,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
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
    isSelected?: boolean;
    onSelect: () => void;
    newSection?: boolean;
  }[];
  touchableStyle?: ViewStyle;
  children?: React.ReactNode;
  closeOnSelect?: boolean;
  onShowChange?: (show: boolean) => void;
  disabled?: boolean;
  placement?: 'center' | 'left' | 'right';
  hasShadow?: boolean;
}

export function Menu(props: MenuProps) {
  const { hasShadow = true } = props;

  const [show, setShow] = useState(false);
  const theme = useTheme();
  const [touchableKey, setTouchableKey] = useState(0);

  return (
    <OutsidePressHandler
      onOutsidePress={() => {
        if (!show) return;
        setShow(false);
        props.onShowChange && props.onShowChange(false);
      }}
    >
      <View style={styles.container}>
        {props.as === 'context-menu' ? (
          <TouchableHighlight
            key={touchableKey}
            underlayColor={theme.colors.whiteText}
            activeOpacity={0.97}
            disabled={props.disabled}
            style={props.touchableStyle}
            onPress={() => {
              if (show) {
                setShow(false);
                props.onShowChange && props.onShowChange(false);
              }
            }}
            onLongPress={(e) => {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Warning
              );
              props.onShowChange && props.onShowChange(!show);
              setShow(!show);
              setTouchableKey(touchableKey + 1);
            }}
          >
            {props.children}
          </TouchableHighlight>
        ) : (
          <TouchableOpacity
            key={touchableKey}
            disabled={props.disabled}
            activeOpacity={0.7}
            style={props.touchableStyle}
            onPress={(e) => {
              props.onShowChange && props.onShowChange(!show);
              setShow(!show);
              setTouchableKey(touchableKey + 1);
            }}
          >
            {props.children}
          </TouchableOpacity>
        )}
        {show && (
          <View
            style={[
              styles.menuContainer,
              placementStyles[props.placement || 'center'],
            ]}
          >
            <Animated.View
              style={[
                styles.menu,
                menuPlacementStyles[props.placement || 'center'],
              ]}
              entering={ZoomIn.withInitialValues({
                transform: [{ scale: 0.5 }],
                opacity: 0,
              })
                .duration(300)
                .easing(Easing.elastic(0.9))}
              exiting={ZoomOut.duration(150).easing(Easing.ease)}
            >
              <Box
                shadowColor="menuShadowColor"
                shadowOpacity={hasShadow ? 1 : 0}
                shadowRadius={8}
                elevation={15}
                shadowOffset={{ width: 0, height: 6 }}
                style={styles.menuOptions}
              >
                <BlurView
                  style={styles.menuClipper}
                  intensity={50}
                  tint={theme.colors.mode === 'dark' ? 'dark' : 'light'}
                >
                  <Box style={styles.menuBackground} />
                  {props.items.map((item, index) => (
                    <Fragment
                      key={`context-menu-item-${item.label.replace(' ', '-')}`}
                    >
                      {index !== 0 && (
                        <View style={styles.seperator}>
                          <Seperator
                            variant="bare"
                            height={item.newSection ? 4 : undefined}
                            backgroundColor={
                              item.newSection
                                ? theme.colors.mode === 'dark'
                                  ? 'nestedContainerSeperator'
                                  : 'menuSeperator'
                                : 'menuSeperator'
                            }
                          />
                        </View>
                      )}
                      <TouchableHighlight
                        style={styles.rowContainer}
                        underlayColor={theme.colors.menuSeperator}
                        activeOpacity={0.93}
                        onPress={() => {
                          if (props.closeOnSelect) {
                            setShow(false);
                            props.onShowChange && props.onShowChange(false);
                          }
                          item.onSelect();
                        }}
                        key={`context-menu-item-${item.label.replace(
                          ' ',
                          '-'
                        )}`}
                      >
                        <View style={styles.row}>
                          <Text
                            fontSize={15}
                            color={item.isSelected ? 'blueText' : 'mainText'}
                          >
                            {item.label}
                          </Text>
                          {item.icon && (
                            <View style={styles.icon}>
                              <item.icon />
                            </View>
                          )}
                          <Box
                            backgroundColor="contextMenu"
                            style={styles.rowBackground}
                          />
                        </View>
                      </TouchableHighlight>
                    </Fragment>
                  ))}
                </BlurView>
              </Box>
            </Animated.View>
          </View>
        )}
      </View>
    </OutsidePressHandler>
  );
}

export default Menu;
