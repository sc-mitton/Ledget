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
    height: 24,
  },
  skeletonContainer: {
    overflow: 'hidden',
    flexGrow: 1,
    paddingHorizontal: 20,
    marginHorizontal: 4,
  },
  transactionsScrollView: {
    paddingRight: 20,
    paddingLeft: 64,
  },
  sectionHeader: {
    marginLeft: -48,
    justifyContent: 'center',
    left: 0,
    right: 0,
    position: 'relative',
    zIndex: -1,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
    alignItems: 'center'
  },
  nameContainer: {
    gap: 4,
    alignItems: 'center',
    flexDirection: 'row',
  },
  bottomRow: {
    flexDirection: 'row',
  },
  emojis: {
    gap: 6,
    marginLeft: 8,
    opacity: .7,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  leftColumn: {
    gap: 2,
  },
  rightColumn: {
    flexGrow: 1,
    alignItems: 'flex-end',
  }
});
