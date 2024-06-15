import { StyleSheet, Text, View } from 'react-native';
import { Home, DollarSign, Activity, User } from '@geist-ui/icons';

export default function Nav() {
  return (
    <View style={styles.nav}>
      <View style={styles.navItem}>
        {/* <Home /> */}
        <Text>Home</Text>
      </View>
      <View style={styles.navItem}>
        {/* <DollarSign /> */}
        <Text>Transactions</Text>
      </View>
      <View style={styles.navItem}>
        {/* <Activity /> */}
        <Text>Activity</Text>
      </View>
      <View style={styles.navItem}>
        {/* <User /> */}
        <Text>Profile</Text>
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
  }
});
