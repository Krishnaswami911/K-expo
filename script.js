// ---------- Data ----------
const EVENTS = [
  {id:1,name:"CodeSprint Hackathon",cat:"Tech",date:"2026-12-05T09:00",venue:"Main Auditorium",emoji:"💻",color:"#6c63ff,#3b3bd6",desc:"A 24-hour build marathon. Form a team, pick a problem and ship a prototype.",long:"Teams of up to four build a working prototype in 24 hours. Mentors from the industry are on site, and the top three teams win prizes and internship interviews."},
  {id:2,name:"Winter Beats Night",cat:"Music",date:"2026-12-12T18:30",venue:"Open Air Theatre",emoji:"🎸",color:"#ff7eb3,#ff5d5d",desc:"Live bands, a DJ set and food stalls under the stars.",long:"Five student bands and one headline act perform live. Gates open at 6 PM, food stalls stay open until midnight."},
  {id:3,name:"UI/UX Design Workshop",cat:"Workshop",date:"2026-12-18T10:00",venue:"Design Lab, Block C",emoji:"🎨",color:"#ffb347,#ff7b54",desc:"Learn Figma and design a mobile app screen in one morning.",long:"A hands-on session covering wireframes, colour, typography and prototyping. Bring a laptop with Figma installed."},
  {id:4,name:"Inter-College Cricket Cup",cat:"Sports",date:"2027-01-09T08:00",venue:"University Ground",emoji:"🏏",color:"#43cea2,#185a9d",desc:"Sixteen teams, one trophy. T20 knockout format.",long:"Matches run from 8 AM. Each team registers 11 players plus 4 substitutes. Spectators are welcome and entry is free."},
  {id:5,name:"AI & Robotics Expo",cat:"Tech",date:"2027-01-16T11:00",venue:"Innovation Hall",emoji:"🤖",color:"#7f7fd5,#86a8e7",desc:"Live robot demos, project showcases and a panel on the future of AI.",long:"Over 40 student projects are on display. Vote for the audience favourite and join the closing panel at 4 PM."},
  {id:6,name:"Startup Pitch Day",cat:"Business",date:"2027-01-23T14:00",venue:"Seminar Hall 2",emoji:"🚀",color:"#f7971e,#d4a000",desc:"Pitch your idea to investors and win seed funding.",long:"Ten shortlisted teams get five minutes each to pitch to a panel of investors, followed by Q&A and networking."},
  {id:7,name:"Cultural Fest: Rang",cat:"Culture",date:"2027-02-06T10:00",venue:"Campus Quad",emoji:"🎭",color:"#c471ed,#f64f59",desc:"Dance, drama and art exhibitions across two days of celebration.",long:"Compete in dance, drama, poetry and painting. Final performances take place on the evening of day two."},
  {id:8,name:"Photography Walk",cat:"Workshop",date:"2027-02-14T06:30",venue:"Botanical Garden",emoji:"📷",color:"#56ab2f,#2e7d4f",desc:"Golden-hour shooting session guided by a professional photographer.",long:"Learn composition and light while walking through the garden. Phone cameras are fine, and the best photo wins a print."}
];

// ---------- Helpers ----------
const $ = s => document.querySelector(s);
const fmt = d => new Date(d).toLocaleString("en-IN",{weekday:"short",day:"numeric",month:"short",year:"numeric",hour:"numeric",minute:"2-digit"});
const KEY = "pulse_registrations";
const getRegs = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const saveRegs = r => { try { localStorage.setItem(KEY, JSON.stringify(r)); } catch {} };
const esc = s => s.replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const grad = e => `linear-gradient(135deg,${e.color})`;

// ---------- Theme ----------
const root = document.documentElement;
root.dataset.theme = localStorage.getItem("pulse_theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
$("#themeBtn").onclick = () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("pulse_theme", root.dataset.theme);
};

// ---------- Browse, search, filter ----------
let activeCat = "All";
const cats = ["All", ...new Set(EVENTS.map(e => e.cat))];
$("#chips").innerHTML = cats.map(c => `<button class="chip ${c==="All"?"on":""}" data-cat="${c}">${c}</button>`).join("");
$("#chips").onclick = ev => {
  const b = ev.target.closest(".chip"); if (!b) return;
  activeCat = b.dataset.cat;
  document.querySelectorAll(".chip").forEach(c => c.classList.toggle("on", c === b));
  render();
};
$("#search").oninput = render;

function render() {
  const q = $("#search").value.trim().toLowerCase();
  const list = EVENTS.filter(e =>
    (activeCat === "All" || e.cat === activeCat) &&
    (e.name + e.venue + e.desc + e.cat).toLowerCase().includes(q));
  $("#grid").innerHTML = list.map(e => `
    <article class="card" data-id="${e.id}" tabindex="0">
      <div class="thumb" style="background:${grad(e)}"><span class="tag">${e.cat}</span>${e.emoji}</div>
      <div class="card-body">
        <h3>${e.name}</h3>
        <div class="meta">📅 ${fmt(e.date)}<br>📍 ${e.venue}</div>
        <p>${e.desc}</p>
        <span class="btn">View details</span>
      </div>
    </article>`).join("");
  $("#empty").hidden = list.length > 0;
}
$("#grid").onclick = ev => { const c = ev.target.closest(".card"); if (c) openDetail(+c.dataset.id); };
$("#grid").onkeydown = ev => { if (ev.key === "Enter") ev.target.click(); };

// ---------- Event details ----------
function openDetail(id) {
  const e = EVENTS.find(x => x.id === id);
  const dlg = $("#detailDlg");
  dlg.innerHTML = `
    <button class="close" data-close aria-label="Close">×</button>
    <div class="d-thumb" style="background:${grad(e)}">${e.emoji}</div>
    <h3>${e.name}</h3>
    <p>${e.long}</p>
    <div class="d-info"><span>📅 ${fmt(e.date)}</span><span>📍 ${e.venue}</span><span>🏷️ ${e.cat}</span></div>
    <button class="btn alt" id="regFromDetail">Register for this event</button>`;
  dlg.showModal();
  $("#regFromDetail").onclick = () => { dlg.close(); openRegister(id); };
}

// ---------- Registration ----------
const form = $("#regForm");
$("#eventSel").innerHTML = `<option value="">Select an event</option>` + EVENTS.map(e => `<option value="${e.id}">${e.name}</option>`).join("");

function openRegister(id) {
  form.reset(); form.hidden = false; $("#success").hidden = true;
  form.querySelectorAll("input,select").forEach(clear);
  if (id) $("#eventSel").value = id;
  $("#regDlg").showModal();
}

const rules = {
  name: v => !v.trim() ? "Enter your full name." : !/^[A-Za-z][A-Za-z .'-]{1,59}$/.test(v.trim()) ? "Use letters only, at least 2 characters." : "",
  email: v => !v.trim() ? "Enter your email address." : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "Enter a valid email, like name@example.com." : "",
  phone: v => !v.trim() ? "Enter your phone number." : !/^[6-9]\d{9}$/.test(v.trim()) ? "Enter a 10-digit mobile number starting with 6, 7, 8 or 9." : "",
  event: v => !v ? "Choose an event." : ""
};
function check(el) {
  const msg = rules[el.name](el.value);
  el.classList.toggle("invalid", !!msg);
  el.classList.toggle("valid", !msg);
  el.parentElement.querySelector(".err").textContent = msg;
  return !msg;
}
function clear(el) { el.classList.remove("invalid","valid"); el.parentElement.querySelector(".err").textContent = ""; }
form.querySelectorAll("input,select").forEach(el => el.addEventListener("blur", () => check(el)));

form.onsubmit = ev => {
  ev.preventDefault();
  const fields = [...form.querySelectorAll("input,select")];
  const ok = fields.map(check).every(Boolean);   // run every check so all errors show
  if (!ok) { form.querySelector(".invalid").focus(); return; }

  const e = EVENTS.find(x => x.id === +form.event.value);
  const regs = getRegs();
  if (regs.some(r => r.eventId === e.id && r.email === form.email.value.trim().toLowerCase())) {
    $("#email").classList.add("invalid");
    $("#email").parentElement.querySelector(".err").textContent = "This email is already registered for this event.";
    return;
  }
  regs.push({eventId:e.id, event:e.name, name:form.name.value.trim(), email:form.email.value.trim().toLowerCase(), phone:form.phone.value.trim(), at:new Date().toISOString()});
  saveRegs(regs);
  updateCount();
  $("#successMsg").textContent = `Thanks ${form.name.value.trim()}, your spot at ${e.name} is confirmed. A confirmation was saved for ${form.email.value.trim()}.`;
  form.hidden = true; $("#success").hidden = false;
};

// ---------- My registrations ----------
function updateCount() { $("#regCount").textContent = getRegs().length; }
$("#myRegBtn").onclick = () => {
  const regs = getRegs();
  $("#myList").innerHTML = regs.length
    ? regs.map((r,i) => `<li><span><strong>${esc(r.event)}</strong><br><small>${esc(r.name)} · ${esc(r.email)}</small></span><button data-del="${i}">Cancel</button></li>`).join("")
    : `<li>No registrations yet. Pick an event to get started.</li>`;
  $("#myDlg").showModal();
};
$("#myList").onclick = ev => {
  const i = ev.target.dataset.del; if (i === undefined) return;
  const regs = getRegs(); regs.splice(+i,1); saveRegs(regs); updateCount(); $("#myRegBtn").click();
};

// ---------- Dialog closing ----------
document.addEventListener("click", ev => {
  const d = ev.target.closest("dialog");
  if (ev.target.closest("[data-close]") && d) d.close();
  else if (ev.target.tagName === "DIALOG") ev.target.close();   // click on backdrop
});

// ---------- Hero countdown ----------
function tick() {
  const next = EVENTS.filter(e => new Date(e.date) > Date.now()).sort((a,b) => new Date(a.date) - new Date(b.date))[0];
  const box = $("#nextCard");
  if (!next) { box.innerHTML = "<h3>New events coming soon</h3>"; return; }
  let s = Math.floor((new Date(next.date) - Date.now()) / 1000);
  const [d,h,m,sec] = [Math.floor(s/86400), Math.floor(s%86400/3600), Math.floor(s%3600/60), s%60];
  box.innerHTML = `<small>Happening next</small><h3>${next.emoji} ${next.name}</h3>
    <div class="timer"><div><b>${d}</b><span>days</span></div><div><b>${h}</b><span>hrs</span></div><div><b>${m}</b><span>min</span></div><div><b>${sec}</b><span>sec</span></div></div>`;
}
tick(); setInterval(tick, 1000);

// ---------- Init ----------
render(); updateCount();
