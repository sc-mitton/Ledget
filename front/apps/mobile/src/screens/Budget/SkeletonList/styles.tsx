import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  skeletonContainer: {
    gap: 20,
    marginTop: 24,
  },
  bonesContainer: {
    flexDirection: 'row',
    height: 16,
    paddingHorizontal: 4,
    justifyContent: 'space-between',
  },
  leftBone: {
    width: '50%',
    height: '100%',
    borderRadius: 6
  },
  rightBone: {
    width: '20%',
    height: '100%',
    borderRadius: 6
  },
});

export default styles;
