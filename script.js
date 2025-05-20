// Carousel logic
const reviews = document.querySelectorAll('.review');
let currentIndex = 0;
let intervalId;

function showReview(index, direction = 'right') {
  reviews.forEach((review, i) => {
    review.classList.remove('active');
    if (i === index) {
      review.classList.add('active');
    }
  });
}

function nextReview() {
  currentIndex = (currentIndex + 1) % reviews.length;
  showReview(currentIndex, 'right');
}

function prevReview() {
  currentIndex = (currentIndex - 1 + reviews.length) % reviews.length;
  showReview(currentIndex, 'left');
}

function startCarousel() {
  intervalId = setInterval(nextReview, 5000); // rotate every 5 seconds
}

function stopCarousel() {
  clearInterval(intervalId);
}

// Initial setup
showReview(currentIndex);
startCarousel();

// If you want to add buttons for manual navigation, add event listeners here:
// Example (assuming you add these buttons in your HTML):
// document.getElementById('nextBtn').addEventListener('click', () => {
//   stopCarousel();
//   nextReview();
//   startCarousel();
// });
// document.getElementById('prevBtn').addEventListener('click', () => {
//   stopCarousel();
//   prevReview();
//   startCarousel();
// });

// Contact form submission handling
const form = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  formMessage.textContent = 'Thank you for reaching out! We will get back to you soon.';
  form.reset();
});
