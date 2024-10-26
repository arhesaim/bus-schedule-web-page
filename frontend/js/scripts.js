document.getElementById('searchInput').addEventListener('input', filterFunction);
document.getElementById('continueButton').addEventListener('input', fetchBuses);

//var busStop;



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

function fetchBuses() {
    const stopName = document.getElementById('searchInput').value;
    console.log(stopName)
    const busList = document.getElementById('busList');
    
    // Clear previous bus list
    busList.innerHTML = '';

    fetch(`/buses?q=${stopName}`)
        .then(response => response.json())
        .then(data => {
            //console.log(data)
            if (data.length > 0) {
                const ul = document.createElement('ul');
                ul.className = 'list-group';
                data.forEach(item => {
                    const li = document.createElement('li');
                    li.className = 'list-group-item';
                    li.textContent = item.route_short_name + ' ' + item.trip_long_name; // Use the correct property name
                    ul.appendChild(li);
                });
                busList.appendChild(ul);
            } else {
                busList.textContent = 'No buses available for this stop.';
            }
        })
        .catch(error => console.error('Error fetching buses:', error));
}

function clearResults(){
    const input = document.getElementById('searchInput');
    const busList = document.getElementById('busList');
    const continueButton = document.getElementById('continueButton');
    busList.innerHTML = '';
    input.value = '';
    continueButton.classList.add('d-none');
}