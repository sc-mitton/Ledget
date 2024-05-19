import { useEffect } from 'react'

import { useNavigate } from 'react-router-dom'
import CheckCircle from '@geist-ui/icons/checkCircle'
import { Plus } from '@geist-ui/icons'

import './styles/Welcome.scss'
import './styles/Main.css'
import { useBakedPlaidLink } from '@utils/hooks'
import { useGetPlaidItemsQuery, PlaidItem } from '@features/plaidSlice'
import { useGetMeQuery } from '@features/userSlice'
import { useTransactionsSyncMutation } from '@features/transactionsSlice'
import {
    ExpandableContainer,
    LoadingRing,
    BlackPrimaryButtonWithArrow,
    Base64Logo,
    useLoaded,
    BluePrimaryButton,
    Tooltip
} from '@ledget/ui'

const InstitutionLogos = ({ plaidItems }: { plaidItems: PlaidItem[] }) => {
    const { data: user } = useGetMeQuery()
    const { isLoading } = useGetPlaidItemsQuery({ userId: user?.id })

    return (
        <>
            {plaidItems.length > 0 &&
                <>
                    <h4 className="spaced-header2">Connected Institutions</h4>
                    <div id="institution-logos">
                        {plaidItems.map((item, index) => (
                            <div
                                key={item.id}
                                className="institution-logo"
                                style={{
                                    marginLeft: index === 0 ? '0' : '-.5rem',
                                    zIndex: index
                                }}
                            >
                                <Tooltip msg={item.institution.name}>
                                    <Base64Logo
                                        size="1.5em"
                                        data={item.institution.logo}
                                        alt={item.institution.name.charAt(0).toUpperCase()}
                                        backgroundColor={item.institution.primary_color}
                                    />
                                </Tooltip>
                            </div>
                        ))}
                        <div style={{ marginLeft: '1em' }}>
                            <LoadingRing visible={isLoading} />
                        </div>
                    </div>
                </>
            }
        </>
    )
}

const BottomButtons = ({ continueDisabled }: { continueDisabled: boolean }) => {
    const { open } = useBakedPlaidLink({ onBoarding: true })
    const navigate = useNavigate()

    return (
        <div className="btn-container-enabled">
            <BluePrimaryButton
                onClick={() => open()}
                aria-label="Link Account"
                style={{ gap: '.5em' }}
            >
                Add Account
                <Plus size={'1em'} />
            </BluePrimaryButton>
            <ExpandableContainer expanded={!continueDisabled}>
                <BlackPrimaryButtonWithArrow
                    aria-label="Next"
                    onClick={() => navigate('/welcome/add-bills')}
                    disabled={continueDisabled}
                >
                    Continue
                </BlackPrimaryButtonWithArrow>
            </ExpandableContainer>
        </div>
    )
}

const SecurityMessage = () => (
    <div className="checklist">
        <div>
            <div><CheckCircle className='icon' /></div>
            <div>
                Ledget doesn't store your credentials
            </div>
        </div>
        <div>
            <div><CheckCircle className='icon' /></div>
            <div>
                We use Plaid to connect to your financial institutions
            </div>
        </div>
        <div>
            <div><CheckCircle className='icon' /></div>
            <div>
                Disconnect your account and your financial data at any time
            </div>
        </div>
    </div>
)

const WelcomeConnect = () => {
    const [syncTransactions] = useTransactionsSyncMutation()
    const { data: user } = useGetMeQuery()
    const {
        data: plaidItems,
        isSuccess: fetchedPlaidItemsSuccess
    } = useGetPlaidItemsQuery({ userId: user?.id })
    const loaded = useLoaded(0, fetchedPlaidItemsSuccess)

    // We should only sync when there's been a new plaid item added
    // after the initial load
    useEffect(() => {
        if (plaidItems?.length && plaidItems?.length > 0 && loaded) {
            setTimeout(() => {
                syncTransactions({ item: plaidItems[plaidItems.length - 1].id })
            }, 4000)
        }
    }, [plaidItems])

    return (
        <div id="welcome-connect">
            <h2 className="spaced-header">Welcome to Ledget!</h2>
            <div>
                <span>Let's get started by connecting your financial accounts.</span>
                <SecurityMessage />
                {fetchedPlaidItemsSuccess && <InstitutionLogos plaidItems={plaidItems} />}
            </div>
            <BottomButtons continueDisabled={false} />
        </div>
    )
}

export default WelcomeConnect
