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

// Data arrays
let googleSheetScholarships = [];
let firestoreScholarships = [];

// Fetch Google Sheets data
async function fetchGoogleSheetData() {
  try {
    const res = await fetch('https://opensheet.elk.sh/1FKcUTWy6JbeeD-2Rb8sjeTgY-n_PQLQbx-tYpLQQjv8/Sheet1');
    const data = await res.json();

    // Debug: log the first row to check keys
    console.log('First row from Google Sheet:', data[0]);

    // Filter out empty rows and robustly map infoLink
    googleSheetScholarships = data
      .filter(item => item["Name"] && item["Name"].trim() !== "")
      .map(item => ({
        name: item["Name"],
        deadline: item["Deadline Before"],
        eligibility: item["Eligibility"],
        category: item["Category"],
        citizenship: item["Citizenship"],
        amount: Number(item["Amount in USD"]) || 0,
        infoLink: item["infoLink"] || item["InfoLink"] || item["Info Link"] || "",
        source: "Google Sheets"
      }));

    renderCombinedScholarships();
  } catch (error) {
    console.error("Error loading Google Sheet data:", error);
  }
}

// Fetch Firestore data
function fetchFirestoreData() {
  db.collection("scholarships").get().then(snapshot => {
    firestoreScholarships = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        name: data.name,
        deadline: data.deadline,
        eligibility: data.eligibility,
        category: data.category,
        citizenship: data.citizenship,
        amount: Number(data.amount) || 0,
        infoLink: data.infoLink || "",
        source: "User Submitted"
      };
    });

    renderCombinedScholarships();
  }).catch(err => {
    console.error("Error loading Firestore data:", err);
  });
}

// Utility for case-insensitive trim
function cleanStr(str) {
  return str ? str.toString().trim().toLowerCase() : '';
}

// Render combined scholarships with optional filters
function renderCombinedScholarships(filters = {}) {
  const allScholarships = [...googleSheetScholarships, ...firestoreScholarships];
  const list = document.getElementById("scholarship-list");
  list.innerHTML = "";

  const filtered = allScholarships.filter(s => {
    if (filters.eligibility && cleanStr(s.eligibility) !== cleanStr(filters.eligibility)) return false;
    if (filters.category && cleanStr(s.category) !== cleanStr(filters.category)) return false;
    if (filters.citizenship && cleanStr(s.citizenship) !== cleanStr(filters.citizenship)) return false;

    if (filters.deadline) {
      const deadlineDate = new Date(s.deadline);
      const filterDate = new Date(filters.deadline);
      if (deadlineDate > filterDate) return false;
    }

    if (filters.amount !== undefined && !isNaN(filters.amount) && filters.amount > 0) {
      if (s.amount < filters.amount) return false;
    }

    return true;
  });

  if (filtered.length === 0) {
    list.innerHTML = "<li>No scholarships found matching your criteria.</li>";
    return;
  }

  filtered.forEach(s => {
    const li = document.createElement("li");
    li.className = "scholarship-card";

    li.innerHTML = `
      <div class="card-header">${s.name}</div>
      <div class="card-body">
        <p><strong>Deadline:</strong> ${s.deadline}</p>
        <p><strong>Amount:</strong> $${s.amount}</p>
        <p><strong>Eligibility:</strong> ${s.eligibility}</p>
        <p><strong>Category:</strong> ${s.category}</p>
        <p><strong>Citizenship:</strong> ${s.citizenship}</p>
        <p class="source">Source: ${s.source}</p>
        ${s.infoLink ? `<p><a href="${s.infoLink}" target="_blank" rel="noopener">More Info</a></p>` : ""}
      </div>
    `;

    if (s.infoLink) {
      li.style.cursor = "pointer";
      li.addEventListener("click", () => {
        window.open(s.infoLink, "_blank");
      });
    }

    list.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Filter form submission
  const filterForm = document.getElementById("filterForm");
  if (filterForm) {
    filterForm.addEventListener("submit", e => {
      e.preventDefault();
      const filters = {
        eligibility: filterForm.eligibility.value,
        category: filterForm.category.value,
        citizenship: filterForm.citizenship.value,
        deadline: filterForm.deadline.value,
        amount: parseFloat(filterForm.amount.value)
      };
      renderCombinedScholarships(filters);
    });
  }

  // Toggle filter dropdown functionality
  const toggleBtn = document.getElementById("toggleFilters");
  const filterContainer = document.getElementById("filterContainer");
  if (toggleBtn && filterContainer) {
    toggleBtn.addEventListener("click", () => {
      const isHidden = filterContainer.style.display === "none";
      filterContainer.style.display = isHidden ? "block" : "none";
      toggleBtn.textContent = isHidden ? "Hide Filters ▲" : "Show Filters ▼";
    });
  }

  // Initial data fetch
  fetchGoogleSheetData();
  fetchFirestoreData();
});