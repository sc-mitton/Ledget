import { Fragment, forwardRef } from 'react'

import { TransactionShimmer } from '@ledget/ui'

const Skeleton = forwardRef<HTMLDivElement>((_, ref) => {
    return (
        <>
            {ref && (typeof ref !== 'function') && Array(ref.current ? Math.round(ref.current?.offsetHeight / 70) : 0)
                .fill(0)
                .map((_, index) =>
                    <Fragment key={`transaction-${index}`}>
                        <div />
                        <TransactionShimmer
                            key={index}
                            shimmering={true}
                        />
                    </Fragment>
                )}
        </>
    )
})

export default Skeleton
