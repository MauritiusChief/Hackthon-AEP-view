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
          populateGrid(data.records);

          // Create the pie chart
          createPieChart(data.records);

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

function populateGrid(records) {
    const gridContainer = document.getElementById('gridContainer');
    gridContainer.innerHTML = '';  // Clear existing content

    // Convert the records object to an array
    const recordArray = Object.values(records);

    // Sort the array by severity_score (descending) and date (ascending)
    recordArray.sort((a, b) => {
        if (b.severity_score !== a.severity_score) {
            return b.severity_score - a.severity_score;
        } else {
            return new Date(a.date) - new Date(b.date);
        }
    });

    // Create grid items
    for (let i = 0; i < Math.min(4, recordArray.length); i++) {
        const record = recordArray[i];
        const severityScore = record.severity_score;
        const card = document.createElement('div');
        card.className = 'emrg-card';
        
        // Assign color based on severity score
        let bgColor = '';
        if (severityScore >= 1 && severityScore <= 5) {
            bgColor = '#4CAF50'; // Green
        } else if (severityScore >= 6 && severityScore <= 8) {
            bgColor = '#FFC107'; // Yellow
        } else if (severityScore >= 9 && severityScore <= 10) {
            bgColor = '#F44336'; // Red
        }
        card.style.backgroundColor = bgColor;

        // Add content to the card
        if (i === 0) {  // 'most-emrg' card shows all info
            card.innerHTML = `
                <h3>Most Urgent</h3>
                <p>Date: ${record.date}</p>
                <p>Type: ${record.observation_type}</p>
                <p>Comments: ${record.comments}</p>
                <p>Severity: ${severityScore}</p>
            `;
        } else {  // 'second-emrg', 'third-emrg', 'forth-emrg' show limited info
            card.innerHTML = `
                <h3>${i === 1 ? 'Second' : i === 2 ? 'Third' : 'Forth'} Urgent</h3>
                <p>Type: ${record.observation_type}</p>
                <p>Severity: ${severityScore}</p>
            `;
        }

        // Add the card to the grid container
        gridContainer.appendChild(card);
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

// Function to create the pie chart
function createPieChart(records) {
  const severityCounts = [0, 0, 0]; // 1-5, 6-8, 9-10

  // Count records in each severity range
  for (const key in records) {
      const score = records[key].severity_score;

      if (score >= 1 && score <= 5) {
          severityCounts[0]++;
      } else if (score >= 6 && score <= 8) {
          severityCounts[1]++;
      } else if (score >= 9 && score <= 10) {
          severityCounts[2]++;
      }
  }

  const ctx = document.getElementById('severityChart').getContext('2d');
  new Chart(ctx, {
      type: 'pie',
      data: {
          labels: ['1-5', '6-8', '9-10'],
          datasets: [{
              data: severityCounts,
              backgroundColor: ['#4CAF50', '#FFC107', '#F44336'], // Green, Yellow, Red
          }]
      },
      options: {
          responsive: true,
          plugins: {
              legend: {
                  position: 'top',
              },
              title: {
                  display: true,
                  text: 'Severity Score Distribution'
              }
          }
      }
  });
}
