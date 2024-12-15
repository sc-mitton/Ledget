import { StyleSheet } from "react-native";

export default StyleSheet.create({
  boxContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  },
  mainBackgroundBox: {
    paddingHorizontal: 16,
    borderTopEndRadius: 16,
    borderTopStartRadius: 16,
  },
  box: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  dragBar: {
    width: 40,
    height: 5,
    position: 'absolute',
    top: 8,
    left: '50%',
    transform: [
      { translateX: -18 },
      { translateY: -1.5 }
    ]
  },
  dragBarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 24,
  },
  transactionsScrollView: {
    paddingRight: 20,
    paddingLeft: 60,
    paddingTop: 4,
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
    marginVertical: 10,
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
    gap: 0,
  },
  rightColumn: {
    flexGrow: 1,
    marginTop: 2,
    alignItems: 'flex-end',
  }
});
