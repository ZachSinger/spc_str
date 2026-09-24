# Space Arms Dealer Simulation - Technical & Design Blueprint (Part 5)

## Current Stretch Goals List (Post-MVP)
* **Active Theft / Security Mini-Game:** Physical interception of shoplifters on the canvas.
* **The Military Faction:** A fourth customer demographic with unique bulk/high-tier purchasing habits.
* **Faction-Specific Rewards:** Tangible bonuses or unlocks for maximizing reputation with specific groups.
* **Alternative Bankruptcy / Bailout Systems:** Debt spirals or faction loans to prevent a soft-lock game over.

## Step 32: The Fail State (Bankruptcy)
* **The Soft-Lock:** The Master State allows the player's Galactic Credit balance to drop into negative numbers strictly as a result of automated deductions (e.g., paying employee wages or rotating fees). 
* **Hard Purchase Block:** Players cannot initiate any new purchases (stock, fixtures, layout expansions) while their funds are negative.
* **Game Over Condition:** If the player's funds are negative, they cannot afford new stock, and they have completely run out of existing stock on the sales floor to generate revenue, the game enters an unrecoverable soft-lock, functionally ending the run.

## Step 33: The Victory Condition
* **Endless Sandbox:** There is no formal ending sequence, credit roll, or ultimate narrative victory for the MVP. The simulation runs indefinitely, allowing the player to continually optimize their logistics, expand their floor plan, and hoard capital.

## Step 34: Data Persistence (Save System)
* **Auto-Save Only (Between Shifts):** The game strictly saves progress only during the infinite, paused downtime when the shop is closed.
* **Technical Benefit:** This prevents extreme state bloat. By avoiding mid-shift saves, the Master State never needs to serialize complex, temporary canvas variables like mid-transit pathfinding coordinates, partial customer queues, or active patience timers into the JSON save file.

## Step 35: Screen Real Estate & Layout
* **Windowed Overlays:** The 2D Phaser canvas depicting the physical shop floor occupies 100% of the screen at all times.
* **DOM Integration:** All management interfaces (Manager's Tablet, Hovercart UI, Register) operate as absolute-positioned, draggable HTML/CSS windows that float over the game world. This keeps the player grounded in the physical space of the shop while managing macro-logistics.

## Step 36: Onboarding & Tutorialization
* **God Windows:** Reactive, in-universe tutorial popups triggered only when the player performs a contextual action for the first time (e.g., clicking the register or the loading pad).
* **The Employee Manual:** A permanent, accessible DOM UI window that acts as a reference guide. Players can open it at any time to review game mechanics, allowing them to learn at their own pace.

## Step 37: Audio and Soundscapes
* **Contextual Shift Music:** The music is directly tied to the shift state machine rather than a complex dynamic audio engine. 
* **The Loop:** The soundtrack crossfades between distinct tracks based on the current phase: a relaxed Pre-Shift track, a more active Active Shift track, and a winding-down Post-Shift track.

## Step 38: Visual Aesthetic & Art Style
* **Crisp Vector Art (RimWorld-Style):** Characters and items utilize clean, flat-shaded 2D vector graphics. 
* **Animation Optimization:** Character sprites are rendered as "pawns" without skeletal walk cycles. They simply glide to their grid destinations. This allows for pixel-perfect movement syncing on the canvas without the headaches of matching animation frames to movement speed, keeping visual logic extremely lean.

## Step 39: Pricing Strategy & Snapshot Logic
* **Dynamic Margins:** Prices are managed via the Inventory tab on the Manager's Tablet. The UI tracks the `Average Cost` of items dynamically, allowing players to see their exact profit margins when they manually input the `Current Price`.
* **Snapshot Pricing:** To prevent players from exploiting the system by jacking up prices while a customer is walking to the register, an item's price is permanently locked into the customer's virtual cart the exact millisecond they grab it off the physical shelf.

## Step 40: The Manager's Tablet
The primary macro-management tool is a unified DOM interface organized into dedicated tabs:
* **Inventory Tab:** View stock levels, track average costs, and manually set retail prices.
* **Employee Tab:** View the applicant pool, hire, fire, and manage employee task priorities.
* **Contract Tab:** Review and unlock new supplier contracts using reputation points and one-time fees.
* **Supply Tab:** Build and execute bulk purchase orders from unlocked suppliers.
* **Fixtures Tab:** Purchase spatial display units, shelving, and backroom storage.
* **Layout Tab:** Purchase and expand physical grid tiles for the shop floor.

## Step 41: Fixture Placement (Build Mode)
* **Instant Placement:** Fixtures purchased from the tablet are placed onto the canvas instantly via a point-and-click Build Mode, bypassing the Hovercart logistics loop.
* **The Pathfinding Constraint:** Build Mode can *only* be activated when the shop is completely closed. Players cannot place or move fixtures during an active shift, ensuring the static pathfinding grid is never broken or recalculated while customer AI is walking the floor.

## Step 42: Backroom Storage & Logistics
* **Physical Floor Spillage:** Delivery crates can be dropped directly onto the backroom floor. However, each crate occupies exactly one physical grid tile, severely clogging navigation.
* **Storage Fixtures:** Players can purchase dedicated backroom shelves/pallets to optimize space. 
* **Shared UI Architecture:** Storage Fixtures use the exact same underlying DOM component logic as the Hovercart. They function as interactive arrays with a maximum integer capacity. Players can park their Hovercart next to a Storage Fixture, open both HTML UI windows, and seamlessly drag-and-drop crates between them.