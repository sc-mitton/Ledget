import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginVertical: 12
  },
  transactionsList: {
    gap: 18,
    padding: 0
  },
  emptyListMessage: {
    width: '100%',
    alignItems: 'center',
  },
  chartContainer: {
    height: '20%',
    width: '100%',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountContainer: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  }
});

export default styles;
