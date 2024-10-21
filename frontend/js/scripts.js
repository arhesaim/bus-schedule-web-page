document.getElementById('searchInput').addEventListener('input', filterFunction);
document.getElementById('continueButton').addEventListener('click', showAdditionalInput);
document.getElementById('additionalInputs').addEventListener('input', filterFunctionBuses);



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
                    a.textContent = item.stop_name; // Use the correct property name
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

function showAdditionalInput() {
    const additionalInputs = document.getElementById('additionalInputs');
    additionalInputs.classList.remove('d-none'); // Show the additional input field
    
    // Attach the filterFunction to the new input field
    document.getElementById('searchInput2').addEventListener('input', filterFunction);
    
    // Hide the "Continue" button after showing the new input
    document.getElementById('continueButton').classList.add('d-none');
}


function filterFunctionBuses() {
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
                    a.textContent = item.stop_name; // Use the correct property name
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

function fetchBuses() {
    const stopName = document.getElementById('searchInput2').value;
    const busList = document.getElementById('busList');
    
    // Clear previous bus list
    busList.innerHTML = '';

    fetch(`/buses?stop=${stopName}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const ul = document.createElement('ul');
                ul.className = 'list-group';
                data.forEach(item => {
                    const li = document.createElement('li');
                    li.className = 'list-group-item';
                    li.textContent = item.bus_number; // Use the correct property name
                    ul.appendChild(li);
                });
                busList.appendChild(ul);
            } else {
                busList.textContent = 'No buses available for this stop.';
            }
        })
        .catch(error => console.error('Error fetching buses:', error));
}