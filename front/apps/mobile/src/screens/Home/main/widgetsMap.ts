import AccountsBalance from "./widgets/accounts-balance/Widget";
import CategoriesProgress from "./widgets/categories-progress/Widget";
import CreditCardsBalance from "./widgets/credit-cards-balance/CreditCardsBalance";
import InvestmentsBalance from "./widgets/investments-balance/InvestmentsBalance";
import MonthlySpendingLeft from "./widgets/monthly-spending-left/MonthlySpendingLeft";
import SpendingVsIncome from "./widgets/spending-vs-income/SpendingVsIncome";
import YearlySpendingLeft from "./widgets/yearly-spending-left/YearlySpendingLeft";

export const widgetsMap = {
  'categories': CategoriesProgress,
  'accounts': AccountsBalance,
  'spending-vs-income': SpendingVsIncome,
  'investments': InvestmentsBalance,
  'monthly-spending': MonthlySpendingLeft,
  'yearly-spending': YearlySpendingLeft,
  'credit-cards': CreditCardsBalance
}
