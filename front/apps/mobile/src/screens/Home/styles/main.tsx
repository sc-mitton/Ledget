import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  headerheaderRight: {
    position: 'absolute',
    right: 16,
    top: 4,
    zIndex: 10
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 10,
    flex: 1,
    height: '100%'
  },
  overlay: {
    position: 'absolute',
    zIndex: 100
  },
  headerLeft: {
    position: 'absolute',
    left: 12
  },
  mask: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    left: 0,
    right: 0,
    height: 28,
    transform: [{ translateY: 28 }]
  }
});

export default styles;
