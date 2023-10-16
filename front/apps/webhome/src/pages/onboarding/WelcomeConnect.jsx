import React, { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import './styles/Welcome.css'
import './styles/Main.css'
import { Plus, CheckMark3 } from '@ledget/media'
import { useBakedPlaidLink } from '@utils/hooks'
import { useGetPlaidItemsQuery } from '@features/plaidSlice'
import { useTransactionsSyncMutation } from '@features/transactionsSlice'
import { GrnPrimaryButton, ExpandableContainer, LoadingRing, BlackPrimaryButtonWithArrow, Base64Image } from '@ledget/ui'

const InstitutionLogos = ({ plaidItems }) => {
    const { isLoading } = useGetPlaidItemsQuery()

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
                                style={{ marginLeft: index === 0 ? '0' : '-.5rem' }}
                            >
                                <Base64Image
                                    data={item.institution.logo}
                                    alt={item.institution.name.charAt(0).toUpperCase()}
                                    backgroundColor={item.institution.primary_color}
                                />
                            </div>
                        ))}
                        <div style={{ marginLeft: '16px' }}>
                            <LoadingRing visible={isLoading} color="dark" />
                        </div>
                    </div>
                </>
            }
        </>
    )
}

const BottomButtons = ({ continueDisabled }) => {
    const { open } = useBakedPlaidLink({ onBoarding: true })
    const navigate = useNavigate()

    return (
        <div className="btn-container-enabled">
            <GrnPrimaryButton
                onClick={open}
                aria-label="Link Account"
                className="btn-icon-r"
            >
                <span>
                    Add Account
                </span>
                <Plus width={'.9em'} height={'.9em'} />
            </GrnPrimaryButton>
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
            <div><CheckMark3 /></div>
            <div>
                Ledget doesn't store your credentials
            </div>
        </div>
        <div>
            <div><CheckMark3 /></div>
            <div>
                We use Plaid to connect to your financial institutions
            </div>
        </div>
        <div>
            <div><CheckMark3 /></div>
            <div>
                Disconnect your account and your financial data at any time
            </div>
        </div>
    </div>
)

const WelcomeConnect = () => {
    const [syncTransactions] = useTransactionsSyncMutation()
    const {
        data: plaidItems,
        isSuccess: fetchedPlaidItemsSuccess
    } = useGetPlaidItemsQuery()
    const [continueDisabled, setContinueDisabled] = useState(true)
    const [loaded, setLoaded] = useState(false)

    // We should only sync when there's been a new plaid item added
    // after the initial load
    useEffect(() => {
        if (plaidItems?.length > 0 && loaded) {
            setTimeout(() => {
                syncTransactions(plaidItems[plaidItems.length - 1].id)
            }, 4000)
        }
    }, [plaidItems])

    useEffect(() => {
        if (plaidItems?.length > 0) {
            setContinueDisabled(false)
        }
    }, [plaidItems])

    useEffect(() => {
        if (fetchedPlaidItemsSuccess) {
            setLoaded(true)
        }
    }, [fetchedPlaidItemsSuccess])

    return (
        <div className="window3">
            <h1 className="spaced-header">Welcome to Ledget!</h1>
            <div>
                <h4 className="spaced-header2">Let's get started by connecting your financial accounts.</h4>
                <SecurityMessage />
                {fetchedPlaidItemsSuccess && <InstitutionLogos plaidItems={plaidItems} />}
            </div>
            <BottomButtons continueDisabled={continueDisabled} />
        </div>
    )
}

export default WelcomeConnect
