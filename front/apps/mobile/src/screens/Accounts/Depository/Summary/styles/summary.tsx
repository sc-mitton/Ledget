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
    right: 4,
    zIndex: 10,
  },
  blurViewContainer: {
    zIndex: 10,
    borderRadius: 12
  }
});

export default styles;
