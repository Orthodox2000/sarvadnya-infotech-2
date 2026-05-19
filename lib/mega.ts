import { Storage } from 'megajs';

const email = process.env.MEGA_EMAIL;
const password = process.env.MEGA_PASSWORD;

export async function uploadToMega(file: File, folderName: string = 'resumes') {
  if (!email || !password) {
    throw new Error('Mega.nz credentials are not configured in environment variables.');
  }

  const storage = await new Storage({
    email,
    password
  }).ready;

  // Find or create folder
  let folder = storage.root.children?.find(c => c.name === folderName && c.directory);
  if (!folder) {
    folder = await storage.mkdir(folderName);
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const megaFile = await storage.upload(file.name, buffer).complete;

  // Move to folder if specified
  if (folder) {
    await (megaFile as any).moveTo(folder);
  }

  // Get a shareable link (true ensures the key is included)
  let link = await (megaFile as any).link(true);
  
  // Safety check: if the link doesn't contain a '#', manually append the key using Mega-style base64
  if (link && !link.includes('#')) {
    const key = (megaFile as any).key;
    if (key && Buffer.isBuffer(key)) {
       // Mega uses a specific URL-safe base64: + -> -, / -> _, and remove = padding
       const megaKey = key.toString('base64')
         .replace(/\+/g, '-')
         .replace(/\//g, '_')
         .replace(/=/g, '');
       
       // Construct the full link if it's missing the key
       if (link.includes('/file/')) {
         link = `${link}#${megaKey}`;
       } else if (link.includes('/#!')) {
         // Old format support
         link = `${link}!${megaKey}`;
       }
    }
  }

  return link;
}

export async function deleteFromMega(link: string) {
  // Deleting by link is complex with megajs, usually you'd need the file object.
  // For now, we'll focus on upload and retrieval.
}
