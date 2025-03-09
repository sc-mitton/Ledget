import { useSearchParams } from 'react-router-dom';
import { createContext, useContext, useState } from 'react';

interface CheckoutContextType {
  price: string | undefined;
  setPrice: (price: string) => void;
  clientSecret: string | undefined;
  setClientSecret: (secret: string) => void;
}

const CheckoutContext = createContext<CheckoutContextType>({
  price: undefined,
  setPrice: () => {},
  clientSecret: undefined,
  setClientSecret: () => {},
});

export const CheckoutProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [searchParams] = useSearchParams();
  const [price, setPrice] = useState<string>();
  const [clientSecret, setClientSecret] = useState<string | undefined>(
    searchParams.get('clientSecret') || undefined
  );

  return (
    <CheckoutContext.Provider
      value={{ price, setPrice, clientSecret, setClientSecret }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};
