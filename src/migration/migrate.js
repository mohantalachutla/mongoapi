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
    // Import models
    modal = {
      account: require('../model/account.model.js'),
      app: require('../model/app.model.js'),
      activity: require('../model/activity.model.js'),
    };
    try {
      const files = await fs.readdir(getStoreLocation(), {
        withFileTypes: true,
      });
      for (const file of files) {
        if (file.isFile() && file.name.endsWith('.json')) {
          const filePath = path.join(getStoreLocation(), file.name);
          const content = await fs.readFile(filePath, 'utf-8');
          const fileData = JSON.parse(content);
          data[file.name.replace('.json', '')] = fileData.default || fileData; // Handle ES module exports
        }
      }
    } catch (err) {
      console.error(err);
    }
    // // Define paths for JSON files
    // const dataFiles = {
    //   account: path.resolve(__dirname, './data/account.json'),
    //   app: path.resolve(__dirname, './data/app.json'),
    //   activity: path.resolve(__dirname, './data/activity.json'),
    // };

    // Load JSON data if files exist
    // await Promise.all(
    //   Object.entries(dataFiles).map(async ([key, filePath]) => {
    //     if (await checkFileExists(filePath)) {
    //       const fileData = await import(filePath);
    //       data[key] = fileData.default || fileData; // Handle ES module exports
    //     }
    //   })
    // );
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
