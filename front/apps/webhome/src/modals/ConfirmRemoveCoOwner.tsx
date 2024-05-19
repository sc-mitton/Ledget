
import { useGetCoOwnerQuery, useDelteCoOwnerMutation } from '@features/userSlice'
import { withSmallModal, SecondaryButton, BlueSubmitButton } from '@ledget/ui'
import { withReAuth } from '@utils/withReAuth'
import { useEffect } from 'react'



export const ConfirmRemoveCoOwner = withReAuth(withSmallModal((props) => {
    const { data } = useGetCoOwnerQuery()
    const [deleteCoOwner, { isLoading, isSuccess }] = useDelteCoOwnerMutation()

    useEffect(() => {
        if (isSuccess) {
            const timeout = setTimeout(() => {
                props.closeModal()
            }, 1000)
            return () => clearTimeout(timeout)
        }
    }, [isSuccess])

    return (
        <div>
            <h2>Are You Sure?</h2>
            <p>
                Are you sure you want to remove <strong>{`${data?.name.first} ${data?.name.last}`}</strong> from the account?
                All of their account and user data will be deleted and no longer visible on this account.
            </p>

            <div id="confirm-modal-bottom-btns">
                <SecondaryButton
                    onClick={() => { props.closeModal() }}
                    aria-label="Cancel"
                >
                    Cancel
                </SecondaryButton>
                <BlueSubmitButton
                    onClick={() => { deleteCoOwner() }}
                    submitting={isLoading}
                    success={isSuccess}
                    aria-label="Confirm"
                >
                    Yes
                </BlueSubmitButton>
            </div>
        </div>
    )
}))

export default ConfirmRemoveCoOwner
