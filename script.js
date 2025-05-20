const reviews = document.querySelectorAll('.review');
const prevBtn = document.querySelector('#prevReview');
const nextBtn = document.querySelector('#nextReview');

let currentIndex = 0;

function showReview(newIndex, direction) {
  if (newIndex === currentIndex) return;

  const currentReview = reviews[currentIndex];
  const nextReview = reviews[newIndex];

  // Clear all classes
  reviews.forEach(review => {
    review.classList.remove('active', 'slide-out-left', 'slide-in-right');
  });

  if (direction === 'next') {
    // Current slides left and shrinks
    currentReview.classList.add('slide-out-left');

    // Next slides in from right and grows
    nextReview.classList.add('slide-in-right');

    // Trigger reflow so the browser acknowledges the start position of slide-in-right
    nextReview.offsetWidth;

    // Then activate the next review (scales it up and moves to center)
    nextReview.classList.add('active');
  } else if (direction === 'prev') {
    // For previous, reverse animation:

    // Current slides right and shrinks (reuse slide-in-right but mirrored)
    currentReview.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease';
    currentReview.style.transform = 'translateX(calc(-50% + 150%)) scale(0.7) rotateY(45deg)';
    currentReview.style.opacity = '0';
    currentReview.style.pointerEvents = 'none';

    // Next slides in from left and grows — we need a new class or inline styles for this:
    nextReview.style.transition = 'none';
    nextReview.style.transform = 'translateX(calc(-50% - 150%)) scale(0.7) rotateY(-45deg)';
    nextReview.style.opacity = '0';
    nextReview.style.pointerEvents = 'none';

    // Force reflow
    nextReview.offsetWidth;

    // Activate nextReview (center it and full size)
    nextReview.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease';
    nextReview.style.transform = 'translateX(-50%) scale(1) rotateY(0deg)';
    nextReview.style.opacity = '1';
    nextReview.style.pointerEvents = 'auto';

    // Clean up currentReview classes after animation ends
    currentReview.classList.remove('active');
    currentReview.classList.remove('slide-out-left');
    currentReview.classList.remove('slide-in-right');
  }

  currentIndex = newIndex;
}

prevBtn.addEventListener('click', () => {
  let newIndex = currentIndex - 1;
  if (newIndex < 0) newIndex = reviews.length - 1;
  showReview(newIndex, 'prev');
});

nextBtn.addEventListener('click', () => {
  let newIndex = (currentIndex + 1) % reviews.length;
  showReview(newIndex, 'next');
});

// Initialize first review visible
reviews[currentIndex].classList.add('active');
