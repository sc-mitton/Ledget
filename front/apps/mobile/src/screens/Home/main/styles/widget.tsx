import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  filled: {
    flex: 1
  },
  clipBox: {
    overflow: 'hidden',
  },
  button: {
    transform: [{ scale: 1.1 }],
  },
  dragBarContainer: {
    position: 'absolute',
    top: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dragBar: {
    position: 'absolute',
    width: 0,
    borderWidth: 6
  },
  deleteButtonContainer: {
    position: 'absolute',
    top: -6,
    left: -6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  gestureArea: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    bottom: 16
  }
});

export default styles;
