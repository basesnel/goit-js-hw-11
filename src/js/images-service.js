const axios = require('axios').default;

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.success = false;
    this.countHits = 0;
    this.endOfSearch = false;
  }

  async fetchImages() {
    let url = 'https://pixabay.com/api/';
    let page = this.page;

    const response = await axios.get(url, {
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
    });
    const data = response.data;
    this.incrementPage();

    if (!data.totalHits) throw new Error();

    if (!(this.page > 2) && data.totalHits) {
      this.success = true;
    } else {
      this.success = false;
    }

    this.countHits += data.hits.length;

    this.endOfSearch = false;
    if (this.countHits === data.totalHits) {
      this.endOfSearch = true;
    }
    return data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  resetCountHits() {
    this.countHits = 0;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
