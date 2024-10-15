import { SectionListData } from 'react-native';

import { Transaction } from '@ledget/shared-features';
import { AccountsTabsScreenProps } from '@types';

export type ListState = 'neutral' | 'expanded'

export interface PTransactions extends AccountsTabsScreenProps<'Depository' | 'Credit'> {
  collapsedTop: number
  expandedTop: number
  onStateChange?: (state: 'neutral' | 'expanded') => void
}

interface TransactionT extends Transaction {
  lastInSection: boolean
}

export type Section = SectionListData<Transaction, {
  title: string;
  data: TransactionT[];
  index: number;
}>
