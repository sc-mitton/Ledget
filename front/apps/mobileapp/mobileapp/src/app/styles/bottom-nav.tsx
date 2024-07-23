import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  navBlurView: {
    position: 'absolute',
    zIndex: 0,
    bottom: 0,
    paddingLeft: 40,
    paddingRight: 40,
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default styles;
