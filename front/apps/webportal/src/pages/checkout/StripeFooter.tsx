import styles from './styles/stripe.module.scss'

import { useScreenContext } from '@ledget/ui'
import { StripeLogo } from '@ledget/media'

const StripeFooter = () => {
    const { screenSize } = useScreenContext()

    return (
        <>
            {screenSize !== 'extra-small' &&
                <div className={styles.stripeLogoContainer}>
                    <div>powered by</div>
                    <div>
                        <a href="https://stripe.com/" target="_blank" rel="noopener noreferrer">
                            <StripeLogo />
                        </a>
                    </div>
                </div>}
        </>
    )
}

export default StripeFooter
