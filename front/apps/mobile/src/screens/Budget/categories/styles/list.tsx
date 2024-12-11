import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  list: {
    gap: 12,
    marginTop: 6,
    alignItems: 'center'
  },
  rows: {
    width: '100%',
    paddingTop: 6
  },
  rowsWithOverflow: {
    marginBottom: 24,
  },
  name: {
    flexGrow: 3,
    flex: 3,
    flexShrink: 1,
    marginLeft: 16,
  },
  amountSpent: {
    marginRight: 8
  },
  limitAmount: {
    alignItems: 'flex-end',
    marginLeft: 8,
    marginRight: 8
  },
  row: {
    flexDirection: 'row',
    paddingLeft: 8,
    alignItems: 'center',
    marginVertical: 14
  },
  seperator: {
    paddingLeft: 48
  },
  arrowIcon: {
    marginLeft: 4
  },
  expandButtonContainer: {
    position: 'absolute',
    bottom: 6,
    justifyContent: 'center',
    alignItems: 'center',
    left: '50%'
  },
  expandButton: {
    position: 'absolute',
  }
});

export default styles;
