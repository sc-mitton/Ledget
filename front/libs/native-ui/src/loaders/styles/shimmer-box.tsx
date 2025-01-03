import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  boxShimmer: {
    zIndex: 2,
    position: 'absolute',
    width: '200%',
    height: '310%',
  },
  box: {
    position: 'relative',
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
});
