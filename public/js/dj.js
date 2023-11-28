let timeslots = [];

fetch('/api/timeslots')
  .then(response => response.json())
  .then(data => {
    timeslots = data;
    populateTimeSlots(); // Populate the time slot dropdown once the data is fetched
  });

function populateTimeSlots() {
    const timeslotSelect = document.getElementById('time-slot');
    timeslots.forEach(timeslot => {
      const option = document.createElement('option');
      option.value = timeslot.slot;
      option.innerText = timeslot.slot;
      timeslotSelect.appendChild(option);
    });
}