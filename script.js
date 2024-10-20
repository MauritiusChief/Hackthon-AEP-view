console.log('Starting DOMContentLoaded');
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded');
  fetch('output_2.json')
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

    // Define grid positions
    const gridAreas = ['most-emrg', 'second-emrg', 'third-emrg', 'forth-emrg', 'fifth-emrg', 'sixth-emrg', 'seventh-emrg', 'eighth-emrg', 'ninth-emrg', 'tenth-emrg'];

    // Create grid items
    for (let i = 0; i < Math.min(10, recordArray.length); i++) {
        const record = recordArray[i];
        const severityScore = record.severity_score;
        const primaryKey = Object.keys(records)[i]; // Get the primary key
        const card = document.createElement('div');
        card.className = 'emrg-card';
    
        // Assign grid-area to each card
        card.style.gridArea = gridAreas[i];
    
        // Add content to the card
        if (i < 2) {
            card.innerHTML = `
                <h3>${i !== 1 ? 'Most' : 'Second'} Urgent</h3>
                <p>Primary Key: ${primaryKey}</p>
                <p>Date: ${record.date}</p>
                <p>Type: ${record.observation_type}</p>
                <p>Comments: ${record.comments}</p>
                <p class="severity ${getSeverityClass(record.severity_score)}">Severity: ${severityScore}</p>
            `;
        } else if (i < 6) {
            card.innerHTML = `
                <h3> Less Urgent</h3>
                <p>Primary Key: ${primaryKey}</p>
                <p>Type: ${record.observation_type}</p>
                <p class="severity ${getSeverityClass(record.severity_score)}">Severity: ${severityScore}</p>
                <div class="tooltip">
                    <p>Date: ${record.date}</p>
                    <p>Comments: ${record.comments}</p>
                </div>
            `;
        } else {
            card.innerHTML = `
                <p>Primary Key: ${primaryKey}</p>
                <p class="severity ${getSeverityClass(record.severity_score)}">Severity: ${severityScore}</p>
                <div class="tooltip">
                    <p>Type: ${record.observation_type}</p>
                    <p>Date: ${record.date}</p>
                    <p>Comments: ${record.comments}</p>
                </div>
            `;
        }
    
        // Add the card to the grid container
        gridContainer.appendChild(card);
    }
}

function getSeverityClass(score) {
    if (score <= 60) return 'low';
    if (score <= 80) return 'medium';
    return 'high';
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
        const recordText = `${key} ${record.date} ${record.observation_type} ${record.comments}`.toLowerCase();

        // Check if the search term is present in any of the fields, including the primary key
        if (recordText.includes(searchTerm)) {
            const resultRow = document.createElement('div');
            resultRow.className = 'result-row';

            resultRow.innerHTML = `
                <div>${key}</div>
                <div>${record.date}</div>
                <div>${record.observation_type}</div>
                <div>${record.comments}</div>
                <div>${record.severity_score}</div>
            `;

            filteredResults.appendChild(resultRow);
        }
    }
}

// Function to create the pie chart
function createPieChart(records) {
    const severityCounts = [0, 0, 0];

    // Count records in each severity range
    for (const key in records) {
        const score = records[key].severity_score;

        if (score >= 1 && score <= 60) {
            severityCounts[0]++;
        } else if (score >= 61 && score <= 80) {
            severityCounts[1]++;
        } else if (score >= 81 && score <= 100) {
            severityCounts[2]++;
        }
    }
    console.log("severityCounts:", severityCounts)

    const ctx = document.getElementById('severityChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['1-60', '61-80', '81-100'],
            datasets: [{
                data: severityCounts,
                backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
            }]
        },
        options: {
            responsive: true,
            // maintainAspectRatio: false, // 允许改变纵横比
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
