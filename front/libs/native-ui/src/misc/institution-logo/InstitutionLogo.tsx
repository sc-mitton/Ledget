import { useEffect, useState } from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

import styles from './styles';
import { Base64Image } from '../base64-image/Base64Image';
import type { Props } from '../base64-image/Base64Image';
import {
  selectInstitution,
  useLazyGetPlaidItemsQuery,
} from '@ledget/shared-features';
import { Box } from '../../restyled/Box';
import { Text } from '../../restyled/Text';

interface InstitutionLogoProps extends Props {
  account?: string;
  institution?: string;
  hasBorder?: boolean;
}

export const InstitutionLogo = (props: InstitutionLogoProps) => {
  const { hasBorder = true } = props;

  const institution = useSelector((state: any) =>
    selectInstitution(state, props.account || props.institution || '')
  );
  const [getPlaidItems, { data: plaidItemsData }] = useLazyGetPlaidItemsQuery();
  const [logoData, setLogoData] = useState<string>();

  useEffect(() => {
    if (!institution) {
      getPlaidItems();
    } else {
      setLogoData(institution?.logo);
    }
  }, [institution]);

  useEffect(() => {
    if (plaidItemsData) {
      if (props.institution && !institution) {
        setLogoData(
          plaidItemsData?.find((p) => p.institution?.id === props.institution)
            ?.institution?.logo
        );
      } else if (props.account && !institution) {
        setLogoData(
          plaidItemsData?.find((p) =>
            p.accounts.find((account) => account.id === props.account)
          )?.institution?.logo
        );
      }
    }
  }, [plaidItemsData]);

  return logoData !== null ? (
    <Base64Image
      borderRadius={'circle'}
      backgroundColor="modalSeperator"
      size={props.size || Platform.OS === 'ios' ? 22 : 24}
      data={logoData}
      {...props}
    />
  ) : (
    <Box
      borderRadius={'circle'}
      justifyContent="center"
      alignItems="center"
      width={props.size || Platform.OS === 'ios' ? 22 : 24}
      height={props.size || Platform.OS === 'ios' ? 22 : 24}
    >
      <Box
        backgroundColor="whiteText"
        borderRadius={'circle'}
        style={[StyleSheet.absoluteFill, styles.defaultLogoBack]}
      />
      <View style={styles.institutionInitialContainer}>
        <Text style={styles.institutionInitial} color="whiteText">
          {institution?.name?.charAt(0).toUpperCase()}
        </Text>
      </View>
    </Box>
  );
};
