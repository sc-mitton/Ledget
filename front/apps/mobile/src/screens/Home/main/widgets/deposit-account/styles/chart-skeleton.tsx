import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  chartContainer: {
    flexGrow: 2,
    paddingBottom: 8,
    marginHorizontal: -13
  },
  fontStyle: {
    fontFamily: 'SourceSans3Regular',
    fontSize: 16,
    transform: [{ translateX: 3 }]
  },
  tipContainer: {
    left: '50%',
    top: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 100
  },
  tip: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default styles;
