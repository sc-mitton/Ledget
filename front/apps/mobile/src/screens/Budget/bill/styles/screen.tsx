import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  screen: {
    gap: 12,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginVertical: 12
  },
  transactionsListBox: {
    flex: 1,
  },
  emptyListBox: {
    maxHeight: '30%'
  },
  transactionsList: {
    gap: 18,
    padding: 0
  },
  emptyListMessage: {
    width: '100%',
    transform: [{ translateX: 16 }],
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
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
