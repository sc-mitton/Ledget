import Account from './widgets/deposit-account/Account';
import CategoriesProgress from "./widgets/categories/Categories";
import CreditCardsBalance from "./widgets/credit-cards-balance/CreditCardsBalance";
import InvestmentAccount from './widgets/investment-account/InvestmentAccount';
import SpendingSummary from "./widgets/spending-summary/SpendingSummary";
import SpendingInvestmentBar from "./widgets/spending-investments-bars/SpendingInvestmentBar";
import Bills from "./widgets/bills/Widget";

export const widgetsMap = {
  'categories': CategoriesProgress,
  'deposit-account': Account,
  'saving-and-investing': SpendingInvestmentBar,
  'investment-account': InvestmentAccount,
  'spending-summary': SpendingSummary,
  'bills': Bills,
  'credit-cards': CreditCardsBalance,
}
