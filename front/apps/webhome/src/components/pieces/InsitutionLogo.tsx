import { useGetPlaidItemsQuery } from '@features/plaidSlice'
import { Base64Logo } from '@ledget/ui'


const Logo = ({ accountId }: { accountId: string }) => {
    const { data } = useGetPlaidItemsQuery()

    const item = data?.find(item => item.accounts.find(account => account.id === accountId))

    const args = {
        data: item?.institution.logo,
        alt: item ? `${item.institution.name.charAt(0).toUpperCase()}` : ' ',
        ...(!item ? { backgroundColor: '#e0e0e0' } : {})
    }

    return (
        <Base64Logo {...args} />
    )
}

export default Logo
