import { StyleSheet } from "react-native";

export default StyleSheet.create({
  scrollView: {
    paddingTop: 16,
    paddingRight: 8
  },
  row: {
    alignItems: 'center',
  },
  touchableTransacton: {
    width: '100%',
  },
  transaction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  logoContainer: {
    marginLeft: 8,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  leftColumn: {
    gap: 2
  },
  leftColumnBottomRow: {
    flexDirection: 'row',
    gap: 4
  },
  emojis: {
    flexDirection: 'row',
    gap: 2
  },
  dateColumn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 12
  },
  seperatorContainer: {
    width: '100%',
    paddingLeft: 44
  }
});
