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

          displayResults([], 0)

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

    // Convert records object to an array of objects with keys
    const recordArray = Object.entries(records).map(([key, record]) => ({
        primaryKey: key,
        ...record
    }));

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
        const primaryKey = record.primaryKey; // Get the primary key
        const card = document.createElement('div');
        card.className = 'emrg-card';
    
        // Assign grid-area to each card
        card.style.gridArea = gridAreas[i];

        // Assign color based on severity score
        let bgColor = '';
        if (severityScore >= 1 && severityScore <= 50) {
            bgColor = '#4CAF50'; // Green
        } else if (severityScore >= 51 && severityScore <= 80) {
            bgColor = '#FFC107'; // Yellow
        } else if (severityScore >= 81 && severityScore <= 100) {
            bgColor = '#F44336'; // Red
        }
        card.style.backgroundColor = bgColor;
    
        // Add content to the card
        if (i < 2) {
            card.innerHTML = `
                <h3>${i !== 1 ? 'Most' : 'Second'} Urgent</h3>
                <p>Primary Key: ${primaryKey}</p>
                <p>Date: ${record.date}</p>
                <p>Type: ${record.observation_type}</p>
                <p>Comments: ${record.comments}</p>
                <p>Severity: ${severityScore}</p>
            `;
        } else if (i < 6) {
            card.innerHTML = `
                <h3> Less Urgent</h3>
                <p>Primary Key: ${primaryKey}</p>
                <p>Type: ${record.observation_type}</p>
                <p>Severity: ${severityScore}</p>
                <div class="tooltip">
                    <p>Date: ${record.date}</p>
                    <p>Comments: ${record.comments}</p>
                </div>
            `;
        } else {
            card.innerHTML = `
                <p>Primary Key: ${primaryKey}</p>
                <p>Severity: ${severityScore}</p>
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

    console.log('setupSearch() triggered'); // Debugging line

    const searchTerm = searchInput.value.toLowerCase();
    console.log('Search initiated with term:', searchTerm); // Debugging line

    // Filter the records based on the search term, including primary key
    const filteredRecords = Object.keys(records).filter(key => {
        const record = records[key];
        const recordText = `${key} ${record.date} ${record.observation_type} ${record.comments}`.toLowerCase();
        return recordText.includes(searchTerm);
    }).map(key => ({ primaryKey: key, ...records[key] }));

    // Display the filtered results (starting from the first page)
    displayResults(filteredRecords, 0);
}

function displayResults(records, pageIndex) {
    const filteredResults = document.getElementById('filteredResults');
    filteredResults.innerHTML = '';

    const resultsPerPage = 10;
    const startIndex = pageIndex * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;

    // Get the current page's records and ensure at least 10 rows are displayed
    const currentPageRecords = records.slice(startIndex, endIndex);
    const rowsToDisplay = [...currentPageRecords];
    while (rowsToDisplay.length < resultsPerPage) {
        rowsToDisplay.push({ primaryKey: '-', date: '-', observation_type: '-', comments: '-', severity_score: '-' });
    }

    // Render the records
    rowsToDisplay.forEach(record => {
        const resultRow = document.createElement('div');
        resultRow.className = 'result-row';
        resultRow.innerHTML = `
            <div>${record.primaryKey}</div>
            <div>${record.date}</div>
            <div>${record.observation_type}</div>
            <div>${record.comments}</div>
            <div class="severity ${getSeverityClass(record.severity_score)}">${record.severity_score}</div>
        `;
        filteredResults.appendChild(resultRow);
    });

    // Create and render pagination controls
    renderPaginationControls(records, pageIndex, resultsPerPage);
}

function renderPaginationControls(records, pageIndex, resultsPerPage) {
    const filteredResults = document.getElementById('filteredResults');
    const totalPages = Math.ceil(records.length / resultsPerPage);

    const paginationDiv = document.createElement('div');
    paginationDiv.className = 'pagination';

    // Create Previous button
    if (pageIndex > 0) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.addEventListener('click', () => {
            displayResults(records, pageIndex - 1);
        });
        paginationDiv.appendChild(prevButton);
    }

    // Create Next button
    if (pageIndex < totalPages - 1) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.addEventListener('click', () => {
            displayResults(records, pageIndex + 1);
        });
        paginationDiv.appendChild(nextButton);
    }

    filteredResults.appendChild(paginationDiv);
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
