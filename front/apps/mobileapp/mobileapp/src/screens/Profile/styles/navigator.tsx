import { StyleSheet } from "react-native";

export default StyleSheet.create({
  draggableArea: {
    flex: 1,
    marginTop: 24,
    position: 'relative',
  },
  tabBar: {
    flexDirection: 'row',
    gap: 24,
    marginHorizontal: 26,
  },
  tabItem: {
    width: 'auto',
    alignItems: 'center',
  },
  label: {
    opacity: 1,
    textTransform: 'none',
    zIndex: 1,
    position: 'relative',
  },
  tabNavPillContainer: {
    position: 'absolute',
    zIndex: -1,
  },
  tabNavPill: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  }
});
