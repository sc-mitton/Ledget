import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  headerRight: {
    position: 'absolute',
    right: 16,
    top: 4,
    zIndex: 10
  },
  overlay: {
    position: 'absolute',
    zIndex: 100
  },
  headerLeft: {
    position: 'absolute',
    left: 12
  }
});

export default styles;
