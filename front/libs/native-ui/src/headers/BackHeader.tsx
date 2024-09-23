import { StackHeaderProps } from '@react-navigation/stack';
import { View, NativeModules } from 'react-native';

import styles from './styles';
import { Box } from '../restyled/Box';
import { BackButton } from '../buttons/back-button/BackButton';
import { Text } from '../restyled/Text';
import { Seperator } from '../restyled/Seperator';

const { StatusBarManager } = NativeModules;

export function BackHeader(props: StackHeaderProps & { pagesWithTitle?: string[], authenticationScreens?: boolean }) {
  const { navigation, route, options, pagesWithTitle } = props;

  return (
    <Box
      style={[
        styles.headerContainer,
        { top: StatusBarManager.HEIGHT }
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
          {route.name}
        </Text>}
      <View style={styles.seperator}>
        <Seperator variant='bare' height={2} backgroundColor='mainScreenSeperator' />
      </View>
      <View style={styles.menuContainer}>
        {options.headerRight && options.headerRight({})}
      </View>
    </Box>
  )
}
