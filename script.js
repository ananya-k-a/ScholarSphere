const scholarships = [
  { name: "Tech Innovators Scholarship", eligibility: "Open to all students" },
  { name: "Non-Citizen Support Fund", eligibility: "Legal non-citizens only" },
  { name: "Women in Engineering Grant", eligibility: "Female students" },
  { name: "Community Leadership Award", eligibility: "Students involved in community service" },
  { name: "STEM Excellence Scholarship", eligibility: "STEM majors only" },
];

function searchScholarships() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  if (!input) {
    resultsDiv.innerHTML = "<p>Please enter a keyword to search.</p>";
    return;
  }

  const filtered = scholarships.filter(scholarship =>
    scholarship.name.toLowerCase().includes(input)
  );

  if (filtered.length === 0) {
    resultsDiv.innerHTML = "<p>No scholarships found matching your search.</p>";
  } else {
    filtered.forEach(s => {
      const p = document.createElement("p");
      p.textContent = `${s.name} — Eligibility: ${s.eligibility}`;
      resultsDiv.appendChild(p);
    });
  }
}
