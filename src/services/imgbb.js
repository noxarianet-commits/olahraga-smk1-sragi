import axios from 'axios';

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

export const uploadToImgBB = async (file) => {
    console.log('Starting ImgBB upload...');
    if (!IMGBB_API_KEY) {
        console.error('ImgBB API Key is missing! Check .env file.');
        throw new Error('ImgBB API Key is missing');
    }
    console.log('ImgBB API Key found (masked):', IMGBB_API_KEY.substring(0, 5) + '...');

    const formData = new FormData();
    formData.append('image', file);

    try {
        console.log('Sending request to ImgBB...');
        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, formData);
        console.log('ImgBB Response:', response.data);
        return {
            url: response.data.data.url,
            id: response.data.data.id
        };
    } catch (error) {
        console.error('ImgBB Upload Error:', error);
        if (error.response) {
            console.error('ImgBB Error Data:', error.response.data);
        }
        throw new Error('Failed to upload image. Please try again.');
    }
};
