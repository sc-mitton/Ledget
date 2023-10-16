import { FC, HTMLProps, useRef } from 'react'

import { AnimatePresence } from 'framer-motion'

import {
    DollarCents,
    ShimmerDiv,
    ShimmerText,
    FadeInOutDiv
} from '@ledget/ui'

export const SkeletonWafers = () => (
    <div className="account-wafers--container">
        <div>
            <span>Total Deposits</span>
            <span>
                <DollarCents value="0" />
            </span>
        </div>
        <div className="shimmering-account-wafers">
            {Array(4).fill(0).map((_, index) => (
                <ShimmerDiv
                    key={index}
                    className="shimmering-account-wafer"
                    shimmering={true}
                    background="var(--inner-window-solid)"
                />
            ))}
        </div>
    </div>
)

export const TransactionsHeader = () => (
    <div className="transactions--header">
        <div>Name</div>
        <div>Amount</div>
    </div>
)

export const TransactionShimmer = ({ shimmering = true }) => (
    <>
        <div />
        <div className="transaction-shimmer">
            <div>
                <ShimmerText shimmering={shimmering} length={25} />
                <ShimmerText shimmering={shimmering} length={10} />
            </div>
            <div>
                <ShimmerText shimmering={shimmering} length={10} />
            </div>
        </div>
    </>
)

export const TransactionsTable: FC<HTMLProps<HTMLDivElement> & { skeleton: boolean, shimmering: boolean }>
    = ({ children, skeleton, shimmering, className, ...rest }) => {
        const containerRef = useRef<HTMLDivElement>(null)

        return (
            <div className={`transactions--container ${className}`} ref={containerRef}>
                <AnimatePresence mode="wait">
                    {skeleton
                        ? <FadeInOutDiv className='transactions--table' {...rest}>
                            <TransactionsHeader />
                            {Array(containerRef.current ? Math.round(containerRef.current?.offsetHeight / 70) : 0)
                                .fill(0)
                                .map((_, index) => <TransactionShimmer key={index} shimmering={shimmering} />)}
                        </FadeInOutDiv>
                        : <FadeInOutDiv className={`transactions--table ${className}`} {...rest}>
                            {children}
                        </FadeInOutDiv>
                    }
                </AnimatePresence>
            </div>
        )
    }
