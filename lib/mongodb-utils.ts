import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';

export async function getDb() {
  const client = await clientPromise;
  return client.db();
}

export async function getCollection(name: string) {
  const db = await getDb();
  return db.collection(name);
}

// Settings helpers
export async function getSettings() {
  const col = await getCollection('settings');
  const settings = await col.find({}).toArray();
  return settings.reduce((acc: any, curr: any) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});
}

export async function getSetting(key: string, defaultValue: string = '') {
  const col = await getCollection('settings');
  const setting = await col.findOne({ key });
  return setting ? setting.value : defaultValue;
}

export async function updateSetting(key: string, value: string) {
  const col = await getCollection('settings');
  await col.updateOne(
    { key },
    { $set: { value, updatedAt: new Date() } },
    { upsert: true }
  );
}

// Applications helpers
export async function saveApplication(data: any) {
  const col = await getCollection('job_applications');
  return await col.insertOne({
    ...data,
    createdAt: new Date()
  });
}

export async function getApplications() {
  const col = await getCollection('job_applications');
  return await col.find({}).sort({ createdAt: -1 }).toArray();
}

// Content helpers
export async function getContent(section: string) {
  const col = await getCollection('site_content');
  const doc = await col.findOne({ section });
  return doc ? doc.content : null;
}

export async function updateContent(section: string, content: any) {
  const col = await getCollection('site_content');
  await col.updateOne(
    { section },
    { $set: { content, updatedAt: new Date() } },
    { upsert: true }
  );
}

// Modules helpers
export async function getModules() {
  const col = await getCollection('modules');
  return await col.find({}).sort({ createdAt: -1 }).toArray();
}

export async function getModule(id: string) {
  const col = await getCollection('modules');
  return await col.findOne({ $or: [{ id }, { _id: new ObjectId(id) }] });
}

export async function addModule(data: any) {
  const col = await getCollection('modules');
  return await col.insertOne({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

export async function updateModule(id: string, data: any) {
  const col = await getCollection('modules');
  const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id };
  return await col.updateOne(
    query,
    { $set: { ...data, updatedAt: new Date() } },
    { upsert: true }
  );
}

export async function deleteModule(id: string) {
  const col = await getCollection('modules');
  const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id };
  return await col.deleteOne(query);
}

// Tutorials/Learning helpers
export async function getTutorials() {
  const col = await getCollection('learning_content');
  return await col.find({}).sort({ createdAt: -1 }).toArray();
}

export async function addTutorial(data: any) {
  const col = await getCollection('learning_content');
  return await col.insertOne({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

export async function updateTutorial(id: string, data: any) {
  const col = await getCollection('learning_content');
  return await col.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } }
  );
}

export async function deleteTutorial(id: string) {
  const col = await getCollection('learning_content');
  return await col.deleteOne({ _id: new ObjectId(id) });
}

// Reviews helpers
export async function getReviews() {
  const col = await getCollection('reviews');
  return await col.find({}).sort({ createdAt: -1 }).limit(4).toArray();
}

export async function addReview(data: any) {
  const col = await getCollection('reviews');
  const count = await col.countDocuments();
  if (count >= 4) {
    throw new Error('Maximum of 4 reviews reached. Please remove one before adding a new one.');
  }
  return await col.insertOne({
    ...data,
    createdAt: new Date()
  });
}

export async function deleteReview(id: string) {
  const col = await getCollection('reviews');
  return await col.deleteOne({ _id: new ObjectId(id) });
}

// Partners helpers
export async function getPartners() {
  const col = await getCollection('partners');
  return await col.find({}).sort({ createdAt: 1 }).toArray();
}

export async function addPartner(data: any) {
  const col = await getCollection('partners');
  return await col.insertOne({
    ...data,
    createdAt: new Date()
  });
}

export async function deletePartner(id: string) {
  const col = await getCollection('partners');
  return await col.deleteOne({ _id: new ObjectId(id) });
}
