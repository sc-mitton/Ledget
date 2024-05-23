
import { ShimmerDiv } from '@ledget/ui'

const SkeletonWafers = ({ count, width }: { count: number, width: number }) => (
    <div className="skeleton-wafers">
        {Array(count).fill(0).map((_, index) => (
            <div
                className="skeleton-account-wafer-container"
                style={{ width: `${width}px` }}
            >
                <ShimmerDiv
                    key={index}
                    className="skeleton-account-wafer"
                    shimmering={true}
                    background='var(--skeleton-wafer-background)'
                    shimmerColor='var(--skeleton-wafer-shimmer)'
                    style={{ position: 'absolute' }}
                />
            </div>
        ))}
    </div>
)

export default SkeletonWafers
