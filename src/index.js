import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { refs } from './js/refs';
import { PixabayAPI } from './js/pixabayAPI';
import { createMarkup } from './js/createMarkup';

const pixabay = new PixabayAPI();

const options = {
  root: null,
  rootMargin: '100px',
  threshold: 1.0,
};
const callback = async function (entries, observer) {
  entries.forEach(async entry => {
    // if (entry.isIntersecting && entry.intersectionRect.bottom > 550) {
    if (entry.isIntersecting) {
      pixabay.incrementPage();
      observer.unobserve(entry.target);

      try {
        const { results } = await pixabay.getPhotos();

        const markup = createMarkup(results);

        refs.list.insertAdjacentHTML('beforeend', markup);
        if (pixabay.isShowLoadMore) {
          const target = document.querySelector('.gallery__item:last-child');
          io.observe(target);
        }
      } catch (error) {
        Notify.failure(error.message, 'Щось пішло не так!');
        clearPage();
      }
    }
  });
};
const io = new IntersectionObserver(callback, options);

const handleSubmit = async event => {
  event.preventDefault();

  const {
    elements: { query },
  } = event.currentTarget;
  const searchQuery = query.value.trim().toLowerCase();
  if (!searchQuery) {
    Notify.failure('Ввдедіть дані для пошуку!!!');
    return;
  }
  pixabay.query = searchQuery;

  clearPage();

  try {
    const { results, total } = await pixabay.getPhotos();
    if (results.length === 0) {
      Notify.info(`За вашим запитом
 ${searchQuery} зображень не знайдено!
`);
      return;
    }
    const markup = createMarkup(results);
    refs.list.insertAdjacentHTML('beforeend', markup);

    pixabay.calculateTotalPages(total);

    Notify.success(`Ми знайшли ${total} зображень по запиту ${searchQuery}`);

    if (pixabay.isShowLoadMore) {
      const target = document.querySelector('.gallery__item:last-child');
      console.log(target);

      io.observe(target);
    }
  } catch (error) {
    Notify.failure(error.message, 'Щось пішло не так!');
    clearPage();
  }
};

const onLoadMore = () => {
  pixabay.incrementPage();

  if (!pixabay.isShowLoadMore) {
    refs.loadMoreBtn.classList.add('is-hidden');
  }

  unsplash
    .getPhotos()
    .then(({ results }) => {
      const markup = createMarkup(results);
      refs.list.insertAdjacentHTML('beforeend', markup);
    })
    .catch(error => {
      Notify.failure(error.message, 'Щось пішло не так!');
      clearPage();
    });
};

refs.form.addEventListener('submit', handleSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function clearPage() {
  pixabay.resetPage();
  refs.list.innerHTML = '';
  refs.loadMoreBtn.classList.add('is-hidden');
}
