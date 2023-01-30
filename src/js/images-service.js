const axios = require('axios').default;

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchImages() {
    let url = 'https://pixabay.com/api';
    let page = this.page;

    return axios
      .get(url, {
        params: {
          key: '33045581-3a3af9a2074d1c4024adb3324',
          q: this.searchQuery,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: 'true',
          per_page: '40',
          page: page,
        },
      })
      .then(response => {
        this.incrementPage();
        return response.data;
      });
  }

  incrementPage() {
    this.page += 1;
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
