import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { refs } from './js/refs';
import { PixabayAPI } from './js/pixabayAPI';
import { createMarkup } from './js/createMarkup';
import { spinnerPlay, spinnerStop } from './js/spinner';

const options = {
  root: null,
  rootMargin: '100px',
  threshold: 1.0,
};
const callback = async function (entries, observer) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      pixabay.incrementPage();
      observer.unobserve(entry.target);

      try {
        const { hits } = await pixabay.getPhotos();
        const markup = createMarkup(hits);
        refs.list.insertAdjacentHTML('beforeend', markup);

        if (pixabay.isShowLoadMore) {
          const target = document.querySelector('.gallery a:last-child');
          io.observe(target);
        } else
          Notify.info(
            "We're sorry, but you've reached the end of search result."
          );
        skrollPage();
        gallery.refresh();
      } catch (error) {
        console.lod(error);
        clearPage();
      } finally {
        spinnerStop();
      }
    }
  });
};
const io = new IntersectionObserver(callback, options);

const pixabay = new PixabayAPI();

var gallery = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

async function handleSubmit(event) {
  event.preventDefault();

  const {
    elements: { searchQuery },
  } = event.currentTarget;

  const query = searchQuery.value.trim().toLowerCase();

  if (!searchQuery) {
    Notify.failure('Please, enter data to search.');
    return;
  }
  pixabay.query = query;

  clearPage();

  try {
    spinnerPlay();
    const { hits, total, totalHits } = await pixabay.getPhotos();
    if (hits.length === 0) {
      Notify.success(`Sorry, there are no images matching your search query. Please try again.
`);
      return;
    }
    const markup = createMarkup(hits);
    refs.list.insertAdjacentHTML('beforeend', markup);

    gallery.refresh();

    Notify.info(`Hooray! We found ${totalHits} images`);
    pixabay.calculateTotalPages(total);

    if (pixabay.isShowLoadMore) {
      const target = document.querySelector('.gallery a:last-child');
      io.observe(target);
    }
  } catch (error) {
    console.log(error);
    clearPage();
  } finally {
    spinnerStop();
  }
}

async function onLoadMore() {
  pixabay.incrementPage();

  if (!pixabay.isShowLoadMore) {
    refs.loadMoreBtn.classList.add('is-hidden');
    Notify.info("We're sorry, but you've reached the end of search result.");
  }

  try {
    const { hits } = await pixabay.getPhotos();
    const markup = createMarkup(hits);
    refs.list.insertAdjacentHTML('beforeend', markup);
    scrollPage();
    gallery.refresh();
  } catch (error) {
    console.log(error);
    clearPage();
  } finally {
    spinnerStop();
  }
}

refs.form.addEventListener('submit', handleSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function clearPage() {
  pixabay.resetPage();
  refs.list.innerHTML = '';
  refs.loadMoreBtn.classList.add('is-hidden');
}

function scrollPage() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });
}
