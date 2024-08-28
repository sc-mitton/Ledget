import { StyleSheet } from "react-native";

export default StyleSheet.create({
  scrollView: {
    paddingTop: 16,
    paddingRight: 8,
    marginBottom: -32
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
    paddingVertical: 8,
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
  },
  emptyBoxGraphic: {
    flex: 1,
    marginTop: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonContainer: {
    width: 'auto',
    flexDirection: 'row',
    paddingLeft: 6,
    marginBottom: 8,
    marginRight: 4,
    justifyContent: 'flex-end'
  },
  filterIcon: {
    marginRight: 8
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  splitInputs: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: 8,
  },
  scrollFilterFormWrapper: {
    flexGrow: 1,
    minHeight: '100%',
  },
  filtersForm: {
    marginTop: 16,
    flexGrow: 1,
    minHeight: '100%',
  },
  formHeader: {
    marginLeft: 4,
    maxWidth: '66%',
    marginBottom: 16,
    marginTop: 12
  }
});
