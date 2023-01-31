import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import ImagesApiService from './js/images-service';
import LoadMoreBtn from './js/load-more-btn';

const refs = {
  searchForm: document.querySelector('#search-form'),
  imagesContainer: document.querySelector('.gallery'),
};

const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  hidden: true,
});

const imagesApiService = new ImagesApiService();
let countHits = 0;

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();

  imagesApiService.query = this.searchQuery.value.trim();
  this.searchQuery.value = imagesApiService.query;

  if (imagesApiService.query === '') {
    clearImagesContainer();
    return Notify.warning('Please enter no empty value.');
  }

  countHits = 0;
  loadMoreBtn.hide();
  imagesApiService.resetPage();
  clearImagesContainer();

  toFetchImages();
}

function onLoadMore() {
  toFetchImages();
}

async function toFetchImages() {
  try {
    loadMoreBtn.disable();
    const imagesData = await imagesApiService.fetchImages();

    console.log(imagesData);

    if (!imagesData.totalHits) throw new Error();

    if (!(imagesApiService.page > 2) && imagesData.totalHits) {
      Notify.success(`Hooray! We found ${imagesData.totalHits} images.`);
    }

    loadMoreBtn.show();

    const { height: galleryBottom } = document
      .querySelector('.gallery')
      .getBoundingClientRect();

    appendImagesMarkup(imagesData.hits);

    window.scrollBy({
      top: galleryBottom - window.pageYOffset,
      behavior: 'smooth',
    });

    countHits += imagesData.hits.length;
    if (countHits === imagesData.totalHits) {
      loadMoreBtn.hide();
      return Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }

    loadMoreBtn.enable();
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function appendImagesMarkup(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<a class="photo-link" href="${largeImageURL}">
    <div class="photo-card">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes</b> ${likes}
        </p>
        <p class="info-item">
          <b>Views</b> ${views}
        </p>
        <p class="info-item">
          <b>Comments</b> ${comments}
        </p>
        <p class="info-item">
          <b>Downloads</b> ${downloads}
        </p>
      </div>
    </div>
  </a>\n`
    )
    .join('');

  // console.log(markup);
  refs.imagesContainer.insertAdjacentHTML('beforeend', markup);

  const options = { captionsData: 'alt', captionDelay: 250 };

  var lightbox = new SimpleLightbox('.gallery a', options);
  lightbox.refresh();
}

function clearImagesContainer() {
  refs.imagesContainer.innerHTML = '';
}
