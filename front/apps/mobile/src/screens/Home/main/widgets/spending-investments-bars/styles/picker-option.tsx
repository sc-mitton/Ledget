import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    height: '100%',
  },
  topRow: {
    gap: 4,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  topRowHeade: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: -4
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 8,
  },
  currencyContainer: {
    marginBottom: -4
  },
  visualization: {
    flexGrow: 1,
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginLeft: -3
  },
  bottomRow: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateY: 6 }]
  },
  barsContainer: {
    height: '100%',
    paddingVertical: 8,
  },
  barsContainer0: {
    transform: [{ translateX: 0 }],
  },
  barsContainer1: {
    transform: [{ translateX: -24 }],
  },
  barsContainer2: {
    transform: [{ translateX: -48 }],
  },
  investedBar: {
    position: 'absolute',
    bottom: 0,
    width: 5,
    zIndex: 1,
    borderRadius: 4,
    height: '40%'
  },
  savedBar: {
    position: 'absolute',
    bottom: 0,
    width: 5,
    borderRadius: 4,
    zIndex: 2,
    height: '20%'
  },
  incomeBar: {
    position: 'absolute',
    bottom: 0,
    width: 5,
    borderRadius: 4,
    height: '100%'
  }
});

export default styles;
