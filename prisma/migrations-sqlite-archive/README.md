# Archived SQLite migration history

These migration files are preserved for historical reference. They were created
for SQLite and must not be replayed against the PostgreSQL database.

The active PostgreSQL migration history starts with
`prisma/migrations/0_init`, which represents the verified pre-SEO production
schema, followed by the additive SEO migration. Existing databases must
baseline `0_init` as already applied before deploying later migrations; do not
execute the baseline DDL against an existing database.
