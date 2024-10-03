import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    marginTop: 32,
    paddingLeft: 8,
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  graphContainer: {
    width: '100%',
    height: 150
  },
  nestedContainerBox: {
    padding: 0
  },
  selectWindowButtons: {
    flexDirection: 'row',
  },
  balanceData: {
    alignItems: 'baseline',
    marginTop: -2,
    marginBottom: 8,
    flexDirection: 'row',
    gap: 8
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 2,
    marginTop: -2
  },
  trendIcon: {
    marginLeft: 2
  },
  chartHeader: {
  },
  tooltipText: {
    position: 'absolute',
    top: -8
  },
  menuButtonContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
  },
  menuButton: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurViewContainer: {
    zIndex: 10,
    borderRadius: 12
  }
});

export default styles;
