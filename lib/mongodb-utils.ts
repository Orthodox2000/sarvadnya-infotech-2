import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';
import { unstable_cache, revalidateTag } from 'next/cache';

export async function getDb() {
  const client = await clientPromise;
  return client.db();
}

export async function getCollection(name: string) {
  const db = await getDb();
  return db.collection(name);
}

// Settings helpers
async function fetchSettings() {
  const col = await getCollection('settings');
  const settings = await col.find({}).toArray();
  return settings.reduce((acc: any, curr: any) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});
}

export const getSettings = unstable_cache(
  async () => fetchSettings(),
  ['settings-map'],
  { revalidate: 18000, tags: ['settings'] }
);

export async function getSetting(key: string, defaultValue: string = '') {
  const settings = await getSettings();
  return settings[key] || defaultValue;
}

export async function updateSetting(key: string, value: string) {
  const col = await getCollection('settings');
  await col.updateOne(
    { key },
    { $set: { value, updatedAt: new Date() } },
    { upsert: true }
  );
  revalidateTag('settings', 'default');
}

// Applications helpers - No caching for submissions/admin views
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
async function fetchContent(section: string) {
  const col = await getCollection('site_content');
  const doc = await col.findOne({ section });
  return doc ? doc.content : null;
}

export async function getContent(section: string) {
  return unstable_cache(
    async () => fetchContent(section),
    [`content-${section}`],
    { revalidate: 18000, tags: ['content'] }
  )();
}

export async function updateContent(section: string, content: any) {
  const col = await getCollection('site_content');
  await col.updateOne(
    { section },
    { $set: { content, updatedAt: new Date() } },
    { upsert: true }
  );
  revalidateTag('content', 'default');
}

// Modules helpers
async function fetchModules() {
  const col = await getCollection('modules');
  return await col.find({}).sort({ createdAt: -1 }).toArray();
}

export const getModules = unstable_cache(
  async () => fetchModules(),
  ['modules-list'],
  { revalidate: 18000, tags: ['modules'] }
);

export async function getModule(id: string) {
  const modules = await getModules();
  return modules.find((m: any) => m.id === id || m._id.toString() === id);
}

export async function addModule(data: any) {
  const col = await getCollection('modules');
  const result = await col.insertOne({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  revalidateTag('modules', 'default');
  return result;
}

export async function updateModule(id: string, data: any) {
  const col = await getCollection('modules');
  const { _id, ...updateData } = data;
  const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id };
  const result = await col.updateOne(
    query,
    { $set: { ...updateData, updatedAt: new Date() } },
    { upsert: true }
  );
  revalidateTag('modules', 'default');
  return result;
}

export async function deleteModule(id: string) {
  const col = await getCollection('modules');
  const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id };
  const result = await col.deleteOne(query);
  revalidateTag('modules', 'default');
  return result;
}

// Tutorials/Learning helpers
async function fetchTutorials() {
  const col = await getCollection('learning_content');
  return await col.find({}).sort({ createdAt: -1 }).toArray();
}

export const getTutorials = unstable_cache(
  async () => fetchTutorials(),
  ['tutorials-list'],
  { revalidate: 18000, tags: ['tutorials'] }
);

export async function addTutorial(data: any) {
  const col = await getCollection('learning_content');
  const result = await col.insertOne({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  revalidateTag('tutorials', 'default');
  return result;
}

export async function updateTutorial(id: string, data: any) {
  const col = await getCollection('learning_content');
  const { _id, ...updateData } = data;
  const result = await col.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...updateData, updatedAt: new Date() } }
  );
  revalidateTag('tutorials', 'default');
  return result;
}

export async function deleteTutorial(id: string) {
  const col = await getCollection('learning_content');
  const result = await col.deleteOne({ _id: new ObjectId(id) });
  revalidateTag('tutorials', 'default');
  return result;
}

// Reviews helpers
async function fetchReviews() {
  const col = await getCollection('reviews');
  return await col.find({}).sort({ createdAt: -1 }).limit(4).toArray();
}

export const getReviews = unstable_cache(
  async () => fetchReviews(),
  ['reviews-list'],
  { revalidate: 18000, tags: ['reviews'] }
);

export async function addReview(data: any) {
  const col = await getCollection('reviews');
  const count = await col.countDocuments();
  if (count >= 4) {
    throw new Error('Maximum of 4 reviews reached. Please remove one before adding a new one.');
  }
  const result = await col.insertOne({
    ...data,
    createdAt: new Date()
  });
  revalidateTag('reviews', 'default');
  return result;
}

export async function deleteReview(id: string) {
  const col = await getCollection('reviews');
  const result = await col.deleteOne({ _id: new ObjectId(id) });
  revalidateTag('reviews', 'default');
  return result;
}

// Partners helpers
async function fetchPartners(type?: string) {
  const col = await getCollection('partners');
  const query = type ? { type } : {};
  return await col.find(query).sort({ createdAt: 1 }).toArray();
}

export async function getPartners(type?: string) {
  return unstable_cache(
    async () => fetchPartners(type),
    [`partners-list-${type || 'all'}`],
    { revalidate: 18000, tags: ['partners'] }
  )();
}

export async function getPartnersByType(type: string) {
  return await fetchPartners(type);
}

export async function addPartner(data: any) {
  const col = await getCollection('partners');
  const result = await col.insertOne({
    ...data,
    createdAt: new Date()
  });
  revalidateTag('partners', 'default');
  return result;
}

export async function updatePartner(id: string, data: any) {
  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid ID format');
  }
  const col = await getCollection('partners');
  const { _id, ...updateData } = data;
  const result = await col.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...updateData, updatedAt: new Date() } }
  );
  revalidateTag('partners', 'default');
  return result;
}

export async function deletePartner(id: string) {
  if (!ObjectId.isValid(id)) {
    throw new Error('Invalid ID format');
  }
  const col = await getCollection('partners');
  const result = await col.deleteOne({ _id: new ObjectId(id) });
  revalidateTag('partners', 'default');
  return result;
}

