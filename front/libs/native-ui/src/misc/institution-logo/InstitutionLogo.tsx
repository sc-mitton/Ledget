import { useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import { useSelector } from "react-redux";

import { Base64Image } from "../base64-image/Base64Image"
import type { Props } from "../base64-image/Base64Image"
import { selectInstitution, useLazyGetPlaidItemsQuery } from '@ledget/shared-features';

interface InstitutionLogoProps extends Props {
  account?: string
  institution?: string
  hasShadow?: boolean
  hasBorder?: boolean
}

export const InstitutionLogo = (props: InstitutionLogoProps) => {
  const { hasShadow = true, hasBorder = true } = props;

  const institution = useSelector((state: any) => selectInstitution(state, props.account || props.institution || ''));
  const [getPlaidItems, { data: plaidItemsData }] = useLazyGetPlaidItemsQuery();
  const [logoData, setLogoData] = useState<string>();

  useEffect(() => {
    if (!institution) {
      getPlaidItems()
    } else {
      setLogoData(institution?.logo)
    }
  }, [institution])

  useEffect(() => {
    if (plaidItemsData) {
      if (props.institution && !institution) {
        setLogoData(plaidItemsData?.find((p) => p.institution?.id === props.institution)?.institution?.logo)
      } else if (props.account && !institution) {
        setLogoData(plaidItemsData?.find((p) => p.accounts.find((account) => account.id === props.account))?.institution?.logo)
      }
    }
  }, [plaidItemsData])

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
