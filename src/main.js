import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const apiKey = '10909963-d091288ea5fbb5ccebadc5240';
let page = 1;
let searchQuery = '';

loadMoreBtn.style.display = 'none';

searchForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  page = 1;
  searchQuery = this.searchQuery.value.trim();

  if (searchQuery === '') {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search query.',
    });
    return;
  }

  try {
    const images = await fetchImages(searchQuery, page);
    displayImages(images);
    checkLoadMoreBtnVisibility(images.length);
  } catch (error) {
    console.error('Помилка запиту:', error);
    iziToast.error({
      title: 'Error',
      message: 'An error occurred while fetching data. Please try again later.',
    });
  }
});

loadMoreBtn.addEventListener('click', async function () {
  try {
    page += 1;
    const images = await fetchImages(searchQuery, page);
    displayImages(images);
    checkLoadMoreBtnVisibility(images.length);
  } catch (error) {
    console.error('Помилка запиту:', error);
    iziToast.error({
      title: 'Error',
      message: 'An error occurred while fetching data. Please try again later.',
    });
  }
});

async function fetchImages(query, page) {
  const response = await axios.get('https://pixabay.com/api/', {
    params: {
      key: apiKey,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page,
    },
  });

  if (response.data.hits.length === 0) {
    iziToast.info({
      title: 'Info',
      message: "Sorry, there are no images matching your search query. Please try again.",
    });
  }

  return response.data.hits;
}

function displayImages(images) {
  if (page === 1) {
    gallery.innerHTML = '';
  }

  images.forEach(image => {
    const card = document.createElement('div');
    card.className = 'photo-card';

    const img = document.createElement('img');
    img.src = image.webformatURL;
    img.className = 'image';
    img.alt = image.tags;
    img.loading = 'lazy';

    const info = document.createElement('div');
    info.className = 'info';

    const likes = document.createElement('p');
    likes.className = 'info-item';
    likes.innerHTML = `<b>Likes:</b> ${image.likes}`;

    const views = document.createElement('p');
    views.className = 'info-item';
    views.innerHTML = `<b>Views:</b> ${image.views}`;

    const comments = document.createElement('p');
    comments.className = 'info-item';
    comments.innerHTML = `<b>Comments:</b> ${image.comments}`;

    const downloads = document.createElement('p');
    downloads.className = 'info-item';
    downloads.innerHTML = `<b>Downloads:</b> ${image.downloads}`;

    info.appendChild(likes);
    info.appendChild(views);
    info.appendChild(comments);
    info.appendChild(downloads);

    card.appendChild(img);
    card.appendChild(info);

    gallery.appendChild(card);
  });
}

function checkLoadMoreBtnVisibility(imagesCount) {
  if (imagesCount < 40) {
    loadMoreBtn.style.display = 'none';
    if (imagesCount === 0) {
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
  } else {
    loadMoreBtn.style.display = 'block';
  }
}
