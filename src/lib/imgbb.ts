import axios from 'axios';

const IMGBB_API_KEY = '3cbe027d93b62219f7da7886c5a4ab37';
const IMGBB_UPLOAD_URL = 'https://api.imgbb.com/1/upload';

export interface ImageUploadResponse {
  success: boolean;
  data?: {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    width: string;
    height: string;
    size: number;
    time: string;
    expiration: string;
    image: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    thumb: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    medium?: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    delete_url: string;
  };
  error?: {
    message: string;
    code: number;
    context: string;
  };
}

export const uploadImageToImgBB = async (
  file: File,
  name?: string
): Promise<ImageUploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    if (name) {
      formData.append('name', name);
    }

    const response = await axios.post(
      `${IMGBB_UPLOAD_URL}?key=${IMGBB_API_KEY}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('ImgBB upload error:', error);
    return {
      success: false,
      error: {
        message: error.response?.data?.error?.message || error.message || 'Upload failed',
        code: error.response?.status || 500,
        context: 'imgbb_upload',
      },
    };
  }
};

export const uploadMultipleImages = async (
  files: File[],
  namePrefix?: string
): Promise<string[]> => {
  const uploadPromises = files.map((file, index) => {
    const name = namePrefix ? `${namePrefix}_${index + 1}` : undefined;
    return uploadImageToImgBB(file, name);
  });

  try {
    const results = await Promise.all(uploadPromises);
    return results
      .filter((result) => result.success && result.data)
      .map((result) => result.data!.display_url);
  } catch (error) {
    console.error('Multiple image upload error:', error);
    return [];
  }
};

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please use JPEG, PNG, GIF, or WebP images.',
    };
  }

  // Check file size (ImgBB limit is 32MB, we'll set 16MB to be safe)
  const maxSize = 16 * 1024 * 1024; // 16MB in bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size too large. Please use images smaller than 16MB.',
    };
  }

  return { valid: true };
};

export const compressImage = (
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Canvas to Blob conversion failed'));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => reject(new Error('Image loading failed'));
    img.src = URL.createObjectURL(file);
  });
};