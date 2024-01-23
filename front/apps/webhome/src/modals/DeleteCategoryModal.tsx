
import { withSmallModal } from '@ledget/ui'
import { Category, useRemoveCategoriesMutation } from '@features/categorySlice'
import { SubmitForm } from '@components/pieces'
import { useEffect } from 'react'

const Modal = withSmallModal<{ category: Category }>((props) => {
    const [deleteCategory, { isSuccess, isLoading }] = useRemoveCategoriesMutation()

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
            <h3>Are You Sure?</h3>
            <div style={{ color: 'var(--m-text-secondary)', margin: '1em 0 1.5em 0' }}>
                All data for this category will be deleted for the month,
                and the category will be removed.
            </div>
            <SubmitForm
                onClick={() => { deleteCategory([props.category.id]) }}
                submitting={isLoading}
                success={isSuccess}
                onCancel={() => props.closeModal()}
            />
        </div>
    )
})

export default Modal
