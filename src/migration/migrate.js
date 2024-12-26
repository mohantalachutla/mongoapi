import fs from 'fs/promises';
import path from 'path';
import _ from 'lodash';
import { isEmpty } from '../util/lang.utils';

const getStoreLocation = () => {
  let defaultLocation = path.resolve(process.cwd(), 'migration', 'data');
  if (isEmpty(process.env.MIGRATION_STORE)) {
    return defaultLocation;
  }
  try {
    path.isAbsolute(process.env.MIGRATION_STORE)
      ? process.env.MIGRATION_STORE
      : path.resolve(process.cwd(), process.env.MIGRATION_STORE);
  } catch {
    return defaultLocation;
  }
};

const initiateMigration = async () => {
  let modal = {};
  let data = {};
  console.log('Attempting migration');
  try {
    const STORE_LOCATION = getStoreLocation();
    console.log('Migration store location:', STORE_LOCATION);
    // Import models
    modal = {
      account: require('../model/account.model.js'),
      app: require('../model/app.model.js'),
      activity: require('../model/activity.model.js'),
      product: require('../model/product.model.js'),
    };
    try {
      const files = await fs.readdir(STORE_LOCATION, {
        withFileTypes: true,
      });
      for (const file of files) {
        if (file.isFile() && file.name.endsWith('.json')) {
          const filePath = path.join(STORE_LOCATION, file.name);
          const content = await fs.readFile(filePath, 'utf-8');
          const fileData = JSON.parse(content);
          data[file.name.replace('.json', '')] = fileData.default || fileData; // Handle ES module exports
        }
      }
    } catch (err) {
      console.error(err);
    }
  } catch (err) {
    console.error('Error initializing migration:', err);
    return; // Exit migration on initialization failure
  }
  console.log('Initializing migration...');
  // Process data for each collection
  Object.entries(data).forEach(async ([key, records = []]) => {
    if (isEmpty(records) || !_.isArray(records)) return;
    const Collection = modal[key]?.default || modal[key];
    if (!Collection) return;
    records.forEach(async (record) => {
      try {
        let exists = [];
        if (isEmpty(record)) return;
        const { find, data: insertRecord } = record;
        if (!isEmpty(find)) {
          exists = await Collection.find(find).lean().exec();
        }
        if (isEmpty(exists)) {
          const collection = new Collection(insertRecord);
          await collection.save();
          // console.log(`Inserted default data into ${key} collection.`);
        } else {
          // console.log(`${key} collection already initialized.`);
        }
      } catch (err) {
        console.error(`Error processing ${key} collection:`, err);
      }
    });
  });
  console.log('Migration completed.');
};

export default initiateMigration;
