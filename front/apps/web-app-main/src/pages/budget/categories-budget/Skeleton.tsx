import { ColoredPulse } from '@ledget/ui';

const SkeletonCategories = ({
  length,
  period,
}: {
  length: number;
  period: 'month' | 'year';
}) => (
  <>
    {Array.from({ length: length }).map((_, i) => (
      <ColoredPulse color={period === 'month' ? 'blue' : 'green'} />
    ))}
  </>
);

export default SkeletonCategories;
