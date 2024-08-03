import { StyleSheet } from "react-native";

export default StyleSheet.create({
  screen: {
    flex: 1,
  },
  pagerView: {
    width: '100%',
    height: '100%',
  },
  tabBarContainer: {
    position: 'relative',
    zIndex: 1,
  },
  seperatorContainer: {
    width: '95%',
    alignSelf: 'center',
  },
  absTabBar: {
    flexDirection: 'row',
    gap: 12,
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 3,
    marginHorizontal: 20,
  },
  tabBar: {
    flexDirection: 'row',
    gap: 12,
    position: 'relative',
    marginHorizontal: 20,
    marginBottom: 16
  },
  tabItem: {
    width: 'auto',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
  },
  tabNavPillContainer: {
    position: 'absolute',
    zIndex: 2,
  },
  tabNavPill: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    position: 'relative',
  }
});
