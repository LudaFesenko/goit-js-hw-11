import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchImages } from './js/fetchImages';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');

let page = 1;
let searchString = '';
let currentHits = 0;
let totalHits = 0;

const lightbox = new SimpleLightbox('.gallery a', {
  captions: false,
  captionsData: 'alt',
  captionDelay: 250,
});

function onSearch(event) {
  event.preventDefault();

  const value = event.target.elements.searchQuery.value.trim();

  if (!value) {
    return;
  }

  gallery.innerHTML = '';
  loadBtn.classList.add('hidden');
  page = 1;
  searchString = value;
  currentHits = 0;
  totalHits = 0;

  loadImages();
}

async function loadImages() {
  try {
    const resultResponse = await fetchImages(searchString, page);

    if (!resultResponse.hits.length) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    if (page === 1) {
      totalHits = resultResponse.totalHits;
      Notify.info(`Hooray! We found ${totalHits} images.`);
    }

    currentHits += resultResponse.hits.length;

    loadBtn.classList.remove('hidden');

    const galleryItems = resultResponse.hits.map(createListItem).join('');
    gallery.insertAdjacentHTML('beforeend', galleryItems);

    lightbox.refresh();

    if (page > 1) {
      scrollScreen();
    }
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

loadBtn.addEventListener('click', onLoadMore);

function onLoadMore() {
  if (currentHits > 0 && currentHits >= totalHits) {
    loadBtn.classList.remove('hidden');
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    return;
  }

  page += 1;

  loadImages();
}

form.addEventListener('submit', onSearch);

function createListItem({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<a href='${largeImageURL}'>
  <div class="photo-card">
  
    <img class = 'card-img' src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes ${likes}</b>
      </p>
      <p class="info-item">
        <b>Views ${views}</b>
      </p>
      <p class="info-item">
        <b>Comments ${comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads ${downloads}</b>
      </p>
    </div>
  </div>
  </a>`;
}

function scrollScreen() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
