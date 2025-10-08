const faculties = [];
const batches = ["Batch A", "Batch B", "Batch C", "Batch D", "Batch E"];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const periodsPerDay = 6;
let timetables = {};

function addFaculty() {
  const name = document.getElementById("faculty").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const hours = parseInt(document.getElementById("hours").value);
  const batch = document.getElementById("batch").value;

  if (!name || !subject || !hours || !batch) {
    alert("Please fill all fields!");
    return;
  }

  faculties.push({ name, subject, hours, batch });
  alert(`✅ Added: ${name} - ${subject} (${batch}, ${hours} hrs/week)`);

  document.getElementById("faculty").value = "";
  document.getElementById("subject").value = "";
  document.getElementById("hours").value = "";
  document.getElementById("batch").value = "";
}

function generateTimetables() {
  if (faculties.length === 0) {
    alert("Please add at least one faculty!");
    return;
  }

  // Initialize all batch timetables
  timetables = {};
  batches.forEach(b => {
    timetables[b] = {};
    days.forEach(day => timetables[b][day] = Array(periodsPerDay).fill("—"));
  });

  for (let fac of faculties) {
    let remaining = fac.hours;
    let attempts = 0;

    while (remaining > 0 && attempts < 300) {
      const day = days[Math.floor(Math.random() * days.length)];
      const period = Math.floor(Math.random() * periodsPerDay);

      if (timetables[fac.batch][day][period] === "—") {
        // Faculty clash check across batches
        const clash = batches.some(batch => timetables[batch][day][period].includes(fac.name));

        if (!clash) {
          timetables[fac.batch][day][period] = `${fac.subject} (${fac.name})`;
          remaining--;
        }
      }
      attempts++;
    }

    if (remaining > 0) {
      document.getElementById("alertMsg").innerText =
        `⚠️ Could not allocate all hours for ${fac.name} in ${fac.batch}. Try fewer hours or more slots.`;
      return;
    }
  }

  document.getElementById("alertMsg").innerText = "";
  renderAllTables();
  alert("🎉 All timetables generated successfully!");
}

function renderAllTables() {
  const section = document.getElementById("batchTables");
  section.innerHTML = "";

  batches.forEach(batch => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3 class="batch-title">${batch}</h3>
      <table>
        <thead>
          <tr>
            <th>Day</th>
            ${Array.from({length: periodsPerDay}, (_, i) => `<th>Period ${i+1}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${days.map(day => `
            <tr>
              <td><b>${day}</b></td>
              ${timetables[batch][day].map(slot => `<td>${slot}</td>`).join('')}
            </tr>`).join('')}
        </tbody>
      </table>
    `;
    section.appendChild(div);
  });
}
