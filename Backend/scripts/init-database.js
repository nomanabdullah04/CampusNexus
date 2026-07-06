/**
 * MongoDB Database Initialization Script
 * Run this after MongoDB is installed and running
 * Command: node scripts/init-database.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const initializeDatabase = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.DB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection;

    // Get the database
    const database = db.db;

    // Create collections if they don't exist
    console.log('📦 Creating collections...');

    // Users collection
    await database.createCollection('users', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { bsonType: 'string' },
            email: { bsonType: 'string' },
            password: { bsonType: 'string' },
            presentAddress: { bsonType: 'string' },
            activeRole: { bsonType: 'string' },
            isStatus: { bsonType: 'string' },
            picture: { bsonType: 'string' },
            universityId: { bsonType: 'string' },
            isVerified: { bsonType: 'bool' }
          }
        }
      }
    }).catch(() => console.log('  ℹ️  Users collection already exists'));

    // Items collection
    await database.createCollection('items', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['ownerId', 'title', 'price', 'sellingCategory', 'objectCategory'],
          properties: {
            ownerId: { bsonType: 'objectId' },
            title: { bsonType: 'string' },
            description: { bsonType: 'string' },
            price: { bsonType: 'number' },
            deposit: { bsonType: 'number' },
            condition: { bsonType: 'string' },
            sellingCategory: { bsonType: 'string' },
            availability: { bsonType: 'string' },
            objectCategory: { bsonType: 'string' }
          }
        }
      }
    }).catch(() => console.log('  ℹ️  Items collection already exists'));

    // Wallets collection
    await database.createCollection('wallets').catch(() => console.log('  ℹ️  Wallets collection already exists'));

    // Transactions collection
    await database.createCollection('transactions').catch(() => console.log('  ℹ️  Transactions collection already exists'));

    console.log('✅ Database initialized successfully!');
    console.log('✨ You can now run: npm run dev');

    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    if (error.message.includes('connect ECONNREFUSED')) {
      console.error('\n⚠️  MongoDB is not running!');
      console.error('   Please install and start MongoDB first:');
      console.error('   1. Download: https://www.mongodb.com/try/download/community');
      console.error('   2. Run the installer with "Install as Service"');
      console.error('   3. MongoDB will start automatically');
      console.error('   4. Then run this script again');
    }
    process.exit(1);
  }
};

initializeDatabase();
