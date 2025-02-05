import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  yearsScrollView: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    justifyContent: 'flex-start',
  },
  historyBox: {
    flexDirection: 'column',
  },
  clockIcon: {
    marginRight: 5,
  },
  gridContainer: {
    minWidth: '100%',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    maxWidth: '100%',
  },
  monthCell: {
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 6,
    marginVertical: 8,
    flexDirection: 'row',
  },
});

export default styles;
