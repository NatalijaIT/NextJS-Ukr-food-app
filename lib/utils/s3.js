import { S3 } from '@aws-sdk/client-s3';

const s3 = new S3({
    region: 'ap-southeast-2',
});

const BUCKET_NAME = 'natalievirt-nextjs-users-image';

export async function uploadImageToS3(file, fileName) {
    const bufferedImage = await file.arrayBuffer();

    await s3.putObject({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: Buffer.from(bufferedImage),
        ContentType: file.type,
    });

    return fileName;
}
