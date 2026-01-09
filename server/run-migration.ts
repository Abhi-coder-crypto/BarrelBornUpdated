/**
 * Helper script to run the bar prices migration
 * Usage: npm run ts-node -- server/run-migration.ts
 */

import { migrateBarPrices } from "./migrate-bar-prices";

migrateBarPrices().catch(console.error);
