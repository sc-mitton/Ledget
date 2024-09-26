import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  list: {
    gap: 6,
    marginTop: 20
  },
  name: {
    flexGrow: 1,
    marginLeft: 8
  },
  row: {
    flexDirection: 'row',
    paddingLeft: 8,
    gap: 12,
    paddingRight: 4,
    alignItems: 'center'
  },
  seperator: {
    paddingLeft: 48
  }
});

export default styles;
