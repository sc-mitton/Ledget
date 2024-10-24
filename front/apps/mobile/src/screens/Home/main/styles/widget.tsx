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
    alignItems: 'center'
  },
  dragBar: {
    position: 'absolute',
    width: 0,
    borderWidth: 4
  },
  deleteButtonContainer: {
    position: 'absolute',
    top: -6,
    left: -6,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default styles;
