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

async function get_leaders () {

    try {
        const url = `/leaders_data`;
		const response = await fetch(url);
        const table = document.getElementById('myTable');

        let tbody = '<tbody>';
        const headers = ['Rank', 'Player', 'Team', 'GP', 'Goals', 'Assists', 'Points', '+/-'];
        let thead = '<tr>';
        headers.forEach((header, index) => {
            thead += `<th data-column="${index}" data-sort-direction="asc">${header}</th>`;
        });       
        thead += '</tr>';
        const dataString = await response.json();

		dataString.forEach(row => {
            tbody += '<tr>';
                for (let i = 0; i < headers.length; i++) {

                    tbody += `<td>${row[i] === undefined ? ' ' : row[i]}</td>`;
                }
                tbody += '</tr>';
        });
        tbody += '</tbody>';
        table.innerHTML = thead + tbody;

        addSortingFunctionality();
    } catch (error) {
        console.error('Error fetching data', error);
    }
}
// function to get schedule
async function fetch_schedule (gender) {
    try {
        
        const url = `/schedule_data?option=${encodeURIComponent(gender)}`;
        const response = await fetch(url);
        // Check if the response is OK (status code 200)
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const headers = ['Date', 'Away', '', 'Home', '', 'Time', 'Stream'];
        // Parse JSON data
        const dataString = await response.json();
        const table = document.getElementById('data-table');

        let thead = '<tr>';
        headers.forEach(header => thead += `<th>${header}</th>`);
        thead += '</tr>';

        let tbody = '<tbody>';
        dataString.forEach(row => {
            tbody += '<tr>';
                for (let i = 0; i < 7; i++) {

                    if (row[i] === undefined) {
                        tbody += `<td>${' '}</td>`;
                    } else {
                        tbody += `<td>${row[i]}</td>`;
                    }
                }
        });
        tbody += '</tbody>';
        table.innerHTML = thead + tbody;
    } catch (error) {
        console.error('There was a problem with the fetch operation', error);
    }
}

function compare (a, b) {
    if (!isNaN(a) && !isNaN(b)) {
        return Number(a) - Number(b);
    }
    return a.localeCompare(b);
}

function addSortingFunctionality() {
    const table = document.getElementById('myTable');
    const headers = table.querySelectorAll('th');
    const tbody = table.querySelector('tbody');

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const columnIndex = header.dataset.column;
            const sortDirection = header.dataset.sortDirection;

            // Determine new sort direction
            const newSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
            header.dataset.sortDirection = newSortDirection;

            // Sort the table
            sortTable(columnIndex, newSortDirection);
        });
    });

    function sortTable(columnIndex, direction) {
        const rowsArray = Array.from(tbody.querySelectorAll('tr'));

        rowsArray.sort((rowA, rowB) => {
            const cellA = rowA.querySelector(`td:nth-child(${parseInt(columnIndex) + 1})`).textContent.trim();
            const cellB = rowB.querySelector(`td:nth-child(${parseInt(columnIndex) + 1})`).textContent.trim();

            if (direction === 'asc') {
                return cellA.localeCompare(cellB, undefined, { numeric: true });
            } else {
                return cellB.localeCompare(cellA, undefined, { numeric: true });
            }
        });

        // Remove existing rows
        tbody.innerHTML = '';

        // Append sorted rows
        rowsArray.forEach(row => tbody.appendChild(row));
    }
}
