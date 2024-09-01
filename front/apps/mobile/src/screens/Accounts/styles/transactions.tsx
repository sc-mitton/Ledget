import { StyleSheet } from "react-native";

export default StyleSheet.create({
  boxContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 0
  },
  box: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
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
    gap: 8
  },
  skeletonContainer: {
    overflow: 'hidden',
    flexGrow: 1,
    paddingHorizontal: 20,
    marginHorizontal: 4,
  },
  transactionsScrollView: {
    flex: 1,
    flexGrow: 1,
    flexShrink: 0,
    paddingRight: 20,
    marginRight: 4,
  },
  dateScrollView: {
    flex: 0,
    flexShrink: 1,
    paddingLeft: 12,
    marginLeft: 1,
    marginRight: 4
  },
  dateScrollViewRow: {
    alignItems: 'flex-start',
    marginVertical: 1,
    width: '100%'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
    alignItems: 'center',
  },
  hiddenRow: {
    width: 0,
    opacity: 0,
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
    top: 0,
    left: 0,
    right: 0,
    paddingRight: 2
  },
  rightColumn: {
    flexGrow: 1,
    alignItems: 'flex-end',
  },
  seperator: {
    opacity: .7
  }
});
