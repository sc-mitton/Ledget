
-- Recurring monthly transactions on the day
SELECT ft.name, ft.amount, EXTRACT(DAY FROM ft.date) AS day_of_month, COUNT(*)
FROM financials_transaction ft
JOIN financials_account fa ON (ft.account_id = fa.id)
JOIN financials_plaid_item fpi ON (fa.plaid_item_id = fpi.id)
WHERE fpi.user_id = 'd3679985-2557-4b1c-8c40-3eb30f92f5b5'
GROUP BY ft.name, ft.amount, day_of_month
HAVING COUNT(*) > 4;

-- Recurring yearly transactions on the day
SELECT ft.name, ft.amount, EXTRACT(DAY FROM ft.date) AS day_of_month, EXTRACT(MONTH FROM ft.date) AS month_of_year, COUNT(*)
FROM financials_transaction ft
JOIN financials_account fa ON (ft.account_id = fa.id)
JOIN financials_plaid_item fpi ON (fa.plaid_item_id = fpi.id)
WHERE fpi.user_id = 'd3679985-2557-4b1c-8c40-3eb30f92f5b5'
GROUP BY ft.name, ft.amount, day_of_month, month_of_year
HAVING COUNT(*) > 4;

-- Recurring monthly transactions that still look like they're recurring
SELECT ft.name, ft.amount, COUNT(*)
FROM financials_transaction ft
JOIN financials_account fa ON (ft.account_id = fa.id)
JOIN financials_plaid_item fpi ON (fa.plaid_item_id = fpi.id)
WHERE fpi.user_id = 'd3679985-2557-4b1c-8c40-3eb30f92f5b5'
GROUP BY ft.name, ft.amount
HAVING COUNT(*) > 12;

-- Recurring transactions that look like variable amount
SELECT ft.name, ft.amount, COUNT(*)
FROM financials_transaction ft
JOIN financials_account fa ON (ft.account_id = fa.id)
JOIN financials_plaid_item fpi ON (fa.plaid_item_id = fpi.id)
WHERE fpi.user_id = 'd3679985-2557-4b1c-8c40-3eb30f92f5b5'
GROUP BY ft.name, ft.amount
HAVING COUNT(*) > 12;


-- Three scheduling scenarios
-- 1. Same day of the month every month
-- 2. Same day of the year every year
-- 3. Same weekNumber & dayOfWeek every year
