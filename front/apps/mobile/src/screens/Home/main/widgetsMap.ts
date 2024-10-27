import Account from './widgets/deposit-account/Account';
import CategoriesProgress from "./widgets/categories/Categories";
import CreditCardsBalance from "./widgets/credit-cards-balance/CreditCardsBalance";
import InvestmentAccount from './widgets/investment-account/InvestmentAccount';
import SpendingSummary from "./widgets/spending-summary/SpendingSummary";
import SpendingVsIncome from "./widgets/spending-vs-income/SpendingVsIncome";
import Bills from "./widgets/bills/Widget";

export const widgetsMap = {
  'categories': CategoriesProgress,
  'deposit-account': Account,
  'saving-and-investing': SpendingVsIncome,
  'investment-account': InvestmentAccount,
  'spending-summary': SpendingSummary,
  'bills': Bills,
  'credit-cards': CreditCardsBalance,
}
