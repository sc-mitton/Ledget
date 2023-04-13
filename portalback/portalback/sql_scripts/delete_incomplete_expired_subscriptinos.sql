CREATE OR REPLACE FUNCTION delete_old_subscriptions()
RETURNS VOID AS $$
BEGIN
  DELETE FROM core_subscriptions
  WHERE
    state = 'trialing' AND default_payment_method IS NULL AND
    TO_TIMESTAMP(created) < NOW() - INTERVAL '23 hours';
END;
$$ LANGUAGE plpgsql;
