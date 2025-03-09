import { StripeElementsOptions } from '@stripe/stripe-js';

export const useStripeElementAppearance = ({
  isDark,
}: {
  isDark: boolean;
}): StripeElementsOptions['appearance'] => {
  return {
    theme: 'flat',
    labels: 'floating',
    variables: {
      colorTextPlaceholder: isDark ? '#737375' : '#999999',
      colorBackground: isDark ? '#1f1f1f' : '#FFFFFF',
      colorText: isDark ? '#e5e5e6' : '#323234',
      colorPrimaryText: isDark ? '#e5e5e6' : '#323234',
      colorDanger: isDark ? '#fa3852' : '#cf5959',
      fontFamily: 'Source Sans Pro, system-ui, sans-serif',
      spacingUnit: '2.5px',
      borderRadius: '8px',
      spacingTab: '6px',
      colorIconTabSelected: isDark ? '#e5e5e6' : '#323234',
    },
    rules: {
      '.Tab': {
        marginBottom: '12px',
        border: `1.5px solid transparent`,
        backgroundColor: isDark ? '#1e1e1f' : '#ebebeb',
      },
      '.Tab--selected': {
        border: `1.5px solid ${isDark ? '#0a3ec2' : '#3d71f5'}`,
        boxShadow: `0 0 0 1.5px ${isDark ? '#0a0a5c' : '#d1d1fa'}`,
        backgroundColor: isDark ? '#1e1e1f' : '#ebebeb',
        color: isDark ? '#e5e5e6' : '#323234',
      },
      '.Input': {
        border: `1.5px solid transparent`,
      },
      '.Input:hover': {
        border: `1.5px solid ${isDark ? '#2E2E2E' : '#D1D1D5'}`,
      },
      '.Input:focus': {
        border: `1.5px solid ${isDark ? '#255cf4' : '#6e92f7'}`,
        boxShadow: `0 0 0 1.5px ${isDark ? '#1f2947' : '#d1d1fa'}`,
      },
      '.Input:focus-visible': {
        border: `1.5px solid ${isDark ? '#255cf4' : '#6e92f7'}`,
        boxShadow: `0 0 0 1.5px ${isDark ? '#1f2947' : '#d1d1fa'}`,
      },
      '.AccordionItem': {
        backgroundColor: isDark ? '#262626' : '#ebebeb',
        borderWidth: '6px',
        borderRadius: '16px',
        padding: '16px',
        borderColor: isDark ? '#161617' : '#fafafa',
      },
    },
  };
};
