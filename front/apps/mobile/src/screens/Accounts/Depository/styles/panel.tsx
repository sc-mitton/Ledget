import { Dimensions, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  boxHeader: {
    marginLeft: 4,
    marginBottom: 8,
  },
  summary: {
    position: 'relative',
    zIndex: 0,
  },
  transactions: {
    flex: 1,
    zIndex: 1,
  },
  seperator: {
    width: '200%',
    zIndex: -1,
    transform: [{ translateX: -1 * Dimensions.get('window').width / 2 }],
  }
});

export default styles;
