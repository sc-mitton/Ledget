import { ShimmerText } from '@ledget/ui';

const SkeletonBills = () => (
  <div
    className="bills-box"
    style={{ '--number-of-bills': 4 } as React.CSSProperties}
  >
    <>
      {Array.from(Array(8).keys()).map((i) => (
        <ShimmerText
          key={i}
          shimmering={true}
          style={{ width: '100', height: '1.25em' }}
        />
      ))}
    </>
  </div>
);

export default SkeletonBills;
