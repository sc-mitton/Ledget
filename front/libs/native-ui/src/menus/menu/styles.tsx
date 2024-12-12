import { StyleSheet } from "react-native";

export const placementStyles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    flexDirection: 'row'
  },
  left: {
    justifyContent: 'flex-start',
    flexDirection: 'row'
  },
  right: {
    justifyContent: 'flex-end',
    flexDirection: 'row'
  }
});

export const menuPlacementStyles = StyleSheet.create({
  center: {
    transformOrigin: 'top center',
  },
  left: {
    transformOrigin: 'top left',
  },
  right: {
    transformOrigin: 'top right',
  }
})

export default StyleSheet.create({
  container: {
    position: 'relative'
  },
  menuContainer: {
    position: 'absolute',
    bottom: -12,
    width: '100%',
  },
  menu: {
    position: 'absolute',
    borderRadius: 10,
  },
  menuClipper: {
    overflow: 'hidden',
    borderRadius: 10,
  },
  menuOptions: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    borderRadius: 10,
    position: 'relative'
  },
  menuBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    opacity: 0,
    borderRadius: 10
  },
  rowContainer: {
    flex: 1,
  },
  rowBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: -1,
    opacity: .7
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 20
  },
  icon: {
    minWidth: 28,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    flexGrow: 1,
  },
  seperator: {
    width: '120%'
  }
});
