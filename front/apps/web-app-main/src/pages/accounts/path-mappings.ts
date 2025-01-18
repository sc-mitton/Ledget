import { AccountType } from '@ledget/shared-features';
import { Location } from 'react-router-dom';

const pathMappings = {
  getTransactionType: (location: Location): AccountType => {
    switch (location.pathname.split('/')[2]) {
      case 'deposits':
        return 'depository';
      case 'credit':
        return 'credit';
      case 'loans':
        return 'loan';
      case 'investments':
        return 'investment';
      default:
        return 'other';
    }
  },
  getAccountType: (location: Location): AccountType => {
    switch (location.pathname.split('/')[2]) {
      case 'deposits':
        return 'depository';
      case 'credit':
        return 'credit';
      case 'loans':
        return 'loan';
      case 'investments':
        return 'investment';
      default:
        return 'other';
    }
  },
  getWaferTitle: (location: Location): string => {
    switch (location.pathname.split('/')[2]) {
      case 'deposits':
        return 'Total Deposits';
      case 'credit':
        return 'Total Balance';
      case 'loans':
        return 'All Loans';
      case 'investments':
        return 'Total Investments';
      default:
        return 'Other';
    }
  },
};

export default pathMappings;
