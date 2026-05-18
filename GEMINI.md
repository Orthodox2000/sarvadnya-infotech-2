# Project Conventions

## Versioning
- Always mention the application version number when presenting changes or updates.
- Versioning follows the format `v1.1.x`.
- Increment the patch version automatically for every iteration/significant set of changes.
- Current Version: v1.1.6

## Database & Bootstrap
- `supabase_schema.sql` is the central bootstrap file for Supabase. It contains all table definitions, RLS policies, and seed data.
- Always update this file when adding new tables or changing schemas.
