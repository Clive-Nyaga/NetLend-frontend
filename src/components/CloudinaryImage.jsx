import { AdvancedImage } from '@cloudinary/react';
import { cld } from '../utils/cloudinary';

const CloudinaryImage = ({ publicId, alt, width, height }) => {
  const image = cld.image(publicId);
  
  if (width) image.resize(`w_${width}`);
  if (height) image.resize(`h_${height}`);

  return <AdvancedImage cldImg={image} alt={alt} />;
};

export default CloudinaryImage;
