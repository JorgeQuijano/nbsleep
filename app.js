/* nbsleep — data + age calculator. No tracking, no server. */
(function () {
  "use strict";

  /* ------------------------------------------------------------------ *
   * Data
   * Weekly rows 0–16 weeks: consensus ranges compiled from AAP (HealthyChildren.org),
   * CDC, NHS, Stanford Children's, Cleveland Clinic, Johns Hopkins, CHOP and the
   * week-by-week guides (BabySleepSite, The Sleep Lady, The NCSA, Huckleberry).
   * Monthly rows 3–12 months: same sources + Raising Children Network, Wermom.
   * Wake windows are in minutes (low/high) for the next-sleep helper.
   * ------------------------------------------------------------------ */

  var WEEKS = [
    { w: 0, total: "16–18 h", split: "no day/night rhythm — ~8 h / ~8 h", naps: "6–8, no pattern", ww: "30–60 min", wwMin: 30, wwMax: 60, night: "Feeds every 2–3 h", feeds: "8–12", note: "Still in the “fourth trimester”: day and night look the same, and that’s biology — not a habit you created. Feed on demand; wake to feed if your pediatrician advised it until weight gain is steady." },
    { w: 1, total: "16–18 h", split: "~8 h / ~8 h, fragmented", naps: "6–8", ww: "30–60 min", wwMin: 30, wwMax: 60, night: "Feeds every 2–3 h", feeds: "8–12", note: "Sleep comes in ~2-hour chunks. Evening cluster feeding is normal. Start steering day vs night: bright, social days; dark, boring nights." },
    { w: 2, total: "15–17 h", split: "night 8–9 / day 7–8", naps: "5–7", ww: "30–60 min", wwMin: 30, wwMax: 60, night: "Every 2–3 h", feeds: "8–12", note: "A 2–3 week growth spurt bumps feeds and fussiness for a day or two. If day and night are flipped, keep any single nap under 2–3 h." },
    { w: 3, total: "14–16 h", split: "night 8–9 / day 6–8", naps: "5–6", ww: "45–60 min", wwMin: 45, wwMax: 60, night: "Every 2–3 h", feeds: "8–12", note: "More alert stretches (up to ~1 h) and early social smiles. Fussiness builds through the day — it often peaks around 6 weeks." },
    { w: 4, total: "14–16 h", split: "night 8–9 / day 6–8", naps: "5–6", ww: "45–60 min", wwMin: 45, wwMax: 60, night: "Every 2–3 h; a first 3–4 h stretch may appear", feeds: "8–12", note: "Some babies start one longer night stretch. If weight gain is on track, ask your pediatrician whether you still need to wake baby for feeds." },
    { w: 5, total: "14–16 h", split: "night 8–10 / day 5–7", naps: "5–6", ww: "45–75 min", wwMin: 45, wwMax: 75, night: "2–3+ per night", feeds: "7–9", note: "Sleep cycles are only ~30–40 min, so mid-nap stirrings are normal. Swaddle + white noise can help baby resettle." },
    { w: 6, total: "14–16 h", split: "night 8–10 / day 5–7", naps: "4–5", ww: "45–75 min", wwMin: 45, wwMax: 75, night: "2–3+ per night", feeds: "7–9", note: "Fussiness often peaks now (6-week growth spurt). Naps start to organize — the first nap of the day is usually the first to lengthen. Protect it." },
    { w: 7, total: "14–16 h", split: "night 9–10 / day 5–7", naps: "4–5", ww: "45–75 min", wwMin: 45, wwMax: 75, night: "2–3", feeds: "7–9", note: "Evening fussiness fades and bedtime drifts earlier. One evening cluster feed may get dropped." },
    { w: 8, total: "14–16 h", split: "night 10–12 / day 3–4", naps: "4–5", ww: "60–90 min", wwMin: 60, wwMax: 90, night: "2–3 (1–2 if formula-fed)", feeds: "7–9", note: "8-week growth spurt. A single 5-hour stretch now counts as “sleeping through” in baby terms — celebrate it. If baby is rolling, it’s time to retire the swaddle." },
    { w: 9, total: "14–16 h", split: "night 11–12 / day 3–4", naps: "3–4", ww: "60–90 min", wwMin: 60, wwMax: 90, night: "2–3", feeds: "6–8", note: "A loose schedule is forming. The morning nap and crib naps get more predictable." },
    { w: 10, total: "14–16 h", split: "night 11–12 / day 3–4", naps: "3–4", ww: "75–105 min", wwMin: 75, wwMax: 105, night: "2–3", feeds: "6–8", note: "Bedtime often settles around 7–8 pm. Keep the last stretch of the day calm and dim." },
    { w: 11, total: "14–15 h", split: "night 11–12 / day 3–4", naps: "3–4", ww: "75–105 min", wwMin: 75, wwMax: 105, night: "2–3 (formula babies often 1–2)", feeds: "6–8", note: "Total sleep starts trending down gently; some naps shorten. A good week to move naps into the crib." },
    { w: 12, total: "13–15 h", split: "night 11–12 / day 3–4", naps: "3–4", ww: "90–120 min", wwMin: 90, wwMax: 120, night: "2–3 (1–2 if formula-fed)", feeds: "5–6", note: "≈3 months. Keep awake time under ~2 h. The 4-month regression can start anywhere from ~12 weeks — that’s normal." },
    { w: 13, total: "14–15 h", split: "night 11–12 / day 3–4", naps: "3–4", ww: "90–120 min", wwMin: 90, wwMax: 120, night: "1–2", feeds: "5–6", note: "The first wake window of the day stays shortest; the one before bed grows longest." },
    { w: 14, total: "14–15 h", split: "night 11–12 / day 3–4", naps: "3–4 (some drop to 3)", ww: "90–120 min", wwMin: 90, wwMax: 120, night: "1–2", feeds: "5–6", note: "Some babies merge into 3 solid naps around now. If 4 naps fight bedtime, shorten the last one." },
    { w: 15, total: "14–15 h", split: "night 11–12 / day 3–4", naps: "3–4", ww: "90–120 min", wwMin: 90, wwMax: 120, night: "1–2", feeds: "5–6", note: "Week-to-week changes slow down from here — the month-by-month table takes over." },
    { w: 16, total: "14–15 h (trending to 12–16)", split: "night 11–12 / day 3–4", naps: "3–4", ww: "90–120 min", wwMin: 90, wwMax: 120, night: "1–2", feeds: "5–6", note: "≈4 months: the “4-month regression” window. Sleep cycles mature to adult-style 45–60 min — more wakings and shorter naps now are development, not decline." }
  ];

  var MONTHS = [
    { m: 3, total: "14–16 h", split: "night 9–11 / day 4–5", naps: "3–4", ww: "75–120 min", wwMin: 75, wwMax: 120, night: "1–2 wakings (may still feed once)", feeds: "5–6", note: "The 4→3 nap transition may start now. Bedtime firms up (~7–8 pm) and sleep architecture matures toward adult cycles." },
    { m: 4, total: "14–16 h", split: "night 10–11 / day 3.5–4.5", naps: "3–4", ww: "1.5–2 h", wwMin: 90, wwMax: 120, night: "Variable — regression window", feeds: "5–6", note: "The famous 4-month regression: sleep cycles mature to 45–60 min; frequent wakings and short naps for 2–6 weeks are normal. Keep wake windows to ~2 h max." },
    { m: 5, total: "13–15 h", split: "night 10–11 / day 3–4", naps: "3", ww: "2–2.5 h", wwMin: 120, wwMax: 150, night: "1–2", feeds: "5–6", note: "Most babies can now do a 5–6 h stretch at night. The 3→2 nap transition approaches (usually 6–8 months)." },
    { m: 6, total: "13–15 h", split: "night 10–11 / day 3–3.5", naps: "2–3", ww: "2–2.75 h", wwMin: 120, wwMax: 165, night: "0–2 (night feeds fade)", feeds: "4–5 + solids", note: "Many babies are now capable of 6–8 h stretches. Solids usually start around now; the 3→2 nap transition is often in progress." },
    { m: 7, total: "13–15 h", split: "night 10–11 / day 2.5–3.5", naps: "2–3", ww: "2.5–3.5 h", wwMin: 150, wwMax: 210, night: "0–2", feeds: "4–5 + solids", note: "A two-nap rhythm forms: morning nap ~2.5–3 h after waking, then an early-afternoon nap." },
    { m: 8, total: "12–15 h", split: "night 10–12 / day 2.5–3", naps: "2", ww: "2.5–3.5 h", wwMin: 150, wwMax: 210, night: "0–2 (a regression may add one)", feeds: "4–5 + solids", note: "8–10 month regression territory: separation anxiety and crawling/pulling up can disrupt sleep for 2–4 weeks. Respond consistently." },
    { m: 9, total: "12–14 h", split: "night 11–12 / day 2.5–3", naps: "2", ww: "3–3.75 h", wwMin: 180, wwMax: 225, night: "0–1", feeds: "4–5 + solids", note: "Nap strikes are common — don’t drop to one nap yet (that usually waits until 13–18 months). Ride the strike out." },
    { m: 10, total: "12–14 h", split: "night 11–12 / day 2–3", naps: "2", ww: "3–3.75 h", wwMin: 180, wwMax: 210, night: "0–1", feeds: "4–5 + solids", note: "Motor practice (standing, cruising) can briefly wake babies at night. Keep responses boring and the room dark." },
    { m: 11, total: "12–14 h", split: "night 11–12 / day 2–2.5", naps: "2", ww: "3.25–4 h", wwMin: 195, wwMax: 240, night: "0–1", feeds: "4–5 + solids", note: "Most babies now sleep through consistently — by 9–12 months for most. Night feeds are usually long gone." },
    { m: 12, total: "12–14 h", split: "night 11–12 / day 2–2.5", naps: "1–2 (keep 2 if possible)", ww: "3.5–4 h", wwMin: 210, wwMax: 240, night: "0–1", feeds: "4–5 + solids", note: "A 12-month regression is possible (walking, language burst). The shift to one nap usually waits until 13–18 months." }
  ];

  /* ------------------------------------------------------------------ *
   * Helpers
   * ------------------------------------------------------------------ */

  var DAY = 864e5;
  var LS_KEY = "nbsleep.birth";

  function $(sel) { return document.querySelector(sel); }

  function parseISO(s) {
    var p = s.split("-").map(Number);
    return Date.UTC(p[0], p[1] - 1, p[2]);
  }

  function todayUTC() {
    var n = new Date();
    return Date.UTC(n.getFullYear(), n.getMonth(), n.getDate());
  }

  function daysSince(s) { return Math.round((todayUTC() - parseISO(s)) / DAY); }

  function fmt12(mins) {
    mins = ((mins % 1440) + 1440) % 1440;
    var h = Math.floor(mins / 60), mm = mins % 60;
    var hh = h % 12; if (hh === 0) hh = 12;
    return hh + ":" + String(mm).padStart(2, "0") + " " + (h >= 12 ? "PM" : "AM");
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function ageLabel(days) {
    if (days < 0) return null;
    if (days < 14) return days + (days === 1 ? " day" : " days") + " old";
    if (days <= 112) {
      var w = Math.floor(days / 7), r = days % 7;
      return w + (w === 1 ? " week" : " weeks") + (r ? " " + r + (r === 1 ? " day" : " days") : "") + " old";
    }
    var mo = Math.floor(days / 30.437);
    var wr = Math.floor((days - 30.437 * mo) / 7);
    if (mo > 12) return mo + " months old";
    return "≈" + mo + (mo === 1 ? " month" : " months") + (wr ? " " + wr + (wr === 1 ? " week" : " weeks") : "") + " old";
  }

  /* Pick the row that matches a given age in days. */
  function pickRow(days) {
    if (days < 0) return { kind: "week", idx: 0, data: WEEKS[0] };
    if (days <= 112) {
      var w = Math.min(16, Math.floor(days / 7));
      return { kind: "week", idx: w, data: WEEKS[w] };
    }
    var mo = Math.max(3, Math.min(12, Math.floor(days / 30.437)));
    var data = MONTHS[0];
    for (var i = 0; i < MONTHS.length; i++) { if (MONTHS[i].m === mo) data = MONTHS[i]; }
    return { kind: "month", idx: mo, data: data };
  }

  /* ------------------------------------------------------------------ *
   * Table rendering
   * ------------------------------------------------------------------ */

  var weekTbody = document.querySelector("#weekTable tbody");
  var monthTbody = document.querySelector("#monthTable tbody");

  function cells(c) { return c.map(function (x) { return '<td data-label="' + x[0] + '">' + x[1] + "</td>"; }).join(""); }

  function renderWeeks() {
    weekTbody.innerHTML = WEEKS.map(function (r) {
      var age = "<strong>Week " + r.w + '</strong><span class="sub">days ' + (r.w * 7) + "–" + (r.w * 7 + 6) + "</span>";
      return '<tr id="w-' + r.w + '">' + cells([
        ["Age", age],
        ["Total sleep / 24h", esc(r.total)],
        ["Night / day split", esc(r.split)],
        ["Naps", esc(r.naps)],
        ["Wake window", esc(r.ww)],
        ["Night wakings", esc(r.night)],
        ["This stage", esc(r.note)]
      ]) + "</tr>";
    }).join("");
  }

  function renderMonths() {
    monthTbody.innerHTML = MONTHS.map(function (r) {
      var age = "<strong>" + r.m + " months</strong><span class=\"sub\">≈ week " + Math.round(r.m * 30.437 / 7) + "–" + Math.round(((r.m + 1) * 30.437 - 1) / 7) + "</span>";
      return '<tr id="m-' + r.m + '">' + cells([
        ["Age", age],
        ["Total sleep / 24h", esc(r.total)],
        ["Night / day split", esc(r.split)],
        ["Naps", esc(r.naps)],
        ["Wake window", esc(r.ww)],
        ["Night wakings", esc(r.night)],
        ["This stage", esc(r.note)]
      ]) + "</tr>";
    }).join("");
  }

  /* ------------------------------------------------------------------ *
   * Highlighting
   * ------------------------------------------------------------------ */

  function clearNow() {
    document.querySelectorAll("tr.now").forEach(function (tr) {
      tr.classList.remove("now");
      var p = tr.querySelector(".pill");
      if (p) p.remove();
    });
  }

  function mark(tr) {
    if (!tr) return;
    tr.classList.add("now");
    var first = tr.querySelector("td strong");
    if (first && !tr.querySelector(".pill")) {
      var pill = document.createElement("span");
      pill.className = "pill";
      pill.textContent = "now";
      first.appendChild(pill);
    }
  }

  function highlight(days) {
    clearNow();
    if (days < 0) { mark(document.getElementById("w-0")); return; }
    if (days <= 112) {
      mark(document.getElementById("w-" + Math.min(16, Math.floor(days / 7))));
    }
    if (days >= 30.437 * 3) {
      mark(document.getElementById("m-" + Math.max(3, Math.min(12, Math.floor(days / 30.437)))));
    }
  }

  /* ------------------------------------------------------------------ *
   * Age output card
   * ------------------------------------------------------------------ */

  var ageOut = $("#ageOut");
  var birthInput = $("#birthdate");
  var clearBtn = $("#clearBirth");

  function tile(label, val) {
    return '<div class="tile"><p class="t-label">' + label + '</p><p class="t-val">' + val + "</p></div>";
  }

  function renderAge(days) {
    var r = pickRow(days);
    var big, sub;
    if (days < 0) {
      big = "Due in " + (-days) + " day" + (days === -1 ? "" : "s");
      sub = "Counting down — here’s the week-0 guide.";
    } else {
      big = ageLabel(days);
      sub = r.kind === "week"
        ? "Day " + days + " since birth · week " + r.idx + " of the 16-week newborn window"
        : "Day " + days + " since birth · " + (r.idx > 12 ? "past 12 months" : "≈" + r.idx + " months");
    }
    var jump = r.kind === "week"
      ? '<a class="age-jump" href="#w-' + r.idx + '">See week ' + r.idx + " in the table ↓</a>"
      : '<a class="age-jump" href="#m-' + Math.max(3, Math.min(12, r.idx)) + '">See month ' + Math.max(3, Math.min(12, r.idx)) + " in the table ↓</a>";

    ageOut.innerHTML =
      '<p class="age-big">' + esc(big) + '</p>' +
      '<p class="age-sub">' + esc(sub) + "</p>" +
      '<div class="tiles">' +
        tile("Total sleep / 24h", esc(r.data.total)) +
        tile("Wake window", esc(r.data.ww)) +
        tile("Naps", esc(r.data.naps)) +
        tile("Night wakings", esc(r.data.night)) +
        tile("Feeds / 24h", esc(r.data.feeds)) +
      "</div>" +
      '<p class="age-note"><b>This stage:</b> ' + esc(r.data.note) + "</p>" +
      jump;
    ageOut.hidden = false;
  }

  /* ------------------------------------------------------------------ *
   * Next-sleep helper
   * ------------------------------------------------------------------ */

  var wokeAt = $("#wokeAt");
  var wakeOut = $("#wakeOut");

  function updateWake() {
    var t = wokeAt.value;
    if (!t) { wakeOut.textContent = ""; return; }
    var ww = { min: 30, max: 60, label: "30–60 min", ctx: "newborn defaults" };
    var birth = birthInput.value;
    if (birth) {
      var days = daysSince(birth);
      var r = pickRow(days);
      ww = { min: r.data.wwMin, max: r.data.wwMax, label: r.data.ww,
             ctx: r.kind === "week" ? "week " + r.idx : r.idx + " months" };
    }
    var p = t.split(":").map(Number);
    var start = p[0] * 60 + p[1];
    wakeOut.innerHTML = "→ next sleep window: <b>" + fmt12(start + ww.min) + " – " + fmt12(start + ww.max) +
      '</b> <span class="duelabel">(wake window ' + esc(ww.label) + " — " + esc(ww.ctx) + ")</span>";
  }

  /* ------------------------------------------------------------------ *
   * Wiring
   * ------------------------------------------------------------------ */

  function apply() {
    var v = birthInput.value;
    if (!v) {
      ageOut.hidden = true;
      clearNow();
      try { localStorage.removeItem(LS_KEY); } catch (e) {}
    } else {
      var days = daysSince(v);
      renderAge(days);
      highlight(days);
      try { localStorage.setItem(LS_KEY, v); } catch (e) {}
    }
    updateWake();
  }

  birthInput.addEventListener("change", apply);
  clearBtn.addEventListener("click", function () {
    birthInput.value = "";
    apply();
    birthInput.focus();
  });
  wokeAt.addEventListener("input", updateWake);
  wokeAt.addEventListener("change", updateWake);

  /* init */
  renderWeeks();
  renderMonths();

  var now = new Date();
  wokeAt.value = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");

  try {
    var saved = localStorage.getItem(LS_KEY);
    if (saved) { birthInput.value = saved; }
  } catch (e) {}

  if (birthInput.value) { apply(); } else { updateWake(); }
})();
