import { StyleSheet } from "react-native";

export default StyleSheet.create({
  boxContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 0
  },
  box: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    height: '100%',
  },
  dragBar: {
    width: 64,
    height: 5,
    borderRadius: 5,
    position: 'absolute',
    top: 10,
    left: '50%',
    transform: [
      { translateX: -32 },
      { translateY: -1.5 }
    ]
  },
  dragBarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 34,
  },
  table: {
    flexDirection: 'row',
  },
  skeletonContainer: {
    overflow: 'hidden',
    flexGrow: 1,
    paddingHorizontal: 20,
    marginHorizontal: 4,
  },
  transactionsScrollView: {
    width: '82%',
    paddingRight: 20,
    marginRight: 4,
  },
  dateScrollView: {
    width: 30,
    paddingLeft: 12,
    marginLeft: 1,
    marginRight: 0
  },
  dateScrollViewRow: {
    alignItems: 'flex-start'
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
    alignItems: 'center',
  },
  hiddenRowContainer: {
    opacity: 0,
    width: 0,
  },
  hiddenRow: {
    marginVertical: 2,
    height: 'auto',
    gap: 2,
  },
  nameContainer: {
    gap: 4,
    alignItems: 'center',
    flexDirection: 'row',
  },
  leftColumn: {
    gap: 2,
  },
  dateContentContainer: {
    position: 'relative',
    width: 30
  },
  dateContent: {
    position: 'absolute',
    top: 2,
    left: 0,
    right: 0,
    paddingRight: 2
  },
  rightColumn: {
    flexGrow: 1,
    alignItems: 'flex-end',
  }
});
