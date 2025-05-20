const reviews = document.querySelectorAll('.review');
const prevBtn = document.querySelector('.carousel-controls .prev');
const nextBtn = document.querySelector('.carousel-controls .next');

let currentIndex = 0;

function updateReviews() {
  const total = reviews.length;

  reviews.forEach((review, i) => {
    review.classList.remove('prev', 'active', 'next');
    review.style.transition = 'transform 0.8s ease, opacity 0.8s ease';
  });

  const prevIndex = (currentIndex - 1 + total) % total;
  const nextIndex = (currentIndex + 1) % total;

  reviews[prevIndex].classList.add('prev');
  reviews[currentIndex].classList.add('active');
  reviews[nextIndex].classList.add('next');
}

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + reviews.length) % reviews.length;
  updateReviews();
});

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % reviews.length;
  updateReviews();
});

// Initialize carousel on page load
updateReviews();
