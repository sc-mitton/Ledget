import { StyleSheet } from "react-native";

export default StyleSheet.create({
  transactionsContainer: {
    padding: 0,
    marginTop: 8,
    paddingBottom: 16,
    position: 'relative',
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
    zIndex: 1,
  },
  checkAllButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    bottom: 24,
    gap: 8
  },
  scrollView: {
    position: 'relative',
    width: '100%',
    minHeight: '100%',
    marginBottom: -32,
    paddingTop: 16
  },
  scrollViewContent: {
    zIndex: 1,
    position: 'relative',
  },
  emptyBoxGraphic: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: 48
  },
  overlay: {
    zIndex: 1,
    opacity: 0.8
  }
});
