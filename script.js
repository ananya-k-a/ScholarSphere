document.addEventListener('DOMContentLoaded', () => {
  const SHEETS_URL = 'https://opensheet.elk.sh/1FKcUTWy6JbeeD-2Rb8sjeTgY-n_PQLQbx-tYpLQQjv8/Sheet1';
  const scholarshipList = document.getElementById('scholarship-list');
  const filterForm = document.getElementById('filterForm');

  let scholarshipsData = [];

  // Fetch all scholarships from Google Sheets
  function fetchScholarships() {
    fetch(SHEETS_URL)
      .then(response => response.json())
      .then(data => {
        scholarshipsData = data;
        renderScholarships(scholarshipsData);
      })
      .catch(error => {
        console.error('Error loading scholarships from Google Sheet:', error);
        scholarshipList.innerHTML = '<li>Error loading scholarships.</li>';
      });
  }

  // Render scholarships list based on filtered data
  function renderScholarships(data) {
    scholarshipList.innerHTML = '';

    if (!data.length) {
      scholarshipList.innerHTML = '<li>No scholarships match your filters.</li>';
      return;
    }

    data.forEach(sch => {
      const li = document.createElement('li');
      li.textContent = `${sch["Name"]} — Deadline: ${sch["Deadline Before"]} — Amount: $${sch["Amount in USD"]} — Eligibility: ${sch["Eligibility"]} — Category: ${sch["Category"]} — Citizenship: ${sch["Citizenship"]}`;
      scholarshipList.appendChild(li);
    });
  }

  // Filter scholarships based on form values
  function filterScholarships() {
    const eligibility = filterForm.eligibility.value.trim().toLowerCase();
    const category = filterForm.category.value.trim().toLowerCase();
    const citizenship = filterForm.citizenship.value.trim().toLowerCase();
    const deadlineBefore = filterForm.deadline.value; // yyyy-mm-dd string or empty
    const minAmount = Number(filterForm.amount.value) || 0;

    const filtered = scholarshipsData.filter(sch => {
      // Convert fields to lowercase for case-insensitive matching
      const schEligibility = (sch["Eligibility"] || '').toLowerCase();
      const schCategory = (sch["Category"] || '').toLowerCase();
      const schCitizenship = (sch["Citizenship"] || '').toLowerCase();
      const schDeadline = sch["Deadline Before"] || '';
      const schAmount = Number(sch["Amount in USD"]) || 0;

      // Eligibility filter (if chosen)
      if (eligibility && eligibility !== '' && eligibility !== schEligibility) {
        return false;
      }
      // Category filter (if chosen)
      if (category && category !== '' && category !== schCategory) {
        return false;
      }
      // Citizenship filter (if chosen)
      if (citizenship && citizenship !== '' && citizenship !== schCitizenship) {
        return false;
      }
      // Deadline Before filter (if chosen)
      if (deadlineBefore) {
        // Compare dates as strings works because YYYY-MM-DD format
        if (schDeadline === '' || schDeadline > deadlineBefore) {
          return false;
        }
      }
      // Minimum amount filter
      if (schAmount < minAmount) {
        return false;
      }
      return true;
    });

    renderScholarships(filtered);
  }

  // Initialize: fetch scholarships and set up filter form listener
  fetchScholarships();

  filterForm.addEventListener('submit', e => {
    e.preventDefault();
    filterScholarships();
  });
});
