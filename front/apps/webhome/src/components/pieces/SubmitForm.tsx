import { FC, HTMLAttributes } from 'react'

import { SecondaryButton, GreenSubmitButton } from '@ledget/ui'

interface I {
    submitting: boolean
    text?: string
    success?: boolean
    onCancel: () => void
}

const SubmitForm: React.FC<I & HTMLAttributes<HTMLButtonElement>>
    = ({ submitting, text, success, onCancel, ...submitProps }: I) => {

        const styles = {
            display: 'flex',
            justifyContent: 'end',
            position: 'relative',
            zIndex: '0'
        } as React.CSSProperties

        return (
            <div style={styles}>
                <SecondaryButton
                    type="button"
                    onClick={onCancel}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            onCancel()
                        }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label="Cancel"
                    aria-roledescription="button"
                    style={{ cursor: 'pointer', borderRadius: '8px' }}
                >
                    Cancel
                </SecondaryButton>
                <GreenSubmitButton success={success} submitting={submitting} {...submitProps}>
                    {text ? `${text}` : 'Save'}
                </GreenSubmitButton>
            </div >
        )
    }

export default SubmitForm
