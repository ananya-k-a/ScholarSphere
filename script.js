// Firebase configuration and initialization
fetch('https://opensheet.elk.sh/1FKcUTWy6JbeeD-2Rb8sjeTgY-n_PQLQbx-tYpLQQjv8/Sheet1')
  .then(response => response.json())
  .then(data => {
    const scholarshipList = document.getElementById('scholarship-list');
    scholarshipList.innerHTML = '';

    data.forEach(scholarship => {
      const li = document.createElement('li');
      li.textContent = `${scholarship.name} — Deadline: ${scholarship.deadline} — Amount: $${scholarship.amount}`;
      scholarshipList.appendChild(li);
    });
  })
  .catch(error => {
    console.error('Error loading scholarships:', error);
  });

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

// Carousel and contact form logic (unchanged)
document.addEventListener('DOMContentLoaded', () => {
  const reviews = document.querySelectorAll('.carousel .review');
  const reviewsSection = document.querySelector('.reviews');
  let currentIndex = 0;
  let intervalId;

  function adjustReviewsHeight() {
    const activeReview = document.querySelector('.carousel .review.active');
    if (activeReview && reviewsSection) {
      reviewsSection.style.height = activeReview.offsetHeight + 80 + 'px';
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
    intervalId = setInterval(nextReview, 5000);
  }

  function stopCarousel() {
    clearInterval(intervalId);
  }

  showReview(currentIndex);
  startCarousel();
  window.addEventListener('resize', adjustReviewsHeight);

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

// Scholarships logic
document.addEventListener('DOMContentLoaded', () => {
  const scholarshipList = document.getElementById('scholarship-list');
  const addForm = document.getElementById('addScholarshipForm');
  const filterForm = document.getElementById('filterForm');
  const message = document.getElementById('addScholarshipMessage');

  // Function to render scholarships
  function renderScholarships(snapshot, filters = {}) {
    scholarshipList.innerHTML = "";

    snapshot.forEach(doc => {
      const data = doc.data();

      // Apply filters manually (Firestore can't do compound queries on arbitrary filters)
      if (
        (filters.eligibility && data.eligibility !== filters.eligibility) ||
        (filters.category && data.category !== filters.category) ||
        (filters.citizenship && data.citizenship !== filters.citizenship) ||
        (filters.deadline && data.deadline > filters.deadline)
      ) {
        return;
      }

      const li = document.createElement("li");
      li.textContent = `${data.name} — Deadline: ${data.deadline}`;
      scholarshipList.appendChild(li);
    });
  }

  // Real-time listener with optional filters
  function loadScholarships(filters = {}) {
    db.collection("scholarships")
      .orderBy("deadline")
      .onSnapshot((snapshot) => {
        renderScholarships(snapshot, filters);
      });
  }

  // Add scholarship
  if (addForm && message) {
    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = addForm.name.value.trim();
      const deadline = addForm.deadline.value;
      const eligibility = addForm.eligibility.value.trim().toLowerCase();
      const category = addForm.category.value.trim().toLowerCase();
      const citizenship = addForm.citizenship.value.trim().toLowerCase();
      const amount = Number(addForm.amount.value);

      if (!name || !deadline) return;

      db.collection("scholarships").add({
        name,
        deadline,
        eligibility,
        category,
        citizenship,
        amount
      }).then(() => {
        message.textContent = "Scholarship added!";
        addForm.reset();
        setTimeout(() => message.textContent = "", 3000);
      }).catch((error) => {
        console.error("Error adding scholarship: ", error);
        message.textContent = "Something went wrong.";
      });
    });
  }

  // Filter scholarships
  if (filterForm) {
    filterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const eligibility = filterForm.eligibility.value.trim();
      const category = filterForm.category.value.trim();
      const citizenship = filterForm.citizenship.value.trim();
      const deadline = filterForm.deadline.value;

      const filters = {
        eligibility,
        category,
        citizenship,
        deadline
      };

      loadScholarships(filters);
    });
  }

  // Initial load without filters
  loadScholarships();
});
