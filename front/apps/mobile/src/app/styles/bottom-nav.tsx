import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  navBlurView: {
    position: 'absolute',
    zIndex: 0,
    bottom: 0,
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 20,
    paddingBottom: 32,
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
  },
  activityButtonContainer: {
    position: 'relative',
  },
  indicator: {
    width: 5,
    height: 5,
    position: 'absolute',
    top: -2,
    right: -2,
    borderRadius: 4
  }
});

export default styles;
