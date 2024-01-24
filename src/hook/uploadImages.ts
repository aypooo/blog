import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/firebase';
import Resizer from 'react-image-file-resizer';

const resizeImage = (image:File) =>
new Promise<Blob>((resolve) => {
  Resizer.imageFileResizer(
    image,
    700, // 원하는 가로 크기로 조절
    700, // 원하는 세로 크기로 조절
    'JPEG',
    80, // 이미지 품질 (0 ~ 100)
    0,
    (uri) => {
      const blobUri = uri as Blob;
      resolve(blobUri);
    },
    'blob'
  );
});

const uploadImages = async (images:File[],name:string) => {
    const uploadPromises = images.map(async (image, index) => {
      const imageName = `${name}_${index}`;
      const imageStorageRef = storageRef(storage, `postImages/${imageName}`);
      const resizedImage = await resizeImage(image);
      await uploadBytesResumable(imageStorageRef, resizedImage);
      const imageUrl = await getDownloadURL(imageStorageRef);
      return imageUrl;
    });

    const uploadedImageUrls = await Promise.all(uploadPromises);
    return uploadedImageUrls;
  };


export default uploadImages

