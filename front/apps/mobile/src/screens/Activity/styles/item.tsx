import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    position: 'relative',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  leftColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 1
  },
  rightColumn: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 8
  },
  leftCheckContainer: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -10 }]
  },
  rightCheckContainer: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -10 }]
  },
  transactionInfo: {
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  transactionName: {
    flexWrap: 'wrap',
    flexShrink: 1,
    fontSize: 14
  }
});
