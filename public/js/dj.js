let timeslots = [];
let djs = [];

fetch('/api/djs')
    .then(response => response.json())
    .then(data => {
        djs = data;
    });

fetch('/api/timeslots')
    .then(response => response.json())
    .then(data => {
        timeslots = data;
        populateTimeSlots();
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

document.getElementById('time-slot').addEventListener('change', function() {
    const selectedTime = this.value
    //const matchedEvents = djs.events.filter(djs.events.timeslot == selectedTime);
    displaySongs(selectedTime, 'dj-songs');
});

function displaySongs(selectedTime, elementID) {
    const songList = document.getElementById(elementID);
    songList.innerHTML = '';

    djs.forEach(dj => {
        dj.events.forEach(event =>{
            if(event.time == selectedTime){
                const song = event.songs;
                if(song.length == 0){
                    return;
                }
            
                const tr = document.createElement('tr');
    
                const djName = document.createElement('th');
                djName.innerText = `${event.dj}`;
                tr.appendChild(djName);
    
                const sList = document.createElement('th');
                sList.innerText = `${event.songs.join(', ')}`;
                tr.appendChild(sList);

                songList.appendChild(tr);
            }
        })
    });

    if (songList.childNodes.length == 0) {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        const h4 = document.createElement('h4');
        h4.innerText = 'No events scheduled for this time';
        th.appendChild(h4);
        tr.appendChild(th);
        songList.appendChild(tr);
        return;
    }
}