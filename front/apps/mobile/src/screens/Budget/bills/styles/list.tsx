import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  rows: {
    width: '100%',
  },
  rowsWithOverflow: {
    marginBottom: 24,
  },
  amount: {
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginVertical: 10,
  },
  seperator: {
    paddingLeft: 48,
  },
  arrowIcon: {
    marginLeft: 4,
  },
  expandButtonContainer: {
    position: 'absolute',
    bottom: 6,
    justifyContent: 'center',
    alignItems: 'center',
    left: '50%',
  },
  expandButton: {
    position: 'absolute',
  },
});

export default styles;
