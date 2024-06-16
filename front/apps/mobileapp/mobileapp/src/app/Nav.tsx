import { StyleSheet, Text, View } from 'react-native';
import { Home, DollarSign, Activity, User } from 'geist-native-icons';

export default function Nav() {
  return (
    <View style={styles.nav}>
      <View style={styles.navItem}>
        <Home />
      </View>
      <View style={styles.navItem}>
        <DollarSign />
      </View>
      <View style={styles.navItem}>
        <Activity />
      </View>
      <View style={styles.navItem}>
        <User />
      </View>
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
