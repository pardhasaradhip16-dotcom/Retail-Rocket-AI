import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Product } from '../models/Product.js';
import { Visitor } from '../models/Visitor.js';
import { Event } from '../models/Event.js';
import { PricePreference } from '../models/PricePreference.js';
import { User } from '../models/User.js';
import { PRODUCT_CATALOG } from '../services/recommendationEngine.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedDatabase() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/retailrocket';
  console.log(`Connecting to MongoDB at ${mongoUri}...`);

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB.');

    // 1. Seed Products
    console.log('Clearing old products and seeding catalog...');
    await Product.deleteMany({});
    const productDocs = Object.values(PRODUCT_CATALOG).map(p => ({
      item_id: p.item_id,
      name: p.name,
      category: p.category,
      price: p.price,
      price_num: p.price_num,
      image: p.image,
      description: p.description || '',
      stock: 100,
      rating: 4.8
    }));
    await Product.insertMany(productDocs);
    console.log(`✓ Inserted ${productDocs.length} products.`);

    // 2. Parse and seed events
    const csvPath = path.resolve(__dirname, '../../data/events.csv');
    if (fs.existsSync(csvPath)) {
      console.log('Clearing old events and seeding from data/events.csv...');
      await Event.deleteMany({});
      const rawContent = fs.readFileSync(csvPath, 'utf8');
      const lines = rawContent.trim().split('\n');
      const eventDocs = [];
      const visitorStats = {};

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const [timestamp, visitorid, event, itemid, transactionid] = line.split(',');
        if (visitorid && itemid && event) {
          const v = String(visitorid).trim();
          const e = String(event).trim();
          const iId = String(itemid).trim();
          const ts = Number(timestamp) || Date.now();

          eventDocs.push({
            timestamp: ts,
            visitor_id: v,
            event: e,
            item_id: iId,
            transaction_id: transactionid ? String(transactionid).trim() : ''
          });

          if (!visitorStats[v]) {
            visitorStats[v] = { views: 0, addtocart: 0, transactions: 0 };
          }
          if (e === 'view') visitorStats[v].views++;
          else if (e === 'addtocart') visitorStats[v].addtocart++;
          else if (e === 'transaction') visitorStats[v].transactions++;
        }
      }

      await Event.insertMany(eventDocs);
      console.log(`✓ Inserted ${eventDocs.length} events.`);

      // 3. Seed Visitors
      console.log('Seeding visitors and interaction statistics...');
      await Visitor.deleteMany({});
      const visitorDocs = Object.entries(visitorStats).map(([vid, stat]) => {
        const score = stat.views * 1.0 + stat.addtocart * 3.0 + stat.transactions * 5.0;
        return {
          visitor_id: vid,
          total_views: stat.views,
          total_add_to_cart: stat.addtocart,
          total_transactions: stat.transactions,
          interaction_score: Number(score.toFixed(1)),
          last_active: new Date()
        };
      });
      await Visitor.insertMany(visitorDocs);
      console.log(`✓ Inserted ${visitorDocs.length} visitors.`);

      // 4. Seed initial Price Preference sample
      await PricePreference.deleteMany({});
      await PricePreference.create({
        visitor_id: "1000294",
        min_price: 5000,
        max_price: 50000
      });
      console.log('✓ Inserted default price preference.');

      // 5. Seed Demo Users with Hashed Credentials
      console.log('Seeding pre-configured authentication credentials...');
      await User.deleteMany({});
      const demoUsers = [
        {
          name: "Judge Evaluator",
          email: "judge@retailrocket.ai",
          password: await bcrypt.hash("judge123", 10),
          visitor_id: "1000294",
          role: "judge"
        },
        {
          name: "Alex Rivera",
          email: "alex@retailrocket.ai",
          password: await bcrypt.hash("audio123", 10),
          visitor_id: "1000290",
          role: "shopper"
        },
        {
          name: "David Chen",
          email: "david@retailrocket.ai",
          password: await bcrypt.hash("tech123", 10),
          visitor_id: "1000291",
          role: "shopper"
        }
      ];
      await User.insertMany(demoUsers);
      console.log(`✓ Inserted ${demoUsers.length} initial user accounts.`);
    }

    console.log('\n=======================================');
    console.log(' MongoDB Seeding Completed Successfully! ');
    console.log('=======================================\n');
    process.exit(0);
  } catch (err) {
    console.warn('\n[Seeding Notice] MongoDB connection not available during build step:', err.message);
    console.warn('[Seeding Notice] App will operate in resilient standalone in-memory mode, or connect when MONGO_URI is active.\n');
    process.exit(0);
  }
}

seedDatabase();
