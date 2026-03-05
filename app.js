// Canto DAM Dashboard - Main Application
// Loads CSV data and renders visualizations

const DATA_PATH = './data/';

// Parse CSV text into array of objects
function parseCSV(text) {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^"|"$/g, ''));
        const obj = {};
        headers.forEach((h, idx) => {
            obj[h] = values[idx] || '';
        });
        data.push(obj);
    }
    return data;
}

// Load CSV file
async function loadCSV(filename) {
    try {
        const response = await fetch(DATA_PATH + filename);
        const text = await response.text();
        return parseCSV(text);
    } catch (error) {
        console.error(`Error loading ${filename}:`, error);
        return [];
    }
}

// Process upload data
function processUploads(data) {
    const uploadsByDate = {};
    
    data.forEach(row => {
        const date = row['Upload Date']?.split(' ')[0];
        if (date) {
            uploadsByDate[date] = (uploadsByDate[date] || 0) + 1;
        }
    });
    
    return {
        total: data.length,
        byDate: uploadsByDate
    };
}

// Process download data
function processDownloads(data) {
    const downloadsByDate = {};
    
    data.forEach(row => {
        const date = row['Download Date']?.split(' ')[0];
        if (date) {
            downloadsByDate[date] = (downloadsByDate[date] || 0) + 1;
        }
    });
    
    return {
        total: data.length,
        byDate: downloadsByDate
    };
}

// Process login data
function processLogins(data) {
    const loginsByDate = {};
    const users = new Set();
    
    data.forEach(row => {
        const date = row['Logged in']?.split(' ')[0];
        if (date) {
            loginsByDate[date] = (loginsByDate[date] || 0) + 1;
        }
        if (row['User']) {
            users.add(row['User']);
        }
    });
    
    return {
        total: data.length,
        byDate: loginsByDate,
        uniqueUsers: users.size
    };
}

// Process tags data
function processTags(data) {
    return data
        .map(row => ({
            name: row['Tag Name'],
            count: parseInt(row['Times Used']) || 0
        }))
        .sort((a, b) => b.count - a.count);
}

// Process search data
function processSearches(data) {
    return data
        .map(row => ({
            term: row['Search Term'],
            count: parseInt(row['Times Searched']) || 0
        }))
        .sort((a, b) => b.count - a.count);
}

// Process top downloads
function processTopDownloads(data) {
    return data
        .map(row => ({
            rank: parseInt(row['Ranking']) || 0,
            name: row['File Name'],
            downloads: parseInt(row['Downloads']) || 0,
            type: row['File Type']
        }))
        .sort((a, b) => a.rank - b.rank)
        .slice(0, 10);
}

// Get last N days from date map
function getLastNDays(dateMap, n = 30) {
    const dates = Object.keys(dateMap).sort();
    const lastNDates = dates.slice(-n);
    
    return lastNDates.map(date => ({
        date,
        value: dateMap[date] || 0
    }));
}

// Create chart
function createChart(ctx, type, data, options) {
    return new Chart(ctx, {
        type,
        data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            ...options
        }
    });
}

// Main initialization
async function init() {
    try {
        // Load all data
        const [uploads, downloads, logins, tags, searches, topDownloads] = await Promise.all([
            loadCSV('UploadHistory.csv'),
            loadCSV('DownloadHistory.csv'),
            loadCSV('LoginHistory.csv'),
            loadCSV('TopTags.csv'),
            loadCSV('TopSearch.csv'),
            loadCSV('TopDownload.csv')
        ]);
        
        // Process data
        const uploadStats = processUploads(uploads);
        const downloadStats = processDownloads(downloads);
        const loginStats = processLogins(logins);
        const tagStats = processTags(tags);
        const searchStats = processSearches(searches);
        const topDownloadStats = processTopDownloads(topDownloads);
        
        // Update stat cards
        document.getElementById('totalUploads').textContent = uploadStats.total.toLocaleString();
        document.getElementById('totalDownloads').textContent = downloadStats.total.toLocaleString();
        document.getElementById('totalLogins').textContent = loginStats.total.toLocaleString();
        document.getElementById('uniqueTags').textContent = tagStats.length.toLocaleString();
        
        // Get last 30 days data
        const uploadTrend = getLastNDays(uploadStats.byDate, 30);
        const downloadTrend = getLastNDays(downloadStats.byDate, 30);
        const loginTrend = getLastNDays(loginStats.byDate, 30);
        
        // Upload Trend Chart
        createChart(
            document.getElementById('uploadTrendChart'),
            'line',
            {
                labels: uploadTrend.map(d => d.date),
                datasets: [{
                    label: 'Uploads',
                    data: uploadTrend.map(d => d.value),
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            {
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        );
        
        // Download Trend Chart
        createChart(
            document.getElementById('downloadTrendChart'),
            'bar',
            {
                labels: downloadTrend.map(d => d.date),
                datasets: [{
                    label: 'Downloads',
                    data: downloadTrend.map(d => d.value),
                    backgroundColor: 'rgba(118, 75, 162, 0.8)',
                    borderColor: '#764ba2',
                    borderWidth: 1
                }]
            },
            {
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        );
        
        // Login Chart
        createChart(
            document.getElementById('loginChart'),
            'line',
            {
                labels: loginTrend.map(d => d.date),
                datasets: [{
                    label: 'Logins',
                    data: loginTrend.map(d => d.value),
                    borderColor: '#27ae60',
                    backgroundColor: 'rgba(39, 174, 96, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            {
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        );
        
        // Tags Chart
        createChart(
            document.getElementById('tagsChart'),
            'doughnut',
            {
                labels: tagStats.slice(0, 10).map(t => t.name),
                datasets: [{
                    data: tagStats.slice(0, 10).map(t => t.count),
                    backgroundColor: [
                        '#667eea', '#764ba2', '#f093fb', '#f5576c',
                        '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
                        '#fa709a', '#fee140'
                    ]
                }]
            },
            {
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { boxWidth: 12 }
                    }
                }
            }
        );
        
        // Populate Top Downloads table
        const downloadsTable = document.getElementById('topDownloadsTable');
        topDownloadStats.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="rank">${item.rank}</td>
                <td>${item.name}</td>
                <td>${item.downloads.toLocaleString()}</td>
                <td>${item.type}</td>
            `;
            downloadsTable.appendChild(row);
        });
        
        // Populate Top Searches table
        const searchesTable = document.getElementById('topSearchesTable');
        searchStats.slice(0, 10).forEach((item, idx) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="rank">${idx + 1}</td>
                <td>${item.term}</td>
                <td>${item.count.toLocaleString()}</td>
            `;
            searchesTable.appendChild(row);
        });
        
        // Show dashboard
        document.getElementById('loading').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        document.getElementById('loading').textContent = 'Error loading dashboard. Check console for details.';
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);
