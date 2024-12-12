import { StyleSheet } from "react-native";

export default StyleSheet.create({
  transactionsContainer: {
    padding: 0,
    marginTop: 8,
    position: 'relative',
    zIndex: 1
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
    minHeight: '100%',
    paddingTop: 16,
    marginHorizontal: -16
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    zIndex: 1,
    position: 'relative',
  },
  emptyBoxGraphic: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  overlayView: {
    zIndex: 199
  },
  overlayContainer: {
    transform: [{ translateY: -24 }],
    marginHorizontal: -16,
  },
  overlay: {
    opacity: 0.6
  },
  mask: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    left: 0,
    right: 0,
    height: 28,
    zIndex: 0
  }
});
