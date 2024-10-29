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
  }
});

export default styles;
