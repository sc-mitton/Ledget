import { Fragment, forwardRef } from 'react';

import { TextSkeletonDiv } from '@ledget/ui';

const Skeleton = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <>
      {ref &&
        typeof ref !== 'function' &&
        Array(ref.current ? Math.round(ref.current?.offsetHeight / 70) : 0)
          .fill(0)
          .map((_, index) => (
            <Fragment key={`transaction-${index}`}>
              <div />
              <div>
                <div>
                  <TextSkeletonDiv isSkeleton={true} length={32} />
                  <TextSkeletonDiv isSkeleton={true} length={16} />
                </div>
                <div>
                  <TextSkeletonDiv isSkeleton={true} length={12} />
                </div>
              </div>
            </Fragment>
          ))}
    </>
  );
});

export default Skeleton;
