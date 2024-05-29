import { ColoredShimmer } from '@ledget/ui';

const SkeletonCategories = ({ length, period }: { length: number, period: 'month' | 'year' }) => (
    <>
        {Array.from({ length: length }).map((_, i) => (
            <ColoredShimmer className='category-shimmer' shimmering={true} color={period === 'month' ? 'blue' : 'green'} />
        ))}
    </>
)

export default SkeletonCategories;
