import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  navBlurView: {
    position: 'absolute',
    zIndex: 100,
    bottom: 0,
    paddingLeft: 32,
    paddingRight: 32,
    paddingTop: 24,
    paddingBottom: 40,
    left: -24,
    right: -24,
  },
  navBack: {
    position: 'absolute',
    opacity: .5,
    top: 0,
    left: -24,
    right: -24,
    bottom: 0,
  },
  nav: {
    position: 'relative',
    zIndex: 101,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 8,
    paddingRight: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default styles;
