import { useGetPlaidItemsQuery } from '@ledget/shared-features';
import { Base64Logo } from '@ledget/ui';

export const InstitutionLogo = ({
  accountId,
  size,
}: {
  accountId?: string;
  size?: string;
}) => {
  const { data } = useGetPlaidItemsQuery();

  const item = data?.find((item) =>
    item.accounts.find((account) => account.id === accountId)
  );

  console.log(item?.institution?.name, item?.institution?.primary_color);

  const args = {
    size,
    data: item?.institution?.logo,
    alt: item ? `${item.institution?.name?.charAt(0).toUpperCase()}` : ' ',
    ...(!item?.institution?.logo
      ? { backgroundColor: 'var(--btn-light-gray)' }
      : {}),
  };

  return <Base64Logo {...args} />;
};

export default InstitutionLogo;
