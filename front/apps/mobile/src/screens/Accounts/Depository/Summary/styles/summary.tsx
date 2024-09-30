import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    marginTop: 24,
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginHorizontal: 24
  },
  graphContainer: {
    width: '100%',
    height: 130
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
    gap: 6,
  },
  tooltipText: {
    position: 'absolute',
    top: -8
  },
  menuButtonContainer: {
    position: 'absolute',
    top: 8,
    right: 2,
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
