/** @param {import("node-pg-migrate").MigrationBuilder} pgm */
exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE invitations (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      public_slug varchar(32) UNIQUE,
      template_id varchar(40) NOT NULL,
      locale varchar(2) NOT NULL CHECK (locale IN ('uz', 'ru', 'en')),
      event_type varchar(30) NOT NULL CHECK (
        event_type IN ('wedding', 'birthday', 'family', 'corporate', 'graduation')
      ),
      event_details jsonb NOT NULL CHECK (jsonb_typeof(event_details) = 'object'),
      customer_name varchar(120),
      customer_email varchar(254),
      customer_phone varchar(32),
      status varchar(24) NOT NULL DEFAULT 'draft' CHECK (
        status IN ('draft', 'pending_payment', 'paid', 'published', 'cancelled')
      ),
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      published_at timestamptz,
      CHECK (
        (status = 'published' AND public_slug IS NOT NULL AND published_at IS NOT NULL)
        OR status <> 'published'
      )
    );

    CREATE INDEX invitations_status_created_at_idx
      ON invitations (status, created_at DESC);
    CREATE INDEX invitations_customer_email_idx
      ON invitations (lower(customer_email))
      WHERE customer_email IS NOT NULL;
    CREATE INDEX invitations_customer_phone_idx
      ON invitations (customer_phone)
      WHERE customer_phone IS NOT NULL;

    CREATE TABLE orders (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      order_number varchar(32) NOT NULL UNIQUE,
      invitation_id uuid NOT NULL REFERENCES invitations(id) ON DELETE RESTRICT,
      customer_name varchar(120),
      customer_email varchar(254),
      customer_phone varchar(32),
      amount_minor bigint NOT NULL CHECK (amount_minor > 0),
      currency char(3) NOT NULL CHECK (currency = upper(currency)),
      status varchar(24) NOT NULL DEFAULT 'pending_payment' CHECK (
        status IN ('pending_payment', 'paid', 'failed', 'cancelled', 'expired', 'refunded')
      ),
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      paid_at timestamptz
    );

    CREATE INDEX orders_invitation_id_created_at_idx
      ON orders (invitation_id, created_at DESC);
    CREATE INDEX orders_status_created_at_idx
      ON orders (status, created_at DESC);

    CREATE TABLE payments (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      order_id uuid NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
      provider varchar(12) NOT NULL CHECK (provider IN ('click', 'payme')),
      provider_transaction_id varchar(160),
      provider_payment_id varchar(160),
      idempotency_key varchar(160) NOT NULL UNIQUE,
      amount_minor bigint NOT NULL CHECK (amount_minor > 0),
      currency char(3) NOT NULL CHECK (currency = upper(currency)),
      status varchar(20) NOT NULL DEFAULT 'initiated' CHECK (
        status IN ('initiated', 'pending', 'succeeded', 'failed', 'cancelled', 'refunded')
      ),
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      verified_at timestamptz
    );

    CREATE UNIQUE INDEX payments_provider_transaction_uidx
      ON payments (provider, provider_transaction_id)
      WHERE provider_transaction_id IS NOT NULL;
    CREATE UNIQUE INDEX payments_provider_payment_uidx
      ON payments (provider, provider_payment_id)
      WHERE provider_payment_id IS NOT NULL;
    CREATE INDEX payments_order_id_created_at_idx
      ON payments (order_id, created_at DESC);

    CREATE TABLE payment_events (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      provider varchar(12) NOT NULL CHECK (provider IN ('click', 'payme')),
      external_event_id varchar(180) NOT NULL,
      payment_id uuid REFERENCES payments(id) ON DELETE SET NULL,
      event_type varchar(80) NOT NULL,
      payload_sha256 char(64) NOT NULL,
      processing_status varchar(20) NOT NULL DEFAULT 'received' CHECK (
        processing_status IN ('received', 'processed', 'ignored', 'failed')
      ),
      received_at timestamptz NOT NULL DEFAULT now(),
      processed_at timestamptz,
      processing_error varchar(500),
      UNIQUE (provider, external_event_id)
    );

    CREATE INDEX payment_events_payment_id_received_at_idx
      ON payment_events (payment_id, received_at DESC);

    CREATE TABLE invitation_access_tokens (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      invitation_id uuid NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
      token_sha256 char(64) NOT NULL UNIQUE,
      expires_at timestamptz,
      revoked_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE INDEX invitation_access_tokens_invitation_id_idx
      ON invitation_access_tokens (invitation_id);

    CREATE TABLE audit_events (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      aggregate_type varchar(40) NOT NULL,
      aggregate_id uuid NOT NULL,
      event_type varchar(80) NOT NULL,
      actor_type varchar(20) NOT NULL CHECK (
        actor_type IN ('system', 'customer', 'admin', 'payment_provider')
      ),
      actor_reference varchar(160),
      metadata jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(metadata) = 'object'),
      created_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE INDEX audit_events_aggregate_created_at_idx
      ON audit_events (aggregate_type, aggregate_id, created_at DESC);
  `);
};

/** @param {import("node-pg-migrate").MigrationBuilder} pgm */
exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS audit_events;
    DROP TABLE IF EXISTS invitation_access_tokens;
    DROP TABLE IF EXISTS payment_events;
    DROP TABLE IF EXISTS payments;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS invitations;
  `);
};
