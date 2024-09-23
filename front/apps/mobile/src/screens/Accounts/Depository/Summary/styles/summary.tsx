import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    marginTop: 32,
    height: 190,
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingBottom: 32,
    marginHorizontal: 16
  },
  graphContainer: {
    position: 'absolute',
    top: 54,
    left: -28,
    right: 0,
    bottom: 0
  },
  nestedContainerBox: {
    padding: 0
  },
  selectWindowButtons: {
    flexDirection: 'row',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 2
  },
  trendIcon: {
    marginLeft: 4
  },
  chartHeader: {
    paddingLeft: 8,
  },
  headerTitle: {
    flexDirection: 'row',
    gap: 8,
  },
  tooltipText: {
    position: 'absolute',
    top: -8
  },
  menuButtonContainer: {
    position: 'absolute',
    top: 4,
    right: 4,
    zIndex: 10,
  },
  menuButton: {
    paddingHorizontal: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurViewContainer: {
    zIndex: 10,
    borderRadius: 12,
    overflow: 'hidden',
  }
});

export default styles;
