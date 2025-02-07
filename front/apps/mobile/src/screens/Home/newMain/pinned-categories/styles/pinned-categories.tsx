import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  circles: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  addButtonContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeletonCircles: {
    flexDirection: 'row',
    flex: 1,
  },
});

export default styles;
