import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  legend: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    paddingHorizontal: 8,
    marginTop: 8,
    zIndex: -1,
  },
  transactionsHeader: {
    flexGrow: 1,
  },
});

export default styles;
