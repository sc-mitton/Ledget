import { StyleSheet } from "react-native";

export default StyleSheet.create({
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16
  },
  leftColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 1
  },
  rightColumn: {
    flexDirection: 'row',
    position: 'absolute',
    right: 16,
    top: '75%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  billCatLabelContainer: {
    position: 'absolute',
    alignItems: 'center'
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 8
  },
  leftCheckContainer: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: -1
  },
  rightCheckContainer: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: -1
  },
  transactionInfo: {
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  transactionName: {
    flexWrap: 'wrap',
    flexShrink: 1,
    fontSize: 14
  },
  newTransaction: {
    borderRadius: 16
  }
});
