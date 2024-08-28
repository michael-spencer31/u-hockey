async function fetchData(gender) {
    try {
        // Fetch data from the Flask API
        const url = `/standings_data?option=${encodeURIComponent(gender)}`;
        const response = await fetch(url);

        // Check if the response is OK (status code 200)
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        // Parse JSON data
        const data = await response.json();
        
        // Define the headers and the indexes of the 'SOL' and 'PTS' columns
        const headers = ['Team', 'GP', 'W', 'L', 'OTL', 'SOL', 'Last 10', 'Streak', 'GF', 'GA', 'G Diff', 'PTS', 'Pt %'];
        const solIndex = headers.indexOf('SOL'); // Index of 'SOL' column
        const ptsIndex = headers.indexOf('PTS'); // Index of 'PTS' column

        // Create custom header list including columns up to 'SOL' and 'PTS'
        const customHeaders = headers.slice(0, solIndex + 1).concat(headers.slice(ptsIndex, ptsIndex + 1));
        const customIndex = customHeaders.length; // The index used to slice rows

        // Skip the first row (headers) and get the rest of the data
        const tableData = data.slice(1);
        
        // Populate the table
        const table = document.getElementById('data-table');
        
        // Create table headers
        let thead = '<tr>';
        customHeaders.forEach(header => thead += `<th>${header}</th>`);
        thead += '</tr>';
        
        // Create table rows
        let tbody = '<tbody>';
        tableData.forEach(row => {
            tbody += '<tr>';
            // Add cells up to 'SOL'
            for (let i = 0; i <= solIndex; i++) {
                tbody += `<td>${row[i]}</td>`;
            }
            // Add 'PTS' cell
            tbody += `<td>${row[ptsIndex]}</td>`;
            tbody += '</tr>';
        });
        tbody += '</tbody>';
        
        // Insert headers and rows into the table
        table.innerHTML = thead + tbody;
        
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}
