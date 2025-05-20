const reviews = document.querySelectorAll('.review');
let current = 0;

function showNextReview() {
  const outgoing = reviews[current];
  outgoing.classList.remove('active');
  outgoing.classList.add('slide-out-left');

  current = (current + 1) % reviews.length;

  const incoming = reviews[current];
  incoming.classList.add('slide-in-right');

  // After animation ends, cleanup classes
  setTimeout(() => {
    outgoing.classList.remove('slide-out-left');
    incoming.classList.remove('slide-in-right');
    incoming.classList.add('active');
  }, 600); // matches CSS transition duration
}

// Example trigger
document.querySelector('.carousel-controls button.next').addEventListener('click', showNextReview);
