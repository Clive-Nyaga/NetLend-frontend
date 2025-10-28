import { Cloudinary } from '@cloudinary/url-gen';

export const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'djyi5uaax'
  }
});

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'netlend_preset');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'djyi5uaax'}/image/upload`,
    { method: 'POST', body: formData }
  );

  return response.json();
};
