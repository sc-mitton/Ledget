import { StyleSheet } from "react-native";

export default StyleSheet.create({
  transactionsContainer: {
    padding: 0,
    marginTop: 8,
  },
  transactionItem: {
    width: '100%',
    paddingHorizontal: 8,
    position: 'absolute',
  },
  checkAllButtonContainer: {
    position: 'absolute',
    bottom: 16,
    left: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkAllButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8
  },
  scrollView: {
    position: 'relative',
    width: '100%',
    minHeight: '100%',
    marginBottom: -32
  }
});
