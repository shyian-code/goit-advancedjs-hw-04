import axios from 'axios';
import Notiflix from 'notiflix';

// Отримуємо посилання на форму та галерею
const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');

// Отримайте API ключ Pixabay та вставте його тут
const apiKey = '10909963-d091288ea5fbb5ccebadc5240';

// Додаємо обробник подачі форми
searchForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  // Отримуємо значення, введене користувачем
  const searchQuery = this.searchQuery.value;

  // Виконуємо HTTP-запит до API Pixabay
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: apiKey,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 20, // Кількість результатів на сторінці (змініть на потрібне значення)
      },
    });

    // Очищаємо галерею перед додаванням нових зображень
    gallery.innerHTML = '';

    // Обробляємо отримані дані та додаємо картки зображень до галереї
    const images = response.data.hits;

    if (images.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    } else {
      images.forEach((image) => {
        const card = document.createElement('div');
        card.className = 'photo-card';

        const img = document.createElement('img');
        img.src = image.webformatURL;
        img.className = "image";
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
  } catch (error) {
    console.error('Помилка запиту:', error);
  }
});
