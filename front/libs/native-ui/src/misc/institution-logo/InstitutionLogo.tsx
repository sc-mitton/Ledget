import { useMemo } from "react";
import { Platform } from "react-native";

import { Base64Image } from "../base64-image/Base64Image"
import type { Props } from "../base64-image/Base64Image"
import { useGetPlaidItemsQuery } from '@ledget/shared-features';

export const InstitutionLogo = (props: Props & { account?: string, institution?: string, hasShadow?: boolean, hasBorder?: boolean }) => {
  const { hasShadow = true, hasBorder = true } = props;

  const { data: plaidItemsData } = useGetPlaidItemsQuery();

  const logoData = useMemo(() => {
    if (props.institution) {
      return plaidItemsData?.find((p) => p.institution?.id === props.institution)?.institution?.logo
    } else {
      return plaidItemsData?.find((p) =>
        p.accounts.find((account) => account.id === props.account))?.institution?.logo
    }
  }, [plaidItemsData, props.account, props.institution])

  return (
    <Base64Image
      borderRadius={'circle'}
      shadowColor="logoShadow"
      shadowOffset={{ width: 0, height: 1 }}
      shadowOpacity={hasShadow ? .8 : 0}
      shadowRadius={1}
      elevation={2}
      borderColor='modalSeperator'
      backgroundColor='modalSeperator'
      borderWidth={hasBorder ? .5 : 0}
      size={props.size || Platform.OS === 'ios' ? 22 : 24}
      data={logoData}
      {...props}
    />
  )
}
