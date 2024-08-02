import { StyleSheet } from "react-native";

export default StyleSheet.create({
  row: {
    gap: 2,
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  container: {
    gap: 10,
    flexDirection: 'column',
    alignItems: 'flex-start',
  }
})
