const axios = require('axios').default;

export default class PixabayApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  async fetchCards() {
    console.log(this);
    const options = {
      key: '31315172-2dc97d1a120a1ae0bcd675878',
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      q: this.searchQuery,
      per_page: 40,
      page: this.page,
    };
    const url = `https://pixabay.com/api/`;

    const res = await axios.get(url, {
      params: {
        ...options,
      },
    });
    return res.data;
  }
  incrementPage() {
    this.page++;
  }
  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
