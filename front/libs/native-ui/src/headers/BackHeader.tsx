import { StackHeaderProps } from '@react-navigation/stack';
import { View, NativeModules } from 'react-native';

import styles from './styles';
import { Box } from '../restyled/Box';
import { BackButton } from '../buttons/back-button/BackButton';
import { Text } from '../restyled/Text';

const { StatusBarManager } = NativeModules;

interface Props extends StackHeaderProps {
  pagesWithTitle?: string[];
  authenticationScreens?: boolean;
  height?: number;
  top?: number;
}

export function BackHeader(props: Props) {
  const { navigation, route, options, pagesWithTitle, top, height = 44 } = props;

  return (
    <Box
      style={[
        styles.headerContainer,
        { top: top || StatusBarManager.HEIGHT + 8, height }
      ]}
      backgroundColor={props.authenticationScreens ? 'accountsMainBackground' : 'mainBackground'}
    >
      <Box style={styles.backButton}>
        <BackButton onPress={(e) => {
          e.preventDefault();
          navigation.goBack();
        }} />
      </Box>
      {pagesWithTitle?.includes(route.name) &&
        <Text fontSize={19} style={styles.title} color='highContrastText'>
          {props.options.title || route.name}
        </Text>}
      <View style={styles.menuContainer}>
        {options.headerRight && options.headerRight({})}
      </View>
    </Box>
  )
}
