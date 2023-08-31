
-- Recurring monthly transactions on the day
SELECT ft.name, MIN(ft.amount), MAX(ft.amount), EXTRACT(DAY FROM ft.date) AS day_of_month, COUNT(*) as count
FROM financials_transaction ft
JOIN financials_account fa ON (ft.account_id = fa.id)
JOIN financials_plaid_item fpi ON (fa.plaid_item_id = fpi.id)
WHERE fpi.user_id = 'd3679985-2557-4b1c-8c40-3eb30f92f5b5'
GROUP BY ft.name, day_of_month
HAVING ft.count > 4
ORDER BY ft.name, day_of_month;

-- Recurring yearly transactions on the day
SELECT ft.name, MIN(ft.amount), MAX(ft.amount), EXTRACT(DAY FROM ft.date) AS day_of_month, EXTRACT(MONTH FROM ft.date) AS month_of_year, COUNT(*) as count
FROM financials_transaction ft
JOIN financials_account fa ON (ft.account_id = fa.id)
JOIN financials_plaid_item fpi ON (fa.plaid_item_id = fpi.id)
WHERE fpi.user_id = 'd3679985-2557-4b1c-8c40-3eb30f92f5b5'
GROUP BY ft.name, day_of_month, month_of_year
HAVING ft.count > 1
ORDER BY ft.name, day_of_month, month_of_year;



-- Three scheduling scenarios
-- 1. Same day of the month every month
-- 2. Same day of the year every year
-- 3. Same weekNumber & dayOfWeek every year - ignoring this because it's too hard to extract
-- sample id d3679985-2557-4b1c-8c40-3eb30f92f5b5

INSERT INTO financials_transaction (transaction_id, name, amount, date, account_id)
VALUES ('2avweofijewoajfnz129u1asdvuhwe', 'Touchstone Climbing', '59', '2020-11-29', '9zKB5QnWRrFWwpWegm8jcpV6qvG5Bnt4eLdlr');

INSERT INTO financials_transaction (transaction_id, name, amount, date, account_id)
VALUES ('3avweofijewoajfnz121u1a2f2vuhwe', 'Touchstone Climbing', '45', '2021-11-29', '9zKB5QnWRrFWwpWegm8jcpV6qvG5Bnt4eLdlr');
