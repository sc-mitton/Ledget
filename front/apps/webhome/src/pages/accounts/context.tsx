import { createContext, useContext, useEffect, useState } from 'react';

import { useSearchParams, useLocation } from 'react-router-dom';

import { useGetAccountsQuery, Account, Institution } from '@features/accountsSlice';
import pathMappings from './path-mappings';

interface AccountsContext {
    accounts?: Account[];
    institutions?: Institution[];
    setAccounts: React.Dispatch<React.SetStateAction<Account[] | undefined>>;
    isLoading: boolean;
    isSuccess: boolean;
}

const AccountsContext = createContext<AccountsContext | undefined>(undefined);

export const useAccountsContext = () => {
    const context = useContext(AccountsContext);
    if (context === undefined) {
        throw new Error('useAccountsContext must be used within a AccountsProvider');
    }
    return context;
};

export const AccountsProvider = ({ children }: { children: React.ReactNode }) => {
    const { data, isSuccess, isLoading } = useGetAccountsQuery();
    const [state, setState] = useState<Account[]>();
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();

    useEffect(() => {
        if (isSuccess) {
            setState(data.accounts);

        }
    }, [isSuccess]);

    // Set first account on get accounts success
    useEffect(() => {
        const account = data?.accounts?.filter((account: any) =>
            account.type === pathMappings.getAccountType(location))[0]
        searchParams.set('account', account?.account_id || '')
        setSearchParams(searchParams)

    }, [location.pathname.split('/')[2], data])

    // Filter accounts
    useEffect(() => {
        if (isSuccess) {
            setState(data?.accounts.filter((account: any) =>
                account.type === pathMappings.getAccountType(location)
            ) || [])
        }
    }, [isSuccess, location.pathname])

    return (
        <AccountsContext.Provider value={{ accounts: state, setAccounts: setState, institutions: data?.institutions, isLoading, isSuccess }}>
            {children}
        </AccountsContext.Provider>
    );
};
