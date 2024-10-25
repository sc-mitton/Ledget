import AccountsBalance from "./widgets/accounts-balance/AccountsBalance";
import CategoriesProgress from "./widgets/categories/Categories";
import CreditCardsBalance from "./widgets/credit-cards-balance/CreditCardsBalance";
import InvestmentsBalance from "./widgets/investments-balance/InvestmentsBalance";
import SpendingSummary from "./widgets/spending-summary/SpendingSummary";
import SpendingVsIncome from "./widgets/spending-vs-income/SpendingVsIncome";
import Bills from "./widgets/bills/Widget";

export const widgetsMap = {
  'categories': CategoriesProgress,
  'accounts': AccountsBalance,
  'spending-vs-income': SpendingVsIncome,
  'investments': InvestmentsBalance,
  'spending-summary': SpendingSummary,
  'bills': Bills,
  'credit-cards': CreditCardsBalance,
}
