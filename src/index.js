import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import PixabayApiService from './js/api-service';

const axios = require('axios').default;

const searchForm = document.querySelector('.search-form');
const galleryContainer = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
const pixabayApiService = new PixabayApiService();
btnLoadMore.hidden = true;
searchForm.addEventListener('submit', onSearchSubmit);
btnLoadMore.addEventListener('click', onLoadMoreClick);
const lightbox = new SimpleLightbox('.gallery a');
async function onSearchSubmit(e) {
  e.preventDefault();

  galleryContainer.innerHTML = '';
  pixabayApiService.query = e.currentTarget.elements.searchQuery.value;
  pixabayApiService.resetPage();
  const arrCards = await pixabayApiService.fetchCards();

  if (arrCards.hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  Notiflix.Notify.success(`Hooray! We found ${arrCards.totalHits} images.`);
  console.log(pixabayApiService.page);
  appendCardMarkup(arrCards);
  pixabayApiService.incrementPage();
  btnLoadMore.hidden = false;
  lightbox.refresh();

  checkIfEnd(arrCards);
}

async function onLoadMoreClick() {
  const addArrCards = await pixabayApiService.fetchCards();
  appendCardMarkup(addArrCards);
  pixabayApiService.incrementPage();
  lightbox.refresh();
  smoothScrolling();
  checkIfEnd(addArrCards);
}

function smoothScrolling() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
function checkIfEnd(arr) {
  if (arr.hits.length < 40) {
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    btnLoadMore.hidden = true;
    return;
  }
}

function appendCardMarkup(arrCards) {
  let galleryCardsHTML = '';
  arrCards.hits.map(
    ({
      largeImageURL,
      webformatURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) =>
      (galleryCardsHTML += `<div class="photo-card">
      <a class="gallery__item" href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        <span>${likes}</span>
      </p>
      <p class="info-item">
        <b>Views</b>
        <span>${views}</span>
      </p>
      <p class="info-item">
        <b>Comments</b>
        <span>${comments}</span>
      </p>
      <p class="info-item">
        <b>Downloads</b>
        <span>${downloads}</span>
      </p>
    </div>
  </div>`)
  );
  galleryContainer.insertAdjacentHTML('beforeend', galleryCardsHTML);
}
