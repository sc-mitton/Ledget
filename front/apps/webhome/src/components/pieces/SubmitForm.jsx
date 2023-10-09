
import { SecondaryButton, GreenSubmitButton } from '@ledget/shared-ui'

const SubmitForm = ({ submitting, success, onCancel, ...submitProps }) => {

    const styles = {
        display: 'flex',
        justifyContent: 'end',
        position: 'relative',
        zIndex: '0'
    }

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
                {'Save'}
            </GreenSubmitButton>
        </div >
    )
}

export default SubmitForm
