import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  list: {
    gap: 12,
    marginTop: 6,
    alignItems: 'center'
  },
  rows: {
    width: '100%',
  },
  rowsWithOverflow: {
    marginBottom: 24,
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
    alignItems: 'center',
    marginVertical: 12
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
