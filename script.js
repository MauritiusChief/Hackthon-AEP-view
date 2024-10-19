document.addEventListener('DOMContentLoaded', () => {
  fetch('test_input.json')
      .then(response => {
          if (!response.ok) {
              throw new Error('Failed to load JSON data');
          }
          return response.json();
      })
      .then(data => {
          populateTable(data.records);
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
