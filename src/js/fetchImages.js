import axios from 'axios';

const API_KEY = '32854293-fb2a2a0a3c3e1264f7d7323de';
const URL = 'https://pixabay.com/api/';

export async function fetchImages(searchString, page) {
  const response = await axios.get(URL, {
    params: {
      page,
      per_page: 40,
      key: API_KEY,
      q: searchString,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    },
  });

  return response.data;
}
