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
    height: '100%',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  pickerBackground: {
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
    height: 44,
    transform: [{ translateY: 44 }]
  },
  graphicContainer: {
    zIndex: 1,
    position: 'absolute',
    left: '50%',
    top: '50%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  graphic: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    width: 300,
    transform: [{ translateY: -75 }],
    gap: 12,
    alignItems: 'center'
  }
});

export default styles;
