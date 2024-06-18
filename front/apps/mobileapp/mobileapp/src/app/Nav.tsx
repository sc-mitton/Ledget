import { StyleSheet, View } from 'react-native';
import { Home, DollarSign, Activity, User } from 'geist-icons-native';
// import { Institution } from '@ledget/media/native-icons';

export default function Nav() {
  return (
    <View style={styles.nav}>
      <Home stroke={'#000'} size={24} />
      <DollarSign stroke={'#000'} size={24} />
      {/* <Institution stroke={'#000'} size={24} /> */}
      <Activity stroke={'#000'} size={24} />
      <User stroke={'#000'} size={24} />
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
