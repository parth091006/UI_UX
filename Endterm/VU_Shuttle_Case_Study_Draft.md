01 · The Problem

Students commuting between Karjat Railway Station and Vijaybhoomi University had no way to know where the campus shuttle actually was, or when it would arrive. Standing at the stop with no confirmed timing, checking a phone repeatedly, calling a friend to ask where the bus was — this was the daily routine before any of this existed.

Evidence: 1 observation session (bus stop, 8:00–8:30 AM) plus interviews with students who rely on the shuttle daily.

**Proto-persona — Aaryan**, a B.Tech student who travels by shuttle every day.

- Expects the bus between 8:00–8:15 AM, but the timing isn't fixed.
- Stands at the stop 15–20 minutes daily with no way to know when it will actually arrive.
- Has been late to lectures and exams over this, and risks missing his connecting train home.

> "I never know exactly when the bus will arrive, so I end up either waiting or worrying about being late."

[Insert Screen — the current wait-and-guess experience, if you have a "before" reference to show]

02 · Research

**Observation log** — bus stop, 8:00–8:30 AM: student arrives at 8:00, checks phone repeatedly, looks down the road multiple times, makes a phone call at 8:15, bus arrives at 8:20, student boards quickly.

**Interview findings**, gathered directly from students:

- No fixed arrival or departure time for the shuttle.
- A missed shuttle connection has caused at least one student to miss a train, resulting in a 30-minute wait.
- The shuttle is shared with faculty and admin staff, which limits seating for students.
- Seating capacity differs between buses, sometimes forcing students to stand.
- Shuttle cost is seen as high relative to local buses, for no perceived difference in service.
- Students would prefer separate buses for students and staff.

**Core pain point:**

> "Students have no reliable way to know the campus shuttle's real-time location or arrival time, forcing them to wait blindly at the bus stop or depend on informal methods like calling a friend, causing daily anxiety and repeated lateness to lectures, exams, and trains."

**User stories that came out of this:**

- As a student waiting for the shuttle, I want to see the bus's real-time location, so I know exactly how long I need to wait instead of guessing.
- As a student planning my morning, I want an estimated arrival time, so I can decide when to leave without wasting time standing at the stop.
- As a student catching a connecting train, I want to be notified if the shuttle is delayed or cancelled, so I can adjust my plans in advance.

03 · Structure

10 candidate features went into an online card sort with **10 students**, each asked to group the features into categories of their own choosing — no categories were given.

**What the card sort found:**

- **10/10** grouped "In-app payment" and "Monthly pass" together, separate from everything else — payments read as their own topic.
- **10/10** grouped "Request driver to wait" and "Contact driver for emergency" together, separate from information features — both are about reaching the driver directly, not checking information.
- **8/10** clustered "Live bus location," "Seat occupancy," and "Nearest stop finder" together — students think of these as answering the same basic question: *where is the bus, and can I get on it?*
- **2/10 disagreed** on where "Daily Schedule" belonged — most put it with tracking, two treated it as a reminder/notification instead. Majority view won.
- **2/10 disagreed** on where "Seat Occupancy" belonged — same split, tracking vs. notification framing.

All 10 students independently converged on roughly 4 groups without being told to, which gave the feature list a clear, natural structure: tracking the bus, getting notified, paying, and talking to the driver. This became the V1 IA:

- **Bus Tracking & Schedule** — Live Bus Location & ETA, Seat Occupancy Status, Nearest Stop Finder, Daily Bus Schedule/Timetable
- **Notifications & Alerts** — Bus Near Stop / Delay / Cancellation Alerts, Departure Reminder
- **Payments & Passes** — In-App Payment, Monthly Pass Purchase/Renewal
- **Support & Communication** — Request Driver to Wait, Contact Driver for Emergency

**Tree test — 6 students**, 5 tasks each, no multiple-choice options given:

| Task | Expected path | Result |
|---|---|---|
| Know bus arrival time | Bus Tracking & Schedule → Live Bus Location & ETA | 6/6 correct |
| Check seat availability | Bus Tracking & Schedule → Seat Occupancy Status | 5/6 correct |
| View tomorrow's timetable | Bus Tracking & Schedule → Daily Bus Schedule/Timetable | 5/6 correct |
| Ask driver to wait | Support & Communication → Request Driver to Wait | 5/6 correct |
| Get departure reminder | Notifications & Alerts → Departure Reminder | 5/6 correct |

**Overall: 26 of 30 correct (87%).**

**What went wrong:**

1. Two students mixed up "Seat Occupancy," "Daily Schedule," and "Live Bus Location" — all three read as "checking bus info," so students sometimes clicked the first tracking-related option instead of the exact right one. Still inside the correct top-level category, so a minor mix-up rather than a structural failure.
2. One student picked "Notifications & Alerts" instead of "Support & Communication" for asking the driver to wait — the important failure. It exposed a real conceptual confusion: *the app telling the user something* (passive) versus *the user asking the driver for something* (active). Both felt like "app notifications" until the label made the distinction explicit.
3. One student mixed up "Delay Alerts" with "Departure Reminder" — both are notifications, a small labelling overlap rather than a structural problem.

**What changed, V1 → V2:** two labels were renamed to fix the driver-request confusion —
"Request Driver to Wait" → **"Ask Driver to Wait for Me"** (makes clear this is a user action)
"Delay/Cancellation Alerts" → **"Bus Delay/Cancellation Notice"** (makes clear this is information from the app, not an action)

**V2 Information Architecture (final):**

- **Bus Tracking & Schedule** — Live Bus Location & ETA, Seat Occupancy Status, Nearest Stop Finder, Daily Bus Schedule/Timetable
- **Notifications & Alerts** — Bus Delay/Cancellation Notice, Departure Reminder
- **Payments & Passes** — In-App Payment, Monthly Pass Purchase/Renewal
- **Support & Communication** — Ask Driver to Wait for Me, Contact Driver for Emergency

04 · Scope

**MoSCoW**, applied across the 10 candidate features:

- **Must-Have:** live bus location & ETA · daily schedule/timetable · near-stop/delay/cancellation notifications · nearest stop finder
- **Should-Have:** request driver to wait · monthly pass purchase/renewal
- **Could-Have:** contact driver for emergencies · in-app payment
- **Won't-Have:** departure reminder notification · seat occupancy status

**DFV Matrix**, used to weigh the top two tracking-related must-haves against each other:

| Feature | Desirability | Feasibility | Viability | Total |
|---|---|---|---|---|
| Live bus location & ETA | 5 | 2.5 | 4 | **11.5** |
| Nearest stop finder | 3.5 | 2.5 | 3.5 | 9.5 |

Live location and ETA came out as the clear anchor feature — the one the rest of the app is built around.

05 · Wireframes

Nine core screens were wireframed first: login, login error, home, loading, live map (success and no-data states), daily schedule, nearest stop finder, and the return-to-home loop.

1. **Login** — mobile number and password, or Guest Login, with a "Forgot Password" path.
2. **Login Error** — only the password field clears on a failed attempt; the mobile number stays filled.
3. **Home Page** — central hub for the four must-have features: Live Bus Location, Daily Schedule, Nearest Stop, Notifications.
4. **Loading State** — shown while live bus data is fetched, with a back button so the user isn't stuck waiting indefinitely.
5. **Live Map (success)** — shows the live map and estimated time of arrival.
6. **Live Map (no data)** — shown when no bus is currently running, with guidance pointing to the daily schedule instead of a dead end.
7. **Daily Schedule** — date, time, and stop information for the day's timetable.
8. **Nearest Stop Finder** — search bar and list view so students can find and board from the nearest available stop.
9. **Return to Home** — confirms every flow loops back to the home screen.

[Insert wireframe gallery screens here]

06 · Heuristic Evaluation — 3 Fixes Before Real Users Ever Touched It

Before usability testing, a heuristic review caught three violations:

1. **User Control & Freedom** — the loading screen had no way out if data was slow or failed silently.
   **Fix:** added a back button.
2. **Help Users Recognize, Diagnose, and Recover from Errors** — the "No Data Found" screen was a dead end, with no explanation and no next step.
   **Fix:** added guidance — "There are no buses running currently, check the schedule" — pointing to a working alternative.
3. **Error Prevention** — a failed login marked both fields as incorrect and forced re-entry of everything, even though only the password was wrong.
   **Fix:** the mobile number now stays filled; only the password needs to be re-entered.

[Insert before/after heuristic comparison images here]

Prototype: https://www.figma.com/proto/It6uSypPDmtOqGStwJ1ztP/UI-UX_UT2?node-id=1-2&t=HVLDKRKHOcI64G9v-1

07 · Usability Testing — 5 Real Users

Each participant was given one task: "Check the live bus location and arrival time."

| Participant | Outcome | Screen | Heuristic | Note |
|---|---|---|---|---|
| P1 | Yes, easily | — | — | Found the live map and ETA without any issues |
| P2 | Yes, easily | — | — | Found the live map and ETA without any issues |
| P3 | Yes, easily | — | — | Found the live map and ETA without any issues |
| P4 | Yes, easily | — | — | Found the live map and ETA without any issues |
| P5 | Yes, with hesitation | Loading | Visibility of System Status | Wondered whether the app was working or frozen, before it moved on to the map by itself |

**4 of 5 completed the task easily, no issues.**

1 participant (P5) hesitated at the loading screen — unsure whether the app was working or frozen, before it resolved on its own. This flagged a **Visibility of System Status** gap: the spinner told users something was happening, but not that it was still working.

**Fix identified:** a short reassurance line during loading (e.g. "Almost there…") instead of a plain static spinner — a small, low-severity change that closes the loop between what the heuristic review predicted and what a real user actually felt.

08 · Peer Benchmarking — 3 Conversations, One Shared Insight

Met with three students working in the same domain — campus/shuttle transport tracking: **Harshal**, **Kunal**, and **Yuvraj**.

All three had built in a fallback: if the shuttle is missed or unavailable, their apps surface alternate-transport options (e.g. private vehicle/cab) rather than ending the flow. VU Shuttle currently treats the shuttle as the only path — if a student misses it, the flow simply ends.

**Why they chose differently:** they saw missing the shuttle as a common, realistic scenario for commuting students, so their design had to account for what happens next rather than assuming the shuttle is always viable.

**Shared root pain point across all three conversations:** lack of real-time information — the same theme that surfaced independently in VU Shuttle's own usability testing (the loading-screen hesitation).

**What I'd borrow / reconsider:** a lightweight next-step from the No-Data or Schedule screens for a student who's missed the bus — even if just informational for now.

09 · The Prototype

Beyond the Figma prototype, VU Shuttle was rebuilt as a fully coded HTML/CSS/JS app to stress-test real interaction — not just static screens.

What it actually does:

- **Home** — a live status card that updates automatically depending on whether a bus is currently running, with a real ETA countdown.
- **Live Map** — an animated bus icon that moves along the route in real time, tracking actual trip progress against the timetable; automatically redirects to the No-Data screen when no bus is running.
- **Nearest Stop** — a route planner that calculates distance and travel time between any two stops, plus a toggle to view all stops by distance from Karjat Station or from Campus.
- **Schedule** — full stop-by-stop timetables for the morning and evening trips.
- **Notifications** — a live feed of delay, road-work, and route-change alerts.
- **Login** — the Error Prevention fix from the heuristic review (06) implemented in working code: only the password clears on a failed attempt.

A `?demo=1` mode simulates a full morning trip in real time for anyone viewing without an actual bus running, so the live map and ETA can be seen working end to end.

Source: [add your GitHub link here]
Live build: [add your hosted link here, if you have one]

[Insert 2–3 screens from the live coded build here]

10 · What's Next / What I'd Do Differently

- **Add a lightweight next-step for a missed bus.** Three separate peers converged on this fix independently — a strong signal, though still borrowed rather than tested against VU Shuttle's own users. Worth validating before committing build time to it.
- **Ship the loading-screen reassurance cue** validated by usability testing (07).
- **Test with more than one task per participant.** All 5 usability sessions covered a single task. A second task — e.g. recovering from the "No Data Found" state, or using the nearest-stop route planner — would give the heuristic-review fixes (06) real usability evidence instead of relying on inspection alone.
- **Revisit the driver-request label** ("Ask Driver to Wait for Me") in a follow-up usability pass — the tree test (03) confirmed the rename fixed the sorting confusion, but it hasn't been tested against real users navigating the live app.
