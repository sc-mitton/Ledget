import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%'
  },
  topRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6
  },
  bottomRow: {
    marginTop: 12,
    marginBottom: 4,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  skeletonBarsBox: {
    height: 75,
    marginVertical: 8,
    marginHorizontal: 3
  }
});

export default styles;
