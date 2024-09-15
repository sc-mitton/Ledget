import { StyleSheet } from "react-native";

export default StyleSheet.create({
  animatedView: {
    flex: 1,
  },
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
    marginTop: 32,
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
    marginTop: 32,
    flexGrow: 1,
    minHeight: '100%',
    position: 'relative'
  },
  formHeader: {
    marginTop: 12,
    position: 'absolute',
    left: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIcon: {
    position: 'absolute',
  },
  accountOption: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginTop: 12
  }
});
