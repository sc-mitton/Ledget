import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    height: 40,
    position: 'relative',
    zIndex: 10,
  },
  tabsContent: {
    alignItems: 'flex-start',
  },
  tabButton: {
    marginHorizontal: 6,
  },
  buttonIcon: {
    marginRight: 8
  },
  seperator: {
    width: '200%',
    left: -200,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default styles;
