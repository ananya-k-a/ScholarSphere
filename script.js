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

  // Scholarship Firestore logic
  const scholarshipList = document.getElementById('scholarship-list');
  const addForm = document.getElementById('addScholarshipForm');
  const addMessage = document.getElementById('addScholarshipMessage');
  const filterForm = document.getElementById('filterForm');

  let allScholarships = [];

  // Render scholarships with extra fields
  function renderScholarships(scholarships) {
    scholarshipList.innerHTML = '';
    if (scholarships.length === 0) {
      scholarshipList.innerHTML = '<li>No scholarships found.</li>';
      return;
    }
    scholarships.forEach(sch => {
      const li = document.createElement('li');
      // Format deadline date nicely
      const deadlineDate = new Date(sch.deadline);
      const deadlineStr = deadlineDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

      li.textContent = `${sch.name} — Deadline: ${deadlineStr}`;

      if (sch.amount) li.textContent += ` — Amount: $${sch.amount}`;
      if (sch.category) li.textContent += ` — Category: ${sch.category}`;
      if (sch.eligibility) li.textContent += ` — Eligibility: ${sch.eligibility}`;

      scholarshipList.appendChild(li);
    });
  }

  // Filter scholarships according to filters
  function filterScholarships() {
    const eligibilityFilter = filterForm?.eligibility.value.toLowerCase() || '';
    const categoryFilter = filterForm?.category.value.toLowerCase() || '';
    const deadlineFilter = filterForm?.deadline.value || '';

    let filtered = allScholarships;

    if (eligibilityFilter) {
      filtered = filtered.filter(sch => sch.eligibility?.toLowerCase() === eligibilityFilter);
    }
    if (categoryFilter) {
      filtered = filtered.filter(sch => sch.category?.toLowerCase() === categoryFilter);
    }
    if (deadlineFilter) {
      filtered = filtered.filter(sch => new Date(sch.deadline) <= new Date(deadlineFilter));
    }

    renderScholarships(filtered);
  }

  // Load scholarships from Firestore
  function loadScholarships() {
    db.collection("scholarships").orderBy("deadline").onSnapshot(snapshot => {
      allScholarships = [];
      snapshot.forEach(doc => {
        allScholarships.push(doc.data());
      });
      filterScholarships();
    }, error => {
      console.error("Error loading scholarships:", error);
      scholarshipList.innerHTML = '<li>Failed to load scholarships.</li>';
    });
  }

  if (addForm && addMessage) {
    addForm.addEventListener('submit', e => {
      e.preventDefault();

      const name = addForm.name.value.trim();
      const deadline = addForm.deadline.value;
      const eligibility = addForm.eligibility.value.trim().toLowerCase();
      const category = addForm.category.value.trim().toLowerCase();
      const amountStr = addForm.amount.value.trim();

      if (!name || !deadline) {
        addMessage.textContent = "Please fill in required fields: Name and Deadline.";
        return;
      }

      let amount = null;
      if (amountStr) {
        amount = Number(amountStr);
        if (isNaN(amount) || amount < 0) {
          addMessage.textContent = "Please enter a valid positive number for Amount.";
          return;
        }
      }

      db.collection("scholarships").add({
        name,
        deadline,
        eligibility,
        category,
        amount
      }).then(() => {
        addMessage.textContent = "Scholarship added!";
        addForm.reset();
        setTimeout(() => addMessage.textContent = "", 3000);
      }).catch(error => {
        console.error("Error adding scholarship:", error);
        addMessage.textContent = "Something went wrong.";
      });
    });
  }

  if (filterForm) {
    filterForm.addEventListener('submit', e => {
      e.preventDefault();
      filterScholarships();
    });
  }

  loadScholarships();
});
