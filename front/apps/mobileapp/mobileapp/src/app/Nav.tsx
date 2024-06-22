import { StyleSheet, View } from 'react-native';
import { Home, DollarSign, Activity, User } from 'geist-icons-native';
import { useTheme } from '@shopify/restyle';

import { Institution } from '@ledget/media/native';

export default function Nav() {
  const theme = useTheme();

  return (
    <View style={styles.nav}>
      <Home stroke={'#000'} size={20} />
      <DollarSign stroke={'#000'} size={20} />
      <Activity stroke={'#000'} size={20} />
      <Institution stroke={'#000'} size={20} />
      <User stroke={'#000'} size={20} />
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    position: 'absolute',
    justifyContent: 'space-between',
    flexDirection: 'row',
    bottom: 40,
    paddingLeft: 32,
    paddingRight: 32,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navSvg: {
    color: '#000',
  },
});
