import { useMemo } from "react";

import { Base64Image } from "../base64-image/Base64Image"
import type { Props } from "../base64-image/Base64Image"
import { useGetPlaidItemsQuery } from '@ledget/shared-features';

export const InstitutionLogo = (props: Props & { account?: string }) => {
  const { data: plaidItemsData } = useGetPlaidItemsQuery();

  const logoData = useMemo(() => {
    return plaidItemsData?.find((p) =>
      p.accounts.find((account) => account.id === props.account))?.institution?.logo
  }, [plaidItemsData, props.account])

  return (
    <Base64Image
      borderRadius={20}
      shadowColor="logoShadow"
      shadowOffset={{ width: 0, height: 1 }}
      shadowOpacity={.8}
      shadowRadius={1}
      borderColor='lightseperator'
      borderWidth={.5}
      size={22}
      data={logoData}
      {...props}
    />
  )
}
