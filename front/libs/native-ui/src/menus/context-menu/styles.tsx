import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    position: 'relative'
  },
  menuContainer: {
    position: 'absolute',
    bottom: '-105%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    position: 'absolute',
    borderRadius: 12,
    transformOrigin: 'top center',
  },
  menuOptions: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 12,
    position: 'relative',
  },
  menuBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    opacity: 0.9,
    borderRadius: 12,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 16,
  },
  icon: {
    minWidth: 28,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    flexGrow: 1,
  }
});
