import { StyleSheet } from "react-native";

export default StyleSheet.create({
  screen: {
    flex: 1,
  },
  buttons: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 8,
    marginLeft: 8,
    flex: 2,
  },
  button: {
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 4,
    flex: 1,
  },
  accountsBox: {
    marginTop: 12,
  },
  accounts: {
    paddingHorizontal: 8,
    flexDirection: 'row',
    maxHeight: '60%'
  },
  maskColumn: {
    flex: 1,
  },
  cell: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  typeCell: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingRight: 4,
  },
  maskCell: {
    paddingHorizontal: 24,
  }
});
