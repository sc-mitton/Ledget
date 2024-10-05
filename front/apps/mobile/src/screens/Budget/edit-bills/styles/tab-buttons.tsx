import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  tabButtonsBox: {
    width: '75%',
    marginVertical: 8,
  },
  tabButtons: {
    gap: 8,
    paddingVertical: 2,
    flexDirection: 'row',
  },
  tabButton: {
    flex: 1,
    flexGrow: 1,
    zIndex: 1,
    alignItems: 'center'
  },
  animatedTabBack: {
    position: 'absolute',
    width: '33%',
    top: 0,
    bottom: 0,
  },
  tabBack: {
    width: '100%',
    height: '100%',
    zIndex: 0,
  }
});

export default styles;
