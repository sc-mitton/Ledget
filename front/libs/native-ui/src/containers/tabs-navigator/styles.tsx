import { StyleSheet } from "react-native";

export default StyleSheet.create({
  screen: {
    flex: 1,
  },
  pagerView: {
    width: '100%',
    height: '100%',
  },
  tabBar: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 26,
    position: 'relative',
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
