import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
axios.defaults.headers.common['Authorization'] = 'Client-ID u_79wq4chor4';

export class PixabayAPI {
  #page = 1;
  #query = '';
  #totalPages = 0;
  #perPage = 40;
  #params = {
    params: {
      key: '30554717 - dcc80d5299a215984c1269f52',
      q: 'all images',
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
    },
  };

  async getPhotos() {
    const urlAXIOS = `/search/photos?page=${this.#page}&query=${this.#query}`;
    const { data } = await axios.get(urlAXIOS, this.#params);
    return data;
  }

  set query(newQuery) {
    this.#query = newQuery;
  }

  get query() {
    return this.#query;
  }

  incrementPage() {
    this.#page += 1;
  }

  resetPage() {
    this.#page = 1;
  }
  calculateTotalPages(total) {
    this.#totalPages = Math.ceil(total / this.#perPage);
  }

  get isShowLoadMore() {
    return this.#page < this.#totalPages;
  }
}
