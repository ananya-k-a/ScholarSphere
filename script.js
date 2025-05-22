// Firebase configuration
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

// Fetch data from Google Sheets
let googleSheetScholarships = [];

async function fetchGoogleSheetData() {
  try {
    const res = await fetch('https://opensheet.elk.sh/1FKcUTWy6JbeeD-2Rb8sjeTgY-n_PQLQbx-tYpLQQjv8/Sheet1');
    const data = await res.json();

    googleSheetScholarships = data.map(s => ({
      name: s["Name"],
      deadline: s["Deadline Before"],
      eligibility: s["Eligibility"],
      category: s["Category"],
      citizenship: s["Citizenship"],
      amount: Number(s["Amount in USD"]) || 0,
      source: "Google Sheets"
    }));

    renderCombinedScholarships();
  } catch (error) {
    console.error("Error loading Google Sheet data:", error);
  }
}

// Firestore data + Filters
let firestoreScholarships = [];

function fetchFirestoreData(filters = {}) {
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
        source: "User Submitted"
      };
    });

    renderCombinedScholarships(filters);
  });
}

// Combine both data sources and render
function renderCombinedScholarships(filters = {}) {
  const allScholarships = [...googleSheetScholarships, ...firestoreScholarships];
  const list = document.getElementById("scholarship-list");
  list.innerHTML = "";

  const filtered = allScholarships.filter(s => {
    return (
      (!filters.eligibility || s.eligibility === filters.eligibility) &&
      (!filters.category || s.category === filters.category) &&
      (!filters.citizenship || s.citizenship === filters.citizenship) &&
      (!filters.deadline || new Date(s.deadline) <= new Date(filters.deadline)) &&
      (!filters.amount || s.amount >= Number(filters.amount))
    );
  });

  if (filtered.length === 0) {
    list.innerHTML = "<li>No scholarships found.</li>";
    return;
  }

  filtered.forEach(s => {
    const li = document.createElement("li");
    li.textContent = `${s.name} — Deadline: ${s.deadline} — Amount: $${s.amount} — Eligibility: ${s.eligibility} — Category: ${s.category} — Citizenship: ${s.citizenship} (${s.source})`;
    list.appendChild(li);
  });
}

// Filter form
document.addEventListener("DOMContentLoaded", () => {
  const filterForm = document.getElementById("filterForm");
  const addForm = document.getElementById("addScholarshipForm");
  const message = document.getElementById("addScholarshipMessage");

  if (filterForm) {
    filterForm.addEventListener("submit", e => {
      e.preventDefault();
      const filters = {
        eligibility: filterForm.eligibility.value,
        category: filterForm.category.value,
        citizenship: filterForm.citizenship.value,
        deadline: filterForm.deadline.value,
        amount: filterForm.amount.value
      };
      renderCombinedScholarships(filters);
    });
  }

  if (addForm && message) {
    addForm.addEventListener("submit", e => {
      e.preventDefault();
      const newScholarship = {
        name: addForm.name.value,
        deadline: addForm.deadline.value,
        eligibility: addForm.eligibility.value,
        category: addForm.category.value,
        citizenship: addForm.citizenship.value,
        amount: Number(addForm.amount.value)
      };

      db.collection("scholarships").add(newScholarship).then(() => {
        message.textContent = "Scholarship added!";
        addForm.reset();
        fetchFirestoreData();
      }).catch(err => {
        console.error("Error adding scholarship:", err);
        message.textContent = "Something went wrong.";
      });
    });
  }

  fetchGoogleSheetData();
  fetchFirestoreData();
});
