import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  navBlurView: {
    position: 'absolute',
    zIndex: 0,
    bottom: 0,
  },
  androidCover: {
    width: 80,
    position: 'absolute',
    top: 0,
    bottom: 0
  },
  iosNavBlurViewSpacing: {
    paddingBottom: 32,
    paddingTop: 20,
    left: -24,
    right: -24,
    paddingLeft: 40,
    paddingRight: 40,
  },
  androidNavBlurViewSpacing: {
    paddingBottom: 20,
    paddingTop: 20,
    left: -64,
    right: -64,
    paddingLeft: 84,
    paddingRight: 84,
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
    justifyContent: 'space-between',
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
