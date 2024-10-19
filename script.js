console.log('Starting DOMContentLoaded');
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded');
  fetch('test_input.json')
      .then(response => {
          if (!response.ok) {
              throw new Error('Failed to load JSON data');
          }
          return response.json();
      })
      .then(data => {
          console.log('Data loaded successfully');
          populateTable(data.records);

          // Attach click event to the search button
          const searchButton = document.getElementById('searchButton');
          searchButton.addEventListener('click', () => {
              setupSearch(data.records); // Call setupSearch on each button click
          });
      })
      .catch(error => {
          console.error('Error:', error);
          alert('Failed to load data');
      });
});

// Function to populate the table with data
function populateTable(records) {
  const tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = '';  // Clear existing rows

  for (const key in records) {
      const record = records[key];
      const row = document.createElement('tr');

      row.innerHTML = `
          <td>${record.date}</td>
          <td>${record.observation_type}</td>
          <td>${record.comments}</td>
          <td>${record.hazard_value.severity_score}</td>
          <td>${record.hazard_value.impact}</td>
          <td>${record.hazard_value.suggested_action}</td>
      `;

      tableBody.appendChild(row);
  }
}

// Function to setup search functionality
function setupSearch(records) {
  const searchInput = document.getElementById('searchInput');
  const filteredResults = document.getElementById('filteredResults');

  console.log('setupSearch() triggered'); // Debugging line

  const searchTerm = searchInput.value.toLowerCase();
  console.log('Search initiated with term:', searchTerm); // Debugging line
  filteredResults.innerHTML = '';  // Clear previous results

  for (const key in records) {
      const record = records[key];
      const recordText = `${record.date} ${record.observation_type} ${record.comments}`.toLowerCase();

      if (recordText.includes(searchTerm)) {
          const resultRow = document.createElement('div');
          resultRow.className = 'result-row';

          resultRow.innerHTML = `
              <div>${record.date}</div>
              <div>${record.observation_type}</div>
              <div>${record.comments}</div>
          `;

          filteredResults.appendChild(resultRow);
      }
  }
}
