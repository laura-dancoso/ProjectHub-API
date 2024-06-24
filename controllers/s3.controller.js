import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AWS_BUCKET_NAME, AWS_BUCKET_REGION } from '../config.js';
import crypto from 'crypto';


const s3 = new S3Client({
    region: AWS_BUCKET_REGION
});

export const getImgtUrl = async (imageKey) => {
    const getObjectParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: imageKey
    };

    try {
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command);
        return url;
    }
    catch (error) {
        console.error(error);
        return '';
    }
};

export const postImage = async (file, folder) => {
    const imageKey = `${folder}/${crypto.randomBytes(32).toString('hex')}${file.originalname}`;
    const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: imageKey,
        Body: file.buffer,
        ContentType: file.mimetype
    };
    try {
        const command = new PutObjectCommand(params);
        await s3.send(command);
        return imageKey;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}

export const deleteImage = async (imageKey) => {
    const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: imageKey
    }

    try{
        const command = new DeleteObjectCommand(params);
        await s3.send(command);
    }
    catch(error){
        console.error(error);
    }
}