// Testimonial slider auto-rotation and contact form handling

document.addEventListener('DOMContentLoaded', () => {
  // Carousel logic
  const reviews = document.querySelectorAll('.carousel .review');
  const reviewsSection = document.querySelector('.reviews');
  let currentIndex = 0;
  let intervalId;

  function adjustReviewsHeight() {
    const activeReview = document.querySelector('.carousel .review.active');
    if (activeReview && reviewsSection) {
      reviewsSection.style.height = activeReview.offsetHeight + 80 + 'px'; // Adjust 80 if needed for padding
    }
  }

  function showReview(index) {
    reviews.forEach((review, i) => {
      review.classList.toggle('active', i === index);
    });
    adjustReviewsHeight();
  }

  function nextReview() {
    currentIndex = (currentIndex + 1) % reviews.length;
    showReview(currentIndex);
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

  // Adjust height on window resize
  window.addEventListener('resize', adjustReviewsHeight);

  // Contact form submission handling
  const form = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  if (form && formMessage) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      formMessage.textContent = 'Thank you for reaching out! We will get back to you soon.';
      form.reset();
    });
  }
});