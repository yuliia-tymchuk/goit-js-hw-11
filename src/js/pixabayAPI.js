import axios from 'axios';

// axios.defaults.baseURL = 'https://pixabay.com/api/';
// axios.defaults.headers.common['Authorization'] =
//   'key 30554717-dcc80d5299a215984c1269f52';

export class PixabayAPI {
  #page = 1;
  #query = '';
  #totalPages = 0;
  #perPage = 40;
  // #params = {
  //   params: {
  //     key: '30554717-dcc80d5299a215984c1269f52',
  //     q: '',
  //     image_type: 'photo',
  //     orientation: 'horizontal',
  //     safesearch: 'true',
  //   },
  // };

  getPhotos() {
    const url = `https://pixabay.com/api/?key=30554717-dcc80d5299a215984c1269f52&q=${
      this.#query
    }&image_type=photo&page=${this.#page}&per_page=${
      this.#perPage
    }&orientation=horizontal&safesearch=true`;
    return fetch(url).then(response => {
      if (!response.ok) {
        throw new Error(response.status);
        return response.json();
      }
    });
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
