import { SectionListData } from 'react-native';

import { InvestmentTransaction, Account } from '@ledget/shared-features';
import { AccountsTabsScreenProps } from '@types';

export type ListState = 'neutral' | 'expanded'

export interface PTransactions extends AccountsTabsScreenProps<'Investment'> {
  collapsedTop: number
  expandedTop: number
  onStateChange?: (state: 'neutral' | 'expanded') => void
}

interface TransactionT extends InvestmentTransaction {
  lastInSection: boolean
}

export type Section = SectionListData<InvestmentTransaction, {
  title: string;
  data: TransactionT[];
  index: number;
}>
