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
    gap: 32,
    marginLeft: 8,
    flex: 2,
  },
  button: {
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    marginRight: 12,
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
    maxHeight: '60%'
  },
  accounts: {
    paddingHorizontal: 8,
    flexDirection: 'row',
    width: '100%'
  },
  nameColumn: {
    flex: 1,
    flexGrow: 1
  },
  maskColumn: {
  },
  cell: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  typeCell: {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 4,
  },
  maskCell: {
    paddingHorizontal: 24
  },
  icon: {
    marginRight: 8
  }
});
