const events = [
    {
      startTime: "00:00",
      endTime: "01:30",
      color: "#f6be23",
      title: "#TeamDevkode",
    },
    {
      startTime: "4:30",
      endTime: "7:30",
      color: "#f6501e",
      title: "#TeamDevkode",
    },
    {
      startTime: "12:00",
      endTime: "13:30",
      color: "#029be5",
      title: "#TeamDevkode",
    },
    {
      startTime: "9:00",
      endTime: "10:00",
      color: "#029be5",
      title: "#TeamDevkode",
    },
    {
      startTime: "16:00",
      endTime: "19:00",
      color: "#029be5",
      title: "#TeamDevkode",
    },
    {
      startTime: "20:30",
      endTime: "22:30",
      color: "#029be5",
      title: "#TeamDevkode",
    },
  ]

function renderEvents(groupedEvents) {
    const calendar = document.querySelector('#calendar');
    for(let i=0 ; i < 12;i++){
        const eventElement = document.createElement('div');
        eventElement.classList.add('event');
        const timeElement = document.createElement('span')
        const time = new Date(0, 0, 0, i,0); // Create a date object for formatting
        const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        timeElement.innerText = timeString
        eventElement.appendChild(timeElement)
        const divider = document.createElement('div')
        divider.classList.add('divider')
        eventElement.appendChild(divider)
        calendar.appendChild(eventElement);
    }
    // groupedEvents.forEach(group => {
    //     const column = document.createElement('div');
    //     column.classList.add('event-column');

    //     group.forEach(event => {
    //         const eventElement = document.createElement('div');
    //         eventElement.classList.add('event');
    //         eventElement.style.backgroundColor = event.color;
    //         eventElement.style.height = `${(event.end - event.start) * 2}px`; // e.g., 2px per minute
    //         eventElement.style.top = `${event.start * 2}px`;
    //         eventElement.textContent = event.title;
    //         column.appendChild(eventElement);
    //         const [hour,minute]= event.startTime.split(":").map(Number);
    //         const time = new Date(0, 0, 0, hour,minute); // Create a date object for formatting
    //         const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    //         eventElement.classList.add('time-slot');
    //         eventElement.dataset.time = timeString;
    //         eventElement.textContent = timeString;

    //     });

    //     calendar.appendChild(column);
    // });
}

function parseTime(time) {
    const [hour, minute] = time.match(/(\d+):(\d+)/).slice(1).map(Number);
    const isPM = time.includes('PM');
    return (isPM && hour !== 12 ? hour + 12 : hour % 12) * 60 + minute;
}

function isOverlapping(event1, event2) {
    return event1.start < event2.end && event2.start < event1.end;
}

function groupEvents(events) {
    
    events.sort((a, b) => a.start - b.start);
    const groups = [];
    events.forEach(event => {
        let placed = false;
        for (const group of groups) {
            if (!group.some(e => isOverlapping(e, event))) {
                group.push(event);
                placed = true;
                break;
            }
        }
        if (!placed) groups.push([event]);
    });
    console.log("GROUPS",groups)
    return groups;
}

events.forEach(event=>{
    event.start = parseTime(event.startTime);
    event.end = parseTime(event.endTime);
})

const groupedEvents = groupEvents(events);
renderEvents(groupedEvents)
