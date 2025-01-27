import styles from './styles/institution-logo.module.scss';
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

  const args = {
    size,
    data: item?.institution?.logo,
  };

  return args.data ? (
    <Base64Logo {...args} />
  ) : (
    <div style={{ fontSize: size }} className={styles.logo}>
      <span>{item?.institution?.name?.charAt(0).toUpperCase()}</span>
    </div>
  );
};

export default InstitutionLogo;
