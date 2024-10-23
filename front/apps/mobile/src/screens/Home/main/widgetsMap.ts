import AccountsBalance from "./widgets/accounts-balance/AccountsBalance";
import CategoriesProgress from "./widgets/categories-progress/CategoriesProgress";
import CreditCardsBalance from "./widgets/credit-cards-balance/CreditCardsBalance";
import InvestmentsBalance from "./widgets/investments-balance/InvestmentsBalance";
import MonthlySpendingLeft from "./widgets/monthly-spending-left/MonthlySpendingLeft";
import SpendingVsIncome from "./widgets/spending-vs-income/SpendingVsIncome";
import YearlySpendingLeft from "./widgets/yearly-spending-left/YearlySpendingLeft";

export const widgetsMap = {
  'categories-progress': CategoriesProgress,
  'accounts-balance': AccountsBalance,
  'spending-vs-income': SpendingVsIncome,
  'investments-balance': InvestmentsBalance,
  'monthly-spending-left': MonthlySpendingLeft,
  'yearly-spending-left': YearlySpendingLeft,
  'credit-cards-balance': CreditCardsBalance
}
