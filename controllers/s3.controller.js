import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AWS_BUCKET_NAME, AWS_BUCKET_REGION, BUCKET_PROJECTS_FILE } from '../config.js';

const s3 = new S3Client({
    region: AWS_BUCKET_REGION
});

export const getImgtUrl = async (imageKey) => {
    const getObjectParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: imageKey
    };

    try{
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command);
        return url;
    }
    catch(error){
        console.log(error);
        return '';
    }
};