import { StyleSheet } from "react-native";

export default StyleSheet.create({
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16
  },
  androidContentSpacing: {
    padding: 18,
  },
  iosContentSpacing: {
    padding: 16,
  },
  leftColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 1
  },
  rightColumn: {
    position: 'absolute',
    right: 16,
    left: 0,
    top: 0,
    bottom: 0,
    paddingRight: 16,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  billCatLabelContainer: {
    position: 'absolute'
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 4
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
