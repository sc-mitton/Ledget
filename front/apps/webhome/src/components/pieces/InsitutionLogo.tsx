import { useGetPlaidItemsQuery } from '@ledget/shared-features';
import { Base64Logo, Tooltip } from '@ledget/ui';

export const InsitutionLogo = ({
  accountId,
  size
}: {
  accountId?: string;
  size?: string;
}) => {
  const { data } = useGetPlaidItemsQuery();

  const item = data?.find((item) =>
    item.accounts.find((account) => account.id === accountId)
  );

  const args = {
    size,
    data: item?.institution?.logo,
    alt: item ? `${item.institution?.name?.charAt(0).toUpperCase()}` : ' ',
    ...(!item ? { backgroundColor: '#e0e0e0' } : {})
  };

  return (
    <Tooltip msg={item?.institution?.name} type="right">
      <Base64Logo {...args} />
    </Tooltip>
  );
};

export default InsitutionLogo;
