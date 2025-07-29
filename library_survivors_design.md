
# **Library Survivors – Complete Gameplay & Systems Brief**
*Version 0.3 – updated 28 Jul 2025*

---

## 0. High‑Concept Pitch  
A “librarian‑sim meets bullet heaven.”  Survive **30 minutes** of escalating chaos while shelving runaway books and fending off mischievous kids.  Keep the **Chaos Meter** below 100 %.  Think *Vampire Survivors* crossed with a slapstick library.

---

## 1. Core Gameplay Loop  
1. **Scan & Prioritise**  
   * Empty shelf slots glow; books on the floor sparkle.  
2. **Navigate & Interact (auto‑pick / auto‑shelve)**  
   * *Pickup Radius* vacuums books on the floor or from a kid’s hands when you close the gap.  
   * *Return Radius* drops any held book into the correct shelf automatically.  
3. **Herd & Repel**  
   * Kids are *repelled* inside a 1.5 m radius and sprint away, letting you *corral* them away from shelves.  
4. **Earn XP ➜ Level‑Up ➜ Choose 1 of 3 Upgrades**  
   * Each new level costs **+45 %** more XP than the previous (rounded).  
5. **Chaos Management**  
   * Chaos + = books on ground ( +1 % per book every 2 s ).  
   * Chaos – = pick up (–0.5 %) and shelve (–0.5 %).  
6. **Escalation Events** every 5 min (field trip, mini‑boss, substitute teacher, etc.).  
7. **End States**  
   * Win: Survive 30 min.  
   * Lose: Chaos ≥ 100 % **or** HP ≤ 0.

---

## 2. Player Stats & Resources

| Stat | Start | Per‑Upgrade | Cap |
|------|------:|------------:|----:|
| HP | 100 | +20 | 300 |
| Movement Speed | 3 m/s | +3 % | +45 % |
| Pickup Radius | 1 m | +0.1 m | 2 m |
| Carry Slots | 5 | +1 | 12 |
| Stamina (sprint) | 100 | +10 | 200 |
| Chaos Dampening | 0 % | +2 % | 20 % |

---

## 3. Kid (NPC) Behaviour System  

| State | Description | Chaos Effect | Notes |
|-------|-------------|-------------|-------|
| **Idle** | Browses shelf, 2 s average. | — | Picks target slot. |
| **Grab & Decision** | 40 % **Drop‑Near**: tosses book on floor next to shelf. 60 % **Carry‑Away**: starts *Carry* state. | +1 book | Decision weights tilt to *Carry‑Away* as minutes pass (+5 % per 5 min). |
| **Carry‑Away** | Kid runs toward random “dump spot” 6–14 m away. | — | Kid visibly holds the book overhead. Player can snatch it mid‑run. |
| **Drop‑Far** | Reaches dump spot, throws book. | +1 book | Plays cheeky laugh SFX. |
| **Flee (Repelled)** | Triggered if Librarian enters 1.5 m. Kid sprints directly away for 2 s, path‑finding around shelves. | — | Use to shepherd kids. |

### Visibility  
*Books in hand* glow yellow; a dotted line shows their intended dump spot for easy interception.

### Combat / Damage  
Kids bump for 5 HP; no Chaos penalty for bump damage.

---

## 4. Difficulty Scaling  

| Minute | Added Pressure |
|--------|----------------|
| 0‑2 | Base spawn: 4 kids, 10 s interval. “Curious Readers.” |
| 2‑5 | +Chatty Pairs; spawn cap +8. |
| 5‑8 | +Hide‑and‑Seekers (sprint bursts). |
| 8‑12 | Snack Smugglers leave sticky puddles. |
| 12‑15 | **Field‑Trip Chaperone** mini‑boss (knocks 10 books instantly). |
| 15‑20 | Gamers throw paper airplanes. |
| 20‑25 | Tornado Toddlers (high speed). |
| 25‑30 | **Substitute Teacher** boss (spawns 5 kids per 10 % HP lost). |

### Books‑On‑Shelf Multiplier  
Every 2 minutes, +5 % of remaining shelf slots become “eligible” to be removed. By minute 20, 75 % of the library is fair game, causing exponential book volume.

### XP Curve  
`XP_to_next = floor( Base × 1.45^(level‑1) )`, Base = 100. Also, each level increases:  
* Kid spawn cap + 1  
* Book knock‑off cooldown –2 % (faster chaos)

---

## 5. Upgrade Draft Pool  

### 5.1 Weapon‑Like Skills (fires automatically, 5 levels each)  
* **Shush Wave** – Cone knock‑back + stun chance.  
* **Bookmark Boomerang** – Homes, silences book‑stealing for 3 s.  
* **Dust Cloud** – Slow aura.  
* **Rolling Book Cart** (unique) – Sprint that vacuums books.  
* **Dewey Decimal Beam** – Rotating laser that auto‑shelves ground books.

### 5.2 Passive Perks  
* Comfy Shoes (speed)  
* Book Belt (carry slots)  
* Fitness Break (stamina)  
* Reading Glasses (XP +8 %)  
* Zen Focus (Chaos dampen)  
* Library Funding (pickup radius/gems)  
* Air Conditioning (global kid slow)

### 5.3 Legendary Relics (boss drops)  
* “Quiet Please” Sign – Pauses Chaos 15 s every 60 s.  
* First‑Edition Tome – Shelving heals 1 HP.  
* Security Guard Badge – AI guard patrols, lowers kid spawn in radius.

---

## 6. Win / Lose / Meta‑Progression  

* **Victory Stats Screen** – books shelved, kids calmed, Chaos peak, time, relics → convert to gold.  
* **Gold** buys permanent cards: +1 weapon slot, new librarians, starting relics.  
* **Endless Mode** – Chaos cap rises to 200 %, leaderboard: longest time before cap.

---

## 7. UX & Juiciness  

* Colour‑coded books & shelf lights (match‑3 clarity).  
* Kids shout, shelves creak, music layers intensify with Chaos %.  
* Screen edges vignette red as Chaos > 80 %.  
* Pause freezes kids but not Chaos (tension).  
* Full gamepad & mouse‑keyboard support, auto‑aim option.

---

## 8. Development Roadmap (Early Access)  

| Milestone | Scope | ETA |
|-----------|-------|----|
| **Vertical Slice** | 1 hero, 1 map, 5 kid types, Chaos meter, core upgrades. | +2 wks |
| **Content Drop 1** | Event Waves, Field‑Trip Chaperone boss, meta shop. | +6 wks |
| **Content Drop 2** | New Librarian “Archivist”, Children’s Wing map, daily seed. | +10 wks |
| **Full Launch** | 20 skills, 3 bosses, 30‑min OST, achievements. | +14 wks |

---

*Designed for fast, readable numbers and satisfying feedback loops.  Happy shelving!*  
