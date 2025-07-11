import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    paddingLeft: 8,
    marginLeft: -28,
    marginRight: -20,
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'flex-start',
    zIndex: 100,
  },
  graphContainer: {
    width: '100%',
    height: 155,
  },
  nestedContainerBox: {
    padding: 0,
  },
  selectWindowButtons: {
    flexDirection: 'row',
  },
  balanceData: {
    alignItems: 'baseline',
    marginTop: -2,
    flexDirection: 'row',
    gap: 8,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 2,
    marginTop: -2,
  },
  trendIcon: {
    marginLeft: 2,
  },
  chartHeader: {
    marginTop: 12,
    marginHorizontal: 28,
  },
  tooltipText: {
    position: 'absolute',
    top: -8,
  },
  menuButtonContainer: {
    position: 'absolute',
    top: 12,
    right: 24,
    zIndex: 10,
  },
  blurViewContainer: {
    zIndex: 10,
    borderRadius: 12,
  },
});

export default styles;
