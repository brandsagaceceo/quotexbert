# AI Usage Budget

The homeowner assistant and SEO draft generator share a database-backed daily
inference-request limit. Set `AI_GLOBAL_DAILY_REQUEST_LIMIT` to a positive
integer before enabling either paid feature. Missing or invalid configuration,
an exhausted limit, or a reservation/database error denies the inference.
Reservations use UTC-day accounting and are recorded without homeowner prompts,
photos, or other personal information.

The assistant separately limits each user to six requests per hour and limits
each response to 1,400 output tokens. SEO drafting is feature-flagged, runs at
most once per UTC day, and limits each response to 5,000 output tokens. Both
inference calls have request timeouts and sanitized error logging.

The application-side limit counts requests, not provider charges, and only
covers these two workflows. It is not a monetary ceiling and does not cover
other existing AI features. It does not replace provider-side spending limits,
alerts, model-access restrictions, or billing monitoring. Configure those
controls independently before enabling paid inference. Keep
`QUOTEXBERT_AI_ENABLED`, `SEO_DRAFT_AUTOMATION_ENABLED`, and
`SEO_AUTO_PUBLISH_ENABLED` disabled until individually approved.
