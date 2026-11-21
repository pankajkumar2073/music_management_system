var artists = JSON.parse(localStorage.getItem("mfm_artists")) || [];
var schedules = JSON.parse(localStorage.getItem("mfm_schedules")) || [];
var stages = JSON.parse(localStorage.getItem("mfm_stages")) || ["Uni-Polis", "Shanti Devi Mittal Auditorium"];
var slots = JSON.parse(localStorage.getItem("mfm_slots")) || [
  "10:00 AM - 12:00 PM",
  "12:00 PM - 02:00 PM",
  "02:00 PM - 04:00 PM",
  "04:00 PM - 06:00 PM",
  "06:00 PM - 08:00 PM",
  "08:00 PM - 10:00 PM"
];
var techItems = JSON.parse(localStorage.getItem("mfm_tech")) || ["Mic", "Speakers", "Lights"];

function saveAll() {
  localStorage.setItem("mfm_artists", JSON.stringify(artists));
  localStorage.setItem("mfm_schedules", JSON.stringify(schedules));
  localStorage.setItem("mfm_stages", JSON.stringify(stages));
  localStorage.setItem("mfm_slots", JSON.stringify(slots));
  localStorage.setItem("mfm_tech", JSON.stringify(techItems));
}

function toMinutes(t) {
  var parts = t.trim().split(" ");
  var hm = parts[0].split(":");
  var h = parseInt(hm[0], 10);
  var m = parseInt(hm[1] || "0", 10);
  var ampm = (parts[1] || "").toUpperCase();
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

function getArtist(id) {
  for (var i = 0; i < artists.length; i++) {
    if (artists[i].id === id) return artists[i];
  }
  return null;
}

/* ===== DASHBOARD ===== */
function renderDashboard() {
  var el;
  el = document.getElementById("countArtists"); if (el) el.innerHTML = artists.length;
  el = document.getElementById("countStages"); if (el) el.innerHTML = stages.length;
  el = document.getElementById("countSlots"); if (el) el.innerHTML = slots.length;
  el = document.getElementById("countTech"); if (el) el.innerHTML = techItems.length;
  el = document.getElementById("countSchedules"); if (el) el.innerHTML = schedules.length;
}

/* ===== ARTISTS ===== */
function addArtist() {
  var name = document.getElementById("aName").value.trim();
  var genre = document.getElementById("aGenre").value;
  var msg = document.getElementById("msg1");

  if (name === "" || genre === "") {
    msg.style.color = "red";
    msg.innerHTML = "Please fill all fields.";
    return;
  }

  var boxes = document.getElementsByName("tech");
  var techList = [];
  for (var i = 0; i < boxes.length; i++) {
    if (boxes[i].checked) techList.push(boxes[i].value);
  }

  artists.push({
    id: Date.now(),
    name: name,
    genre: genre,
    tech: techList.length > 0 ? techList.join(", ") : "None"
  });

  saveAll();
  renderArtists();
  document.getElementById("aName").value = "";
  msg.style.color = "green";
  msg.innerHTML = "Artist saved successfully!";
}

function deleteArtist(index) {
  artists.splice(index, 1);
  saveAll();
  renderArtists();
}

function renderArtists() {
  var aTable = document.getElementById("artistTable");
  if (!aTable) return;
  aTable.innerHTML = "";
  for (var i = 0; i < artists.length; i++) {
    var a = artists[i];
    aTable.innerHTML += "<tr><td>" + a.name + "</td><td>" + a.genre + "</td><td>" + a.tech + "</td><td><button class='btn-del' onclick='deleteArtist(" + i + ")'>Delete</button></td></tr>";
  }

  var checks = document.getElementById("techChecks");
  if (checks) {
    checks.innerHTML = "";
    for (var j = 0; j < techItems.length; j++) {
      checks.innerHTML += "<label><input type='checkbox' name='tech' value='" + techItems[j] + "'> " + techItems[j] + "</label> ";
    }
  }
}

/* ===== STAGES ===== */
function addStage() {
  var name = document.getElementById("stageName").value.trim();
  var msg = document.getElementById("msgStage");
  if (name === "") {
    msg.style.color = "red";
    msg.innerHTML = "Enter stage name.";
    return;
  }
  stages.push(name);
  saveAll();
  renderStages();
  document.getElementById("stageName").value = "";
  msg.style.color = "green";
  msg.innerHTML = "Stage added!";
}

function deleteStage(index) {
  stages.splice(index, 1);
  saveAll();
  renderStages();
}

function renderStages() {
  var t = document.getElementById("stageTable");
  if (!t) return;
  t.innerHTML = "";
  for (var i = 0; i < stages.length; i++) {
    t.innerHTML += "<tr><td>" + (i + 1) + "</td><td>" + stages[i] + "</td><td><button class='btn-del' onclick='deleteStage(" + i + ")'>Delete</button></td></tr>";
  }
}

/* ===== SLOTS (From - To with AM/PM selects) ===== */
function buildTime(hId, mId, aId) {
  var h = document.getElementById(hId).value;
  var m = document.getElementById(mId).value;
  var a = document.getElementById(aId).value;
  return h + ":" + m + " " + a;
}

function addSlot() {
  var from = buildTime("fromHour", "fromMin", "fromAmPm");
  var to = buildTime("toHour", "toMin", "toAmPm");
  var msg = document.getElementById("msgSlot");

  var fromMin = toMinutes(from);
  var toMin = toMinutes(to);

  if (toMin <= fromMin) {
    msg.style.color = "red";
    msg.innerHTML = "To time must be after From time.";
    return;
  }

  var slotStr = from + " - " + to;

  for (var i = 0; i < slots.length; i++) {
    if (slots[i] === slotStr) {
      msg.style.color = "red";
      msg.innerHTML = "This time slot already exists.";
      return;
    }
  }

  slots.push(slotStr);
  saveAll();
  renderSlots();
  msg.style.color = "green";
  msg.innerHTML = "Slot added: " + slotStr;
}

function deleteSlot(index) {
  slots.splice(index, 1);
  saveAll();
  renderSlots();
}

function renderSlots() {
  var t = document.getElementById("slotTable");
  if (!t) return;
  t.innerHTML = "";
  for (var i = 0; i < slots.length; i++) {
    t.innerHTML += "<tr><td>" + (i + 1) + "</td><td>" + slots[i] + "</td><td><button class='btn-del' onclick='deleteSlot(" + i + ")'>Delete</button></td></tr>";
  }
}

/* ===== TECHNICAL ===== */
function addTech() {
  var name = document.getElementById("techName").value.trim();
  var msg = document.getElementById("msgTech");
  if (name === "") {
    msg.style.color = "red";
    msg.innerHTML = "Enter tech item name.";
    return;
  }
  techItems.push(name);
  saveAll();
  renderTech();
  document.getElementById("techName").value = "";
  msg.style.color = "green";
  msg.innerHTML = "Tech item added!";
}

function deleteTech(index) {
  techItems.splice(index, 1);
  saveAll();
  renderTech();
}

function renderTech() {
  var t = document.getElementById("techTable");
  if (!t) return;
  t.innerHTML = "";
  for (var i = 0; i < techItems.length; i++) {
    t.innerHTML += "<tr><td>" + (i + 1) + "</td><td>" + techItems[i] + "</td><td><button class='btn-del' onclick='deleteTech(" + i + ")'>Delete</button></td></tr>";
  }
}

/* ===== SCHEDULE ===== */
function addSchedule() {
  var artistId = Number(document.getElementById("sArtist").value);
  var stage = document.getElementById("sStage").value;
  var date = document.getElementById("sDate").value;
  var slot = document.getElementById("sSlot").value;
  var msg = document.getElementById("msg2");

  if (!artistId || !stage || date === "" || !slot) {
    msg.style.color = "red";
    msg.innerHTML = "Please fill all fields.";
    return;
  }

  var parts = slot.split(" - ");
  var start = parts[0].trim();
  var end = parts[1].trim();
  var startMin = toMinutes(start);
  var endMin = toMinutes(end);

  for (var i = 0; i < schedules.length; i++) {
    var s = schedules[i];
    if (s.date === date && (s.stage === stage || s.artistId === artistId)) {
      if (startMin < toMinutes(s.end) && endMin > toMinutes(s.start)) {
        msg.style.color = "red";
        msg.innerHTML = "CONFLICT: Stage or Artist is already booked in this time slot!";
        return;
      }
    }
  }

  schedules.push({
    id: Date.now(),
    artistId: artistId,
    stage: stage,
    date: date,
    start: start,
    end: end
  });
  saveAll();
  renderSchedule();
  msg.style.color = "green";
  msg.innerHTML = "Stage slot booked without conflicts!";
}

function deleteSchedule(index) {
  schedules.splice(index, 1);
  saveAll();
  renderSchedule();
}

function renderSchedule() {
  var sArtist = document.getElementById("sArtist");
  if (sArtist) {
    sArtist.innerHTML = "<option value=''>-- Select Artist --</option>";
    for (var i = 0; i < artists.length; i++) {
      var a = artists[i];
      sArtist.innerHTML += "<option value='" + a.id + "'>" + a.name + " (" + a.genre + ")</option>";
    }
  }

  var sStage = document.getElementById("sStage");
  if (sStage) {
    sStage.innerHTML = "<option value=''>-- Select Stage --</option>";
    for (var i = 0; i < stages.length; i++) {
      sStage.innerHTML += "<option value='" + stages[i] + "'>" + stages[i] + "</option>";
    }
  }

  var sSlot = document.getElementById("sSlot");
  if (sSlot) {
    sSlot.innerHTML = "<option value=''>-- Select Time Slot --</option>";
    for (var i = 0; i < slots.length; i++) {
      sSlot.innerHTML += "<option value='" + slots[i] + "'>" + slots[i] + "</option>";
    }
  }

  var sTable = document.getElementById("scheduleTable");
  if (!sTable) return;
  sTable.innerHTML = "";
  for (var j = 0; j < schedules.length; j++) {
    var s = schedules[j];
    var art = getArtist(s.artistId);
    var artName = art ? art.name : "Deleted Artist";
    sTable.innerHTML += "<tr><td>" + s.date + "</td><td>" + s.start + " - " + s.end + "</td><td>" + s.stage + "</td><td>" + artName + "</td><td><button class='btn-del' onclick='deleteSchedule(" + j + ")'>Delete</button></td></tr>";
  }
}
