import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/firebase';

const uploadImages = async (images:File[],name:string) => {
    const uploadPromises = images.map(async (image, index) => {
      const imageName = `${name}_${index}`;
      const imageStorageRef = storageRef(storage, `postImages/${imageName}`);
      await uploadBytesResumable(imageStorageRef, image);
      const imageUrl = await getDownloadURL(imageStorageRef);
      return imageUrl;
    });

    const uploadedImageUrls = await Promise.all(uploadPromises);
    return uploadedImageUrls;
  };

export default uploadImages