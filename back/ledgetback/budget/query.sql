(SELECT
    "budget_category"."id" AS "col1",
    "budget_category"."name" AS "col2",
    "budget_category"."emoji" AS "col3",
    "budget_category"."created" AS "col4",
    "budget_category"."removed_on" AS "col5",
    "budget_category"."period" AS "col6",
    "budget_category"."limit_amount" AS "col7",
    "budget_category"."is_default" AS "col8",
    "budget_user_category"."order" AS "order",
    SUM(("financials_transaction"."amount" * "budget_transaction_category"."fraction"))
    FILTER (WHERE "financials_transaction"."datetime" BETWEEN 2023-12-01 07:00:00+00:00 AND 2023-12-31 07:00:00+00:00) AS "amount_spent"
FROM "budget_category"
INNER JOIN "budget_user_category"
    ON ("budget_category"."id" = "budget_user_category"."category_id")
LEFT OUTER JOIN "budget_transaction_category"
    ON ("budget_category"."id" = "budget_transaction_category"."category_id")
LEFT OUTER JOIN "financials_transaction"
    ON ("budget_transaction_category"."transaction_id" = "financials_transaction"."transaction_id")
WHERE (("budget_category"."removed_on" > 2023-12-31 07:00:00+00:00 OR "budget_category"."removed_on" IS NULL)
    AND "budget_category"."period" = month AND "budget_user_category"."user_id" = ad386c2b-9e0b-4856-9ebb-4122b7fe5ba8)
    GROUP BY 1, 5, 9 HAVING NOT ((SUM(("financials_transaction"."amount" * "budget_transaction_category"."fraction"))
FILTER (WHERE ("financials_transaction"."datetime" BETWEEN 2023-12-01 07:00:00+00:00 AND 2023-12-31 07:00:00+00:00))
    IS NULL OR SUM(("financials_transaction"."amount" * "budget_transaction_category"."fraction"))
FILTER (WHERE ("financials_transaction"."datetime" BETWEEN 2023-12-01 07:00:00+00:00 AND 2023-12-31 07:00:00+00:00)) = 0)
    AND "budget_category"."removed_on" IS NOT NULL))

UNION

(SELECT
    "budget_category"."id" AS "col1",
    "budget_category"."name" AS "col2",
    "budget_category"."emoji" AS "col3",
    "budget_category"."created" AS "col4",
    "budget_category"."removed_on" AS "col5",
    "budget_category"."period" AS "col6",
    "budget_category"."limit_amount" AS "col7",
    "budget_category"."is_default" AS "col8",
    "budget_user_category"."order" AS "order",
    SUM(("financials_transaction"."amount" * "budget_transaction_category"."fraction"))
    FILTER (WHERE "financials_transaction"."datetime" BETWEEN 2023-12-01 23:29:37.470156+00:00 AND 2023-12-31 07:00:00+00:00) AS "amount_spent"
FROM "budget_category"
INNER JOIN "budget_user_category"
    ON ("budget_category"."id" = "budget_user_category"."category_id")
INNER JOIN "budget_category" T3
    ON ("budget_user_category"."category_id" = T3."id")
LEFT OUTER JOIN "budget_transaction_category"
    ON ("budget_category"."id" = "budget_transaction_category"."category_id")
LEFT OUTER JOIN "financials_transaction"
    ON ("budget_transaction_category"."transaction_id" = "financials_transaction"."transaction_id")
    WHERE (("budget_category"."removed_on" > 2023-12-31 23:59:59.999999+00:00 OR "budget_category"."removed_on" IS NULL)
    AND T3."period" = year AND "budget_user_category"."user_id" = ad386c2b-9e0b-4856-9ebb-4122b7fe5ba8)
    GROUP BY 1, 5, 9 HAVING NOT ((SUM(("financials_transaction"."amount" * "budget_transaction_category"."fraction"))
FILTER (WHERE ("financials_transaction"."datetime" BETWEEN 2023-12-01 23:29:37.470156+00:00 AND 2023-12-31 07:00:00+00:00))
    IS NULL OR SUM(("financials_transaction"."amount" * "budget_transaction_category"."fraction"))
FILTER (WHERE ("financials_transaction"."datetime" BETWEEN 2023-12-01 23:29:37.470156+00:00 AND 2023-12-31 07:00:00+00:00)) = 0)
    AND "budget_category"."removed_on" IS NOT NULL))

ORDER BY 9 ASC, "col2" ASC
