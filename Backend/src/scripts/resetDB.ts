/**
 * ONE-TIME SCRIPT: Drops all campusnexus tables and recreates them fresh.
 * Run with: npx ts-node --transpile-only ./src/scripts/resetDB.ts
 */
import { sequelize } from '../config/database';
import '../models/index'; // load all associations

const tables = [
  'review', 'notification', 'rental', 'wallet',
  'item', 'user', 'event', 'cart', 'message',
  'refund', 'report', 'transaction'
];

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to MySQL');

    // Disable FK checks so we can drop in any order
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Drop all tables
    for (const table of tables) {
      await sequelize.query(`DROP TABLE IF EXISTS \`${table}\``);
      console.log(`  🗑️  Dropped: ${table}`);
    }

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    await sequelize.query("SET SESSION sql_mode = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'");

    // Recreate all tables from Sequelize models
    await sequelize.sync({ force: false });

    console.log('\n✅ All tables recreated successfully!');
    console.log('   Open phpMyAdmin to verify: http://localhost/phpmyadmin');
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Reset failed:', err?.message);
    process.exit(1);
  }
})();
