import { useState } from 'react';
import { View } from 'react-native';
import * as Linking from 'expo-linking';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Copy, ChevronRight } from 'geist-native-icons';
import * as Clipboard from 'expo-clipboard';

import styles from './styles/authenticator-app-setup';
import {
  Text,
  Header2,
  Modal,
  Button,
  SlideView,
  Otc,
  Icon,
  SubmitButton,
  Seperator
} from '@ledget/native-ui';
import { useBioAuth } from '@hooks';
import {
  useLazyGetSettingsFlowQuery,
  useCompleteSettingsFlowMutation,
} from '@features/orySlice';
import { useGetMeQuery } from '@ledget/shared-features';
import { useNativeFlow } from '@ledget/ory';
import { useEffect } from 'react';
import { ModalScreenProps } from '@types';

const schema = z.object({
  totp_code: z.string().length(6, { message: 'Invalid code' })
})

const RecoveryCodes = ({ closeModal }: { closeModal: () => void }) => {
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [copySuccess, setCopySuccess] = useState(false);
  const [generatingNewCodes, setGeneratingNewCodes] = useState(false);

  const {
    flow,
    fetchFlow,
    flowStatus,
    submitFlow,
    resetCompleteFlow,
  } = useNativeFlow(
    useLazyGetSettingsFlowQuery,
    useCompleteSettingsFlowMutation,
    'settings'
  );

  useEffect(() => { fetchFlow() }, []);

  // Regenerate or view recovery codes after flow is fetched
  useEffect(() => {
    if (flowStatus.isGetFlowSuccess) {
      submitFlow({
        method: 'lookup_secret',
        lookup_secret_reveal: true
      })
    }
  }, [flowStatus.isGetFlowSuccess]);

  // Extract recovery codes from flow
  // and save the codes if we're in the authenticator setup
  useEffect(() => {
    if (flowStatus.isCompleteSuccess) {
      flow?.ui.nodes.find((node: any) => {
        if (node.attributes.id === 'lookup_secret_codes') {
          setRecoveryCodes(node.attributes.text.text.split(','));
          return true;
        }
      });

      // Lower this flag if new codes were being generated and now they're available
      if (generatingNewCodes) {
        const timeout = setTimeout(() => {
          setGeneratingNewCodes(false);
        }, 3000);
        return () => clearTimeout(timeout);
      }
    }
  }, [flowStatus.isCompleteSuccess]);

  // Close on any errors fetching flow or codes
  useEffect(() => {
    if (flowStatus.errId === 4000001) {
      resetCompleteFlow();
      submitFlow({
        method: 'lookup_secret',
        lookup_secret_regenerate: true
      });
      setGeneratingNewCodes(true);
    }
  }, [flowStatus.errId]);

  const onCopy = () => {
    Clipboard.setStringAsync(recoveryCodes.join('\n'));
    submitFlow({
      method: 'lookup_secret',
      lookup_secret_confirm: true
    });
    setCopySuccess(true);
    const timeout = setTimeout(() => {
      closeModal();
    }, 1000);
    return () => clearTimeout(timeout);
  }

  return (
    <View>
      <Text color='secondaryText'>
        Copy your recovery codes and keep them in a safe place
      </Text>
      <View style={styles.copyButtonContainer}>
        <SubmitButton
          label='Copy'
          labelPlacement='right'
          onPress={onCopy}
          isSuccess={copySuccess}
        >
          <Icon icon={Copy} />
        </SubmitButton>
      </View>
    </View>
  )
}

const AuthenticatorApp = (props: ModalScreenProps<'AuthenticatorAppSetup'>) => {
  useBioAuth({ onFail: props.navigation.goBack });
  const { data: user } = useGetMeQuery();
  const [totpSecret, setTotpSecret] = useState('');
  const [step, setStep] = useState(0);

  const { control, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema)
  });

  const { flow, fetchFlow, flowStatus, submitFlow, } = useNativeFlow(
    useLazyGetSettingsFlowQuery,
    useCompleteSettingsFlowMutation,
    'settings'
  );

  useEffect(() => { fetchFlow() }, []);

  useEffect(() => {
    if (flowStatus.isGetFlowSuccess) {
      const totpNode = flow?.ui.nodes.find(
        (node: any) => node.group === 'totp' && node.type === 'text'
      )
      setTotpSecret((totpNode as any)?.attributes.text.context.secret);
    }
  }, [flowStatus.isGetFlowSuccess]);

  useEffect(() => {
    if (flowStatus.isCompleteSuccess) {
      setStep(2);
    }
  }, [flowStatus.isCompleteSuccess]);

  const onSubmit = (data: any) => {
    submitFlow({ totp_code: data.totp_code, method: 'totp' });
  }

  return (
    <Modal >
      <View style={styles.content}>
        <Header2>Authenticator App Setup</Header2>
        {step === 0 &&
          <SlideView
            style={styles.slide}
            position={0}
            skipEnter={true}
          >
            <Text color='secondaryText'>
              First get a 6-digit code from your authenticator app
            </Text>
            <Seperator variant='m' />
            <Button
              style={styles.button}
              variant='main'
              onPress={() => {
                Linking.openURL(`otpauth://totp/LEDGET:${user?.email}?secret=${totpSecret}&issuer=Ledget`)
                setStep(1);
              }}
              label='Get Code'
            >
              <Icon icon={ChevronRight} />
            </Button>
          </SlideView>}
        {step === 1 &&
          <SlideView position={1} style={styles.slide}>
            <Text color='secondaryText'>
              Enter the 6-digit code
            </Text>
            <Seperator variant='m' />
            <Controller
              control={control}
              name='totp_code'
              render={({ field: { onChange } }) => (
                <Otc
                  autoFocus
                  codeLength={6}
                  onCodeChange={onChange}
                  error={errors.totp_code?.message}
                />
              )}
            />
            <Button label='Submit' onPress={handleSubmit(onSubmit)} />
          </SlideView>}
        {step === 2 &&
          <SlideView position={2} style={styles.slide}>
            <RecoveryCodes closeModal={props.navigation.goBack} />
          </SlideView>}
      </View>
    </Modal>
  )
};

export default AuthenticatorApp
