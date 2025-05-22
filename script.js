// Firebase configuration and initialization
const firebaseConfig = {
  apiKey: "AIzaSyBe4tdkLcdgd0V8RmbVBXt62xVWQWsw8cY",
  authDomain: "scholarsphere-b3774.firebaseapp.com",
  projectId: "scholarsphere-b3774",
  storageBucket: "scholarsphere-b3774.appspot.com",
  messagingSenderId: "1087134162732",
  appId: "1:1087134162732:web:3ec680ace1c6865caa9689",
  measurementId: "G-PTGX1X7NP2"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

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
// Scholarship Firestore logic
document.addEventListener('DOMContentLoaded', () => {
  const scholarshipList = document.getElementById('scholarship-list');
  const form = document.getElementById('addScholarshipForm');
  const message = document.getElementById('addScholarshipMessage');

  // Add scholarship to Firestore
  if (form && message) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const deadline = form.deadline.value;

      if (!name || !deadline) return;

      db.collection("scholarships").add({
        name,
        deadline
      }).then(() => {
        message.textContent = "Scholarship added!";
        form.reset();
        setTimeout(() => message.textContent = "", 3000);
      }).catch((error) => {
        console.error("Error adding scholarship: ", error);
        message.textContent = "Something went wrong.";
      });
    });
  }

  // Listen to real-time updates
  if (scholarshipList) {
    db.collection("scholarships").orderBy("deadline").onSnapshot((snapshot) => {
      scholarshipList.innerHTML = "";
      snapshot.forEach(doc => {
        const { name, deadline } = doc.data();
        const li = document.createElement("li");
        li.textContent = `${name} — Deadline: ${deadline}`;
        scholarshipList.appendChild(li);
      });
    });
  }
});


