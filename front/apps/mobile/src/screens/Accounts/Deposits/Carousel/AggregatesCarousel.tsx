import { TabsNavigator } from '@ledget/native-ui';
import Summary from './Summary';
import Graph from './Graph';

const AggregatesCarousel = () => {
  return (
    <TabsNavigator tabs={{ summary: Summary, graph: Graph }}>
      <TabsNavigator.Panels />
    </TabsNavigator>
  );
};

export default AggregatesCarousel;
