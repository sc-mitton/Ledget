import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    height: 36,
    position: 'relative',
    zIndex: 10,
  },
  tabsContent: {
    alignItems: 'center',
  },
  tabButton: {
    marginHorizontal: 8,
  },
  buttonIcon: {
    marginRight: 8
  }
});

export default styles;
