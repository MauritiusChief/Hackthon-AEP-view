// Sample JSON data
const jsonData = {
    "records": {
      "primary_key_1": {
        "date": "2024-10-15",
        "observation_type": "Fire Safety",
        "comments": "Potential fire hazard near storage area.",
        "hazard_value": {
          "severity_score": 8,
          "likelihood_score": 5,
          "impact": "Property Damage",
          "suggested_action": "Remove flammable materials"
        }
      },
      "primary_key_2": {
        "date": "2024-10-16",
        "observation_type": "Chemical Safety",
        "comments": "Leaking chemical containers in lab.",
        "hazard_value": {
          "severity_score": 9,
          "likelihood_score": 7,
          "impact": "Environmental Damage",
          "suggested_action": "Seal containers and clean up area"
        }
      }
    }
  };
  
  // Function to load data into table
  function loadTableData() {
      const tableBody = document.getElementById('tableBody');
      tableBody.innerHTML = '';  // Clear existing rows
  
      // Iterate over JSON data
      for (const key in jsonData.records) {
          const record = jsonData.records[key];
          const row = document.createElement('tr');
  
          // Create table cells for each field
          row.innerHTML = `
              <td>${record.date}</td>
              <td>${record.observation_type}</td>
              <td>${record.comments}</td>
              <td>${record.hazard_value.severity_score}</td>
              <td>${record.hazard_value.likelihood_score}</td>
              <td>${record.hazard_value.impact}</td>
              <td>${record.hazard_value.suggested_action}</td>
          `;
  
          tableBody.appendChild(row);
      }
  }
  
  // Call the function to load data when the page loads
  document.addEventListener('DOMContentLoaded', loadTableData);
  