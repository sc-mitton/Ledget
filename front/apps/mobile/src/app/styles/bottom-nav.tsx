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
    bottom: 0,
  },
  iosNavBlurViewSpacing: {
    left: -24,
    right: -24,
    paddingLeft: 20,
    paddingRight: 20,
  },
  androidNavBlurViewSpacing: {
    left: -64,
    right: -64,
    paddingLeft: 64,
    paddingRight: 64,
  },
  navBack: {
    position: 'absolute',
    opacity: 0.5,
    top: 0,
    left: -24,
    right: -24,
    bottom: 0,
  },
  nav: {
    position: 'relative',
    flex: 1,
    flexDirection: 'row',
    gap: 32,
    justifyContent: 'center',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButton: {
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 16,
  },
  iosTabButton: {
    paddingTop: 20,
    paddingBottom: 32,
  },
  androidTabButton: {
    paddingTop: 26,
    paddingBottom: 34,
  },
  activityButtonContainer: {
    position: 'relative',
  },
  indicator: {
    width: 4,
    height: 4,
    position: 'absolute',
    top: 18,
    right: 14,
    borderRadius: 4,
  },
});

export default styles;
