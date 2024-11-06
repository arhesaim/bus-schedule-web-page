document.getElementById('searchInput').addEventListener('input', filterFunction);
document.getElementById('continueButton').addEventListener('input', fetchBuses);

let allBusData = []; // Global variable to store all fetched data
let currentIndex = 0; // Index to keep track of the current position in the data



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
                    a.textContent = item.stop_name;
                    busStop = a.textContent; 
                    // Use the correct property name
                    a.addEventListener('click', function() {
                        input.value = item.stop_name; // Auto-fill the input field
                        dropdownContent.innerHTML = '';
                        continueButton.classList.remove('d-none'); // Show the "Continue" button // Clear the suggestions
                    });
                    dropdownContent.appendChild(a);
                });
            })
            .catch(error => console.error('Error fetching suggestions:', error));
    }

    
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
    console.log(stopName);
    const busList = document.getElementById('busList');
    
    // Clear previous bus list
    busList.innerHTML = '';
    allBusData = []; // Reset the global data
    currentIndex = 0; // Reset the index

    fetch(`/buses?q=${stopName}`)
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

function displayBusData() {
    const busList = document.getElementById('busList');
    let ul = busList.querySelector('ul');

    // Create the list if it doesn't exist
    if (!ul) {
        ul = document.createElement('ul');
        ul.className = 'list-group';
        busList.appendChild(ul);
    }

    // Display the next 5 items
    for (let i = currentIndex; i < currentIndex + 5 && i < allBusData.length; i++) {
        const item = allBusData[i];
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = item.departure_time + ' ' + item.route_short_name + ' ' + item.trip_long_name;
        ul.appendChild(li);
    }

    // Update the current index
    currentIndex += 5;

    // Add or move the "Show More" button if there are more items to display
    let showMoreButton = document.getElementById('showMoreButton');
    if (currentIndex < allBusData.length) {
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




function clearResults(){
    const input = document.getElementById('searchInput');
    const busList = document.getElementById('busList');
    const continueButton = document.getElementById('continueButton');
    busList.innerHTML = '';
    input.value = '';
    continueButton.classList.add('d-none');
}