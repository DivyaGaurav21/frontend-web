import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: "dq0jrieog",
  api_key: "569736593621861",
  api_secret: "jkbRbzeNl3lnMmlN6EC_7vyhZQ8",
});

export const uploadImage = async (buffer: Buffer, folder: string = 'products'): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { width: 800, height: 600, crop: 'limit', quality: 'auto:good' }
        ]
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result!.secure_url);
      }
    ).end(buffer);
  });
};

export const deleteImage = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};

export default cloudinary;