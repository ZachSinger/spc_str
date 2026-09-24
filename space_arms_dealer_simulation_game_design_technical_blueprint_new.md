# Space Arms Dealer Simulation - Master Technical & Design Blueprint (Steps 1-57)

## Current Stretch Goals List (Post-MVP)
* **Active Theft / Security Mini-Game:** Physical interception of shoplifters on the canvas[cite: 5].
* **The Military Faction:** A fourth customer demographic with unique bulk/high-tier purchasing habits[cite: 5].
* **Faction-Specific Rewards:** Tangible bonuses or unlocks for maximizing reputation with specific groups[cite: 5].
* **Alternative Bankruptcy / Bailout Systems:** Debt spirals or faction loans to prevent a soft-lock game over[cite: 5].
* **Advanced Supplier Discovery System:** Actively researching/discovering new suppliers beyond the default list[cite: 6].

---

## Part 1: Core Architecture & Time
* **Step 1: Platform & Tech Stack:** PC Desktop (Electron). Hybrid rendering uses a 2D Canvas (Phaser/Pixi.js) for the top-down shop floor and HTML/CSS/DOM for complex management windows[cite: 1]. The UI and Canvas are strictly decoupled[cite: 1].
* **Step 2: Time Management:** Real-time simulation using Galactic Time Code (GTC) with a "Manual Toggle"[cite: 1]. Shifts last 12 GTC hours; time pauses entirely when closed, allowing infinite downtime for management[cite: 1].
* **Step 3: The MVP Bridge:** Powered by a Master State (single source of truth) and an Event Bus to handle communication between the "dumb" UI and the Canvas[cite: 1].

## Part 2: Spatial Organization & Stock
* **Step 4: Item Data Contract:** Items possess `baseDimensions` (w, h), `isRotated` toggles, `supportedDisplayTypes`, and `stackDepth`[cite: 1]. 
* **Step 47: Item Granularity (Tags):** Items use Unique Branded Assets (e.g., "Aulin NT Assault Rifle") categorized by combinative Tags (e.g., `[Weapon]`, `[Surplus]`)[cite: 6].
* **Step 5: Fixture Data Contract:** Shelves feature `gridDimensions`, a `displayType`, and `stackDepth`[cite: 1]. Stacked items show an "xN" badge instead of rendering overlapping sprites[cite: 1].
* **Step 22: Hybrid Fixtures:** Universal shelves hold anything that fits physically; specialized displays (e.g., weapon racks) restrict items by Tag but offer massive space efficiency[cite: 4].
* **Step 41: Build Mode:** Fixtures are purchased and instantly placed via a point-and-click interface[cite: 5]. To protect pathfinding, this mode is strictly locked to off-shift hours[cite: 5].

## Part 3: Procurement & Logistics
* **Step 10: The Loading Pad & Storage:** Ordered stock spawns as physical crates on an outdoor Loading Pad[cite: 2]. Crates must be hauled inside. Empty crates can be permanently deleted or recycled for M-Scrips[cite: 2].
* **Step 42: Backroom Storage:** Crates can be dumped on the floor (clogging pathing) or placed on Storage Fixtures, which share the Hovercart's interactive UI array logic for easy drag-and-drop management[cite: 5].
* **Step 29: Unified Market:** All unlocked items populate in a single, unified DOM catalog[cite: 4].
* **Step 45: Supplier Discovery (MVP):** All potential supplier contracts are fully visible from Day 1 in the Tablet, but remain un-interactable until specific reputation thresholds are met[cite: 6].
* **Step 48: Contract-Driven Demand:** Customers only expect (and penalize you for missing) items from Supplier Contracts you have *actively signed and paid for*[cite: 6].

## Part 4: The Checkout Flow (Updated)
* **Step 6: The Grab & Queue:** Customers snapshot an item's price into their virtual cart when grabbing it off the physical shelf[cite: 1, 5]. They then path to the register to wait in queue[cite: 1].
* **Step 53: Visualizing Patience:** Customers in line display color-coded emote bubbles that escalate in urgency as their patience drains[cite: 6]. Ringing up *any* customer globally resets the patience timer for the next person in line[cite: 2].
* **Step 54: The Checkout Interface:** Clicking the register opens the DOM UI. Customer items appear as scattered individual windows. The player must click (or drag-hover) over each one to "scan" it, triggering a beep and sliding it into a UI shopping bag[cite: 6].
* **Step 55: Receiving Payment:** Multiple lore currencies exist (M-Scrips, Vouchers), but all exact change is simplified to standard Galactic Credits[cite: 6]. For card payments, the player types the exact total on the numpad. For cash, the UI shows the "Change Owed," which the player types or drags out[cite: 6].
* **Step 12: The Go-Backs Cart:** If a customer's patience hits zero, they leave angry and abandon their cart. These items teleport to an infinite-capacity UI "Go-Backs" cart to be restocked manually[cite: 2].

## Part 5: Shift Mechanics & Economics
* **Step 11: The Soft Close:** At hour 12, doors lock to new foot traffic, but the shift doesn't end until the register queue drops to zero[cite: 2].
* **Step 43: Finances Tab & End Day:** The shift ends silently. The player manually opens the Finances Tab to click "End Day," which deducts wages, updates the calendar, and provides the itemized receipt[cite: 6]. This button becomes "Start Shift" for the next day[cite: 6].
* **Step 52: Market Fluctuation & Pricing:** Item market prices scramble dynamically *only* when the player clicks "End Day," allowing stress-free repricing during closed hours[cite: 6]. Customers spawn with randomized price tolerance multipliers and will reject items if the markup exceeds their threshold[cite: 6].
* **Step 32: Bankruptcy:** If funds fall below zero due to automated deductions (wages), players cannot purchase anything. Running out of sellable stock while negative results in an unrecoverable game-over soft-lock[cite: 5].

## Part 6: Employees & Automation
* **Step 19: The Hiring Pool:** Static roster of hand-crafted aliens with fixed S-F stat grades (Stock Speed, Checkout Speed, Attitude). Training costs exponentially more per rank and renders the employee unavailable for one full shift[cite: 3].
* **Step 17 & 18: Scheduling & Clocking Out:** Employees are budgeted for 3 to 12-hour shifts. When their hours end, they politely finish their immediate micro-interaction before pathing off the canvas[cite: 3].
* **Step 13 & 50: Task Priorities (MVP):** Employees evaluate a top-to-bottom customizable task list. For the MVP, this is strictly limited to two roles: *Work Register* and *Stock Shelves*[cite: 3, 6].
* **Step 14 & 15: Employee Logistics:** Hired staff get their own independent Hovercart instance. They automatically cross-reference empty shelf slots with backroom stock and haul crates on the canvas[cite: 3].
* **Step 16: Empty Stock Alerts:** If backroom stock is missing, the AI skips the shelf and pings the UI with an "Out of Stock" notification. They do not auto-purchase goods[cite: 3].

## Part 7: Factions, Customers, & Spawning
* **Step 24: Accumulative Spawning:** The total daily customer pool scales upward. Global Reputation dictates baseline traffic, while Faction reputations *add* their distinct members to the pool[cite: 4].
* **Step 49: Foot Traffic:** Baseline traffic acts as a direct multiplier of Global Store Reputation[cite: 6].
* **Step 51: Reputation Math:** Flat 1-to-1 ratio (+1 for success, -1 for anger/fail). Faction customers apply this dual-tick to both their specific Faction and the Global pool simultaneously[cite: 6].
* **Step 12: Intent + Impulse:** Customers have guaranteed Primary lists (penalizes rep if out of stock) and randomized Optional lists (no penalty if missing)[cite: 2].
* **Step 25-28: The Factions:**
  * *Scavengers:* Buy low-tier/surplus. Huge Optional lists (impulse buyers). Use M-Scrips[cite: 4].
  * *Mercenaries:* Buy mid/high-tier gear. Huge Primary lists, highly discriminating (high risk/reward). Refuse to buy duplicate weapons[cite: 4].
  * *Explorers:* Seek Tools and Survival gear. Guaranteed to want at least one Tool. Use Vouchers[cite: 4].

## Part 8: The Manager's Tablet & UI
* **Step 40: Tablet Tabs:** The central DOM UI features tabs for Inventory, Employee, Contract, Supply, Fixtures, Layout, Finances, and the Handbook[cite: 5, 6].
* **Step 36 & 46: Feedback & Manuals:** Contextual "God Windows" teach mechanics once[cite: 5]. On-canvas feedback uses clean Emote Bubbles[cite: 6]. The Employee Manual/Handbook tab acts as a permanent reference guide[cite: 5, 6].
* **Step 44: MVP Onboarding:** Minimalist pre-shift tutorial via God Windows teaching the procurement-to-shelf loop (buy rifles, grab from pad, hovercart, stock, set price, start shift)[cite: 6].
* **Step 35: Screen Real Estate:** Absolute-positioned HTML windows float over a 100% full-screen canvas viewport[cite: 5].
* **Step 57: Camera Control (MVP):** The physical shop floor will never expand beyond the size of a single monitor screen. There is no camera panning or scrolling for the MVP[cite: 6].

## Part 9: Visuals, Physics & Save Data
* **Step 30 & 58: Player Collision & Input:** No dynamic entity collision (pawns glide through each other). The player avatar operates at the highest Z-index (9999) to remain visible[cite: 4].
* **Step 38: Aesthetics:** Clean, flat-shaded 2D RimWorld-style vector pawns with no complex skeletal walk cycles to ensure lean animation logic[cite: 5].
* **Step 37: Audio:** Dynamic crossfading music tied directly to the Shift State (Pre-Shift, Active Shift, Post-Shift)[cite: 5].
* **Step 34: Data Persistence:** The game utilizes strictly Auto-Save, and *only* triggers during the off-shift downtime to prevent serialization bloat of active canvas variables[cite: 5].