// Get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

// Track attendence
let count = 0;
const maxCount = 50;
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const teamCounters = document.querySelectorAll(".team-count");
const attendeeList = document.getElementById("attendeeList");
const attendeeEmptyState = document.getElementById("attendeeEmptyState");
let attendees = [];

try {
  const savedAttendees = JSON.parse(localStorage.getItem("attendees"));
  if (Array.isArray(savedAttendees)) {
    attendees = savedAttendees;
  }
} catch (error) {
  attendees = [];
}

function addAttendeeRow(attendee) {
  const row = document.createElement("tr");
  const nameCell = document.createElement("td");
  const teamCell = document.createElement("td");

  nameCell.textContent = attendee.name;
  teamCell.textContent = attendee.team;
  row.appendChild(nameCell);
  row.appendChild(teamCell);
  attendeeList.appendChild(row);
  attendeeEmptyState.hidden = true;
}

// Restore saved attendance counts
const savedCount = parseInt(localStorage.getItem("attendanceCount"));
if (!Number.isNaN(savedCount) && savedCount >= 0) {
  count = savedCount;
}

attendeeCount.textContent = count;
const savedPercentage = Math.round((count / maxCount) * 100);
progressBar.style.width = `${savedPercentage}%`;

for (let i = 0; i < teamCounters.length; i++) {
  const savedTeamCount = parseInt(localStorage.getItem(teamCounters[i].id));
  if (!Number.isNaN(savedTeamCount) && savedTeamCount >= 0) {
    teamCounters[i].textContent = savedTeamCount;
  }
}

for (let i = 0; i < attendees.length; i++) {
  const attendee = attendees[i];
  if (
    attendee &&
    typeof attendee.name === "string" &&
    typeof attendee.team === "string"
  ) {
    addAttendeeRow(attendee);
  }
}

// Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get form values
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  console.log(name, teamName);

  // Increment count
  count++;
  console.log("Total check-ins: ", count);
  localStorage.setItem("attendanceCount", count);

  // Update progress bar
  const percentage = Math.round((count / maxCount) * 100);
  attendeeCount.textContent = count;
  progressBar.style.width = `${percentage}%`;
  console.log(`Progress: ${percentage}%`);

  // Update team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

  for (let i = 0; i < teamCounters.length; i++) {
    localStorage.setItem(teamCounters[i].id, teamCounters[i].textContent);
  }

  const attendee = { name: name, team: teamName };
  attendees.push(attendee);
  localStorage.setItem("attendees", JSON.stringify(attendees));
  addAttendeeRow(attendee);

  // Show welcome message
  const message = `Welcome, ${name} from ${teamName}!`;
  const greeting = document.getElementById("greeting");
  greeting.style.display = "block";

  if (count === maxCount) {
    const teamCards = document.querySelectorAll(".team-card");
    let highestTeamCount = -1;
    let winningTeamName = "";

    for (let i = 0; i < teamCards.length; i++) {
      const teamCard = teamCards[i];
      const currentTeamCount = parseInt(
        teamCard.querySelector(".team-count").textContent,
      );
      const currentTeamName = teamCard.querySelector(".team-name").textContent;

      if (currentTeamCount > highestTeamCount) {
        highestTeamCount = currentTeamCount;
        winningTeamName = currentTeamName;
      } else if (currentTeamCount === highestTeamCount) {
        winningTeamName += ` and ${currentTeamName}`;
      }
    }

    greeting.textContent = `Check-in goal reached! Congratulations to ${winningTeamName}!`;
    greeting.classList.add("success-message");
  } else {
    greeting.textContent = message;
    greeting.classList.remove("success-message");
  }

  console.log(message);

  form.reset(); // Reset form fields
});

