import { StyleSheet } from 'react-native';

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
  }
});

export default styles;
