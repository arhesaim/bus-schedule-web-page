document.getElementById('searchInput').addEventListener('input', filterFunction);
document.getElementById('continueButton').addEventListener('input', fetchBuses);

let allBusData = []; // Global variable to store all fetched data
let currentIndex = 0; // Index to keep track of the current position in the data
let stopIdInfo;
let locationData;
// Fetch and display the user's time when the page loads
window.onload = fetchUserTime;
var map = L.map('map').setView([58.9483, 23.6279], 7);

document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
});

function filterFunction() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();
    const dropdownContent = document.getElementById('dropdownContent');
    const continueButton = document.getElementById('continueButton');
    
    // Clear previous suggestions
    dropdownContent.innerHTML = '';

    if (filter) {
        fetch(`/suggestions?q=${filter}`)
            .then(response => response.json())
            .then(data => {
                data.forEach(item => {
                    const a = document.createElement('a');
                    a.href = '#';
                    a.className = 'list-group-item list-group-item-action';
                    a.textContent = item.stop_name + ' ' + item.stop_id;
                    
                    busStop = a.textContent; 
                    // Use the correct property name
                    a.addEventListener('click', function() {
                        input.value = item.stop_name; // Auto-fill the input field
                        stopIdInfo = item.stop_id;
                        allBusData = [item.stop_lat, item.stop_lon];
                        console.log(allBusData);
                        L.marker(allBusData).addTo(map);
                        map.setView(allBusData, 13);
                        dropdownContent.innerHTML = '';
                        continueButton.classList.remove('d-none'); // Show the "Continue" button // Clear the suggestions
                    });
                    dropdownContent.appendChild(a);
                });
            })
            .catch(error => console.error('Error fetching suggestions:', error));
    }

    
}

function initializeMap() {
    //var map = L.map('map').setView([58.9483, 23.6279], 7);// Center the map around the first coordinate
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


}


// function filterFunctionSchedule() {
//     //const input = document.getElementById('searchInput');
//     //const filter = input.value.toLowerCase();
//     //const dropdownContent = document.getElementById('dropdownContent');
//     const continueButton = document.getElementById('continueButton');
    
//     // Clear previous suggestions
//     dropdownContent.innerHTML = '';

//     if (filter) {
//         fetch(`/buses?q=${filter}`)
//             .then(response => response.json())
//             .then(data => {
//                 data.forEach(item => {
//                     const a = document.createElement('a');
//                     a.href = '#';
//                     a.className = 'list-group-item list-group-item-action';
//                     a.textContent = item.stop_name; // Use the correct property name
//                     a.addEventListener('click', function() {
//                         input.value = "item.stop_name + item."; // Auto-fill the input field
//                         dropdownContent.innerHTML = '';
//                         //continueButton.classList.remove('d-none'); // Show the "Continue" button // Clear the suggestions
//                     });
//                     dropdownContent.appendChild(a);
//                 });
//             })
//             .catch(error => console.error('Error fetching suggestions:', error));
//     }

    
// }

// function fetchBuses() {
//     const stopName = document.getElementById('searchInput').value;
//     console.log(stopName)
//     const busList = document.getElementById('busList');
    
//     // Clear previous bus list
//     busList.innerHTML = '';

//     fetch(`/buses?q=${stopName}`)
//         .then(response => response.json())
//         .then(data => {
//             //console.log(data)
//             if (data.length > 0) {
//                 const ul = document.createElement('ul');
//                 ul.className = 'list-group';
//                 data.forEach(item => {
//                     const li = document.createElement('li');
//                     li.className = 'list-group-item';
//                     li.textContent = item.departure_time + ' ' + item.route_short_name + ' ' + item.trip_long_name; // Use the correct property name
//                     ul.appendChild(li);
//                 });
//                 busList.appendChild(ul);
//             } else {
//                 busList.textContent = 'No buses available for this stop.';
//             }
//         })
//         .catch(error => console.error('Error fetching buses:', error));


function fetchBuses() {
    const stopName = document.getElementById('searchInput').value;
    //console.log(stopName);
    const busList = document.getElementById('busList');
    
    // Clear previous bus list
    busList.innerHTML = '';
    allBusData = []; // Reset the global data
    currentIndex = 0; // Reset the index

    fetch(`/buses?stopName=${stopName}&stopId=${stopIdInfo}`)
    //fetch(`/buses?stopName=${stopName}`)
        .then(response => response.json())
        .then(data => {
            allBusData = data; // Store the fetched data
            if (allBusData.length > 0) {
                displayBusData(); // Display the first set of data
            } else {
                busList.textContent = 'No buses available for this stop.';
            }
        })
        .catch(error => console.error('Error fetching buses:', error));    
}

// Helper function to convert HH:MM:SS time to milliseconds since start of the day
function convertToMilliseconds(timeString) {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return (hours * 3600 + minutes * 60 + seconds) * 1000;
}

// Function to sort bus data based on the closest departure times
function sortBusDataByTime(busData) {
    const now = new Date();
    const nowMs = (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) * 1000;

    return busData.sort((a, b) => {
        const timeA = convertToMilliseconds(a.departure_time);
        const timeB = convertToMilliseconds(b.departure_time);

        // Adjust times for comparison
        const adjustedTimeA = timeA < nowMs ? timeA + 24 * 3600 * 1000 : timeA;
        const adjustedTimeB = timeB < nowMs ? timeB + 24 * 3600 * 1000 : timeB;

        return adjustedTimeA - adjustedTimeB;
    });
}

function displayBusData() {
    const busList = document.getElementById('busList');
    let ul = busList.querySelector('ul');

    // Create the list if it doesn't exist
    if (!ul) {
        ul = document.createElement('ul');
        ul.className = 'list-group';
        busList.appendChild(ul);
    }

    // Sort bus data by closest departure times
    const sortedBusData = sortBusDataByTime(allBusData);

    // Display the next 5 items
    for (let i = currentIndex; i < currentIndex + 5 && i < sortedBusData.length; i++) {
        const item = sortedBusData[i];
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `${item.departure_time} - ${item.route_short_name} ${item.trip_long_name}`;
        ul.appendChild(li);
    }

    // Update the current index
    currentIndex += 5;

    // Add or move the "Show More" button if there are more items to display
    let showMoreButton = document.getElementById('showMoreButton');
    if (currentIndex < sortedBusData.length) {
        if (!showMoreButton) {
            showMoreButton = document.createElement('button');
            showMoreButton.id = 'showMoreButton';
            showMoreButton.className = 'btn btn-primary mt-2';
            showMoreButton.textContent = 'Show More';
            showMoreButton.onclick = displayBusData;
            busList.appendChild(showMoreButton);
        } else {
            busList.appendChild(showMoreButton); // Move the button to the end
        }
    } else if (showMoreButton) {
        showMoreButton.remove(); // Remove the button if no more items to display
    }
}


function fetchUserTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    document.getElementById('userTime').textContent = `Current Time: ${formattedTime}`;
}

function clearResults(){
    const input = document.getElementById('searchInput');
    const busList = document.getElementById('busList');
    const continueButton = document.getElementById('continueButton');
    busList.innerHTML = '';
    input.value = '';
    continueButton.classList.add('d-none');
}

// Function to load maakonds
function loadMaakonds() {
    fetch('/getMaakonds')
        .then(response => response.json())
        .then(data => {
            const maakondList = document.getElementById('maakondList');
            maakondList.innerHTML = ''; // Clear existing items

            if (data.length === 0) {
                console.log('No maakonds found');
                const emptyMessage = document.createElement('li');
                emptyMessage.className = 'list-group-item';
                emptyMessage.textContent = 'No maakonds available';
                maakondList.appendChild(emptyMessage);
            } else {
                data.forEach(maakond => {
                    console.log('Adding maakond:', maakond.authority); // Debugging log
                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item';
                    listItem.textContent = maakond.authority;
                    maakondList.appendChild(listItem);
                });
            }
        })
        .catch(error => console.error('Error fetching maakonds:', error));
}
