import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  filled: {
    flex: 1
  },
  clipBox: {
    overflow: 'hidden',
  },
  button: {
    transform: [{ scale: 1.01 }],
  },
  dragBarContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -12 }],
    width: 24,
    height: '100%',
  },
  dragBar: {
    position: 'absolute',
    width: 0,
    borderWidth: 3
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
    top: 8,
    left: 8,
    right: 8,
    bottom: 8
  },
  labelContainer: {
    position: 'absolute',
    bottom: -20,
    left: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    position: 'absolute',
  },
  overlay: {
    opacity: .8,
    zIndex: 100
  }
});

export default styles;
