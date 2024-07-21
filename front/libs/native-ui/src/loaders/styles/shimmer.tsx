import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    justifyContent: 'center',
    overflow: 'hidden',
    flexDirection: 'row',
    flex: 1,
    height: '100%',
  },
  shimmer: {
    position: 'absolute',
    width: '33%',
    height: '200%',
    left: '50%',
    top: '-50%'
  },
  filled: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  rotated: {
    transform: [{ rotate: '30deg' }],
  }
});
