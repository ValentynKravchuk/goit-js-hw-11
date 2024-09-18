import { fetchImages } from './js/pixabay-api';
import { renderImages } from './js/render-functions';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('#gallery');
const loader = document.querySelector('.loader');

form.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();
  gallery.innerHTML = '';
  const query = event.target.elements['search-query'].value.trim();

  if (query === '') {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search query!',
    });
    return;
  }

  fetchAndRenderImages(query);
}

function fetchAndRenderImages(query) {
  loader.style.display = 'block';

  fetchImages(query)
    .then(({ hits, totalHits }) => {
      loader.style.display = 'none';

      if (hits.length === 0) {
        iziToast.warning({
          title: 'No Results',
          message:
            'Sorry, there are no images matching your search query. Please try again!',
          position: 'topRight',
        });
        return;
      }

      renderImages(hits);
      const lightbox = new SimpleLightbox('.gallery a');
      lightbox.refresh();

      if (totalHits === 0) {
        iziToast.info({
          title: 'No Results',
          message: 'No results found!',
          position: 'topRight',
        });
      } else {
        iziToast.success({
          title: 'Success',
          message: `Found ${totalHits} images!`,
          position: 'topRight',
        });
      }
    })
    .catch(error => {
      loader.style.display = 'none';
      iziToast.error({
        title: 'Error',
        message: error.message,
        position: 'topRight',
      });
    });
}
