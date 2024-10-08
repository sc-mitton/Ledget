import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  transactionsList: {
    gap: 18,
    padding: 0
  },
  transactionsListBox: {
    minHeight: 50,
    flexGrow: 1,
    marginTop: 12
  },
  amountContainer: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  emptyListMessage: {
    width: '100%',
    transform: [{ translateX: 16 }],
    alignItems: 'center',
    position: 'absolute'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clockIcon: {
    marginRight: 5,
    marginBottom: -2
  }
});

export default styles;
