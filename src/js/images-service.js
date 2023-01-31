const axios = require('axios').default;

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImages() {
    let url = 'https://pixabay.com/api/';
    let page = this.page;

    const res = await axios
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
        headers: {
          'Content-Type': 'application/json',
        },
        maxRedirects: 0,
      })
      .then(response => {
        this.incrementPage();
        console.log(response);
        return response.data;
      });
    return res;
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
