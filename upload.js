import { put } from '@vercel/blob';
import fs from 'fs';

async function upload() {
    const fileStream = fs.createReadStream('./public/models/harbinger.glb');
    const blob = await put('harbinger.glb', fileStream, { access: 'public' });
    console.log('File uploaded successfully: ', blob.url);
}

upload().catch(console.error);
