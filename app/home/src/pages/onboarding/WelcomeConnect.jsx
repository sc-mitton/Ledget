import React, { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import './styles/Welcome.css'
import './styles/Main.css'
import Plus from '@assets/icons/Plus'
import Arrow from '@assets/icons/Arrow'
import Checkmark3 from '@assets/icons/Checkmark3'
import { usePlaidLink } from '@utils/hooks'
import { useGetPlaidItemsQuery } from '@api/apiSlice'
import { Base64Logo } from '@components/pieces'

const InstitutionLogos = ({ plaidItems }) => {

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
                                }}
                            >
                                <Base64Logo
                                    data={item.institution.logo}
                                    item={item}
                                    alt={item.institution.name}
                                    color={item.institution.primary_color}
                                    style={{
                                        width: '2rem',
                                        height: '2rem',
                                        padding: '0',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: 'var(--button-drop-shadow)'
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </>
            }
        </>
    )
}

const BottomButtons = ({ continueDisabled }) => {
    const { open, exit, error } = usePlaidLink()
    const navigate = useNavigate()

    return (
        <div className="btn-container-enabled">
            <button
                className="btn-grn btn3"
                id="connect-account-btn"
                onClick={open}
                aria-label="Link Account"
            >
                <span>
                    Add Account
                </span>
                <Plus width={'1em'} height={'1em'} />
            </button>
            <button
                className={`btn-chcl btn3
                ${continueDisabled ? 'disabled' : 'enabled'}`}
                id="connect-account-btn"
                aria-label="Next"
                onClick={() => navigate('/welcome/add-categories')}
                disabled={continueDisabled}
            >
                Continue
                <Arrow
                    width={'.8em'}
                    height={'.8em'}
                    rotation={-90}
                    stroke={'var(--window)'}
                />
            </button>
        </div>
    )
}

const WelcomeConnect = () => {
    const { data: plaidItems, isLoading } = useGetPlaidItemsQuery()
    const [continueDisabled, setContinueDisabled] = useState(true)

    useEffect(() => {
        if (plaidItems?.length > 0) {
            setContinueDisabled(false)
        }
    }, [plaidItems])

    return (
        <div className="window3">
            <h1 className="spaced-header">Welcome to Ledget!</h1>
            <div>
                <h4 className="spaced-header2">Let's get started by connecting your financial accounts.</h4>
                <div className="checklist">
                    <div>
                        <div><Checkmark3 /></div>
                        <div>
                            Ledget doesn't store your credentials
                        </div>
                    </div>
                    <div>
                        <div><Checkmark3 /></div>
                        <div>
                            We use Plaid to connect to your financial institutions
                        </div>
                    </div>
                    <div>
                        <div><Checkmark3 /></div>
                        <div>
                            Disconnect your account and your financial data at any time
                        </div>
                    </div>
                </div>
                {!isLoading && <InstitutionLogos plaidItems={plaidItems} />}
            </div>
            <BottomButtons continueDisabled={continueDisabled} />
        </div>
    )
}

export default WelcomeConnect
