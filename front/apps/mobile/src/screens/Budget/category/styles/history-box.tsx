import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  historyBoxContainer: {
    flex: 2,
    flexGrow: 2
  },
  transactionsList: {
    gap: 18,
    padding: 0
  },
  transactionsListBox: {
    flex: 1,
    flexGrow: 1,
  },
  amountContainer: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  clockIcon: {
    marginRight: 5,
  },
  emptyListMessage: {
    width: '100%',
    transform: [{ translateX: 16 }],
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default styles;
