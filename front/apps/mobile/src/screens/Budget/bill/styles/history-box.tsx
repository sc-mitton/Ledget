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
  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  monthCell: {
    width: '25%',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 6,
    marginVertical: 8,
    flexDirection: 'row',
  }
});

export default styles;
