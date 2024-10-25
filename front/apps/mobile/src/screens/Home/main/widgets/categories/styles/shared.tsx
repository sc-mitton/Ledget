import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  row: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    margin: 2
  },
  columns: {
    justifyContent: 'space-evenly',
    width: '100%',
    height: '100%',
  },
  image: {
    width: 20,
    height: 20,
  }
});

export default styles;
