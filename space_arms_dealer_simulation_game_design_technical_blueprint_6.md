# Space Arms Dealer Simulation - Technical & Design Blueprint (Part 6)

## Current Stretch Goals List (Post-MVP)
* **Active Theft / Security Mini-Game:** Physical interception of shoplifters on the canvas.
* **The Military Faction:** A fourth customer demographic with unique bulk/high-tier purchasing habits.
* **Faction-Specific Rewards:** Tangible bonuses or unlocks for maximizing reputation with specific groups.
* **Alternative Bankruptcy / Bailout Systems:** Debt spirals or faction loans to prevent a soft-lock game over.
* **Advanced Supplier Discovery System:** A system for actively discovering new suppliers, beyond the MVP's default visible list.

## Step 43: The Shift Summary & Finances Tab
* **Passive Ledger:** The 12 GTC hour shift ends silently once the final customer leaves. Players are not interrupted by sudden pop-ups.
* **The Finances Tab:** A new tab on the Manager's Tablet where players manually click "End Day". 
* **The Itemized Receipt:** Clicking "End Day" formally deducts wages, updates the calendar, and displays a detailed breakdown of total items sold, Galactic Credits earned, and reputation changes. 
* **Unified Button:** This same interface houses the "Start Shift" button for the next day.

## Step 44: Starting Conditions & Onboarding (MVP)
* **Pre-Shift Start:** The player begins with a basic setup (a register, a hovercart, a single shelf, and a landing pad) before their first shift has opened.
* **Minimalist Tutorial Flow:**
  1. The Manager's Tablet instructs the player to buy a crate of rifles.
  2. The player retrieves it from the Landing Pad and places it in the backroom.
  3. The player loads the crate onto the Hovercart.
  4. The player stocks the single shelf and learns to set the price directly from the Shelf Interface (bypassing the Inventory Tab for early onboarding).
  5. The player is instructed to buy more items and hit "Start Shift".
  6. At the end of the first day, they are guided to purchase and place one new fixture. 
* **Player Agency:** Beyond this, the player is left to discover the Tablet's depths naturally.

## Step 45: Supplier Discovery (MVP Scope)
* **Fully Visible Catalog:** All potential supplier contracts are visible in the Tablet's Contract Tab from Day 1. 
* **Reputation Gates:** Though visible, contracts remain un-interactable (greyed out) until the player meets the specific Faction or Global reputation threshold required to unlock them.

## Step 46: Visual Feedback on the Shop Floor
* **Emote Bubbles:** Customer reactions (e.g., anger, out of stock, successful purchase) are communicated via simple, clean icon bubbles over their sprites.
* **The Handbook Tab:** The Manager's Tablet includes a "Handbook" tab containing the Employee Manual and a legend explaining what each emote bubble means.

## Step 47: Item Granularity & The Tag System
* **Unique Branded Assets:** Items feature bespoke, lore-friendly names (e.g., "Aulin NT Assault Rifle 5.56n").
* **Combinative Tags:** Instead of rigid categories, items use an array of Tags (e.g., `[Weapon]`, `[Rifle]`, `[Surplus]`, `[HQ]`). 
* **System Integration:** This Tag system powers both the player's UI filtering (searching for all `[Surplus]` items) and the Customer AI's intent logic (a customer wanting *any* `[Surplus]` `[Weapon]`).

## Step 48: Market Demand & Player Pacing
* **Contract-Driven Demand:** Customers will *only* expect to find items (and penalize you for not having them) if you have actively signed and paid for the corresponding Supplier Contract.
* **Organic Difficulty:** This prevents reputation-threshold ambushes. The player completely controls when the game gets harder by choosing when to expand their catalog. Factions will still heavily favor items associated with their demographics.

## Step 49: Foot Traffic and Spawning
* **Reputation Scaled:** The baseline number of daily customers is a direct multiplier of the player's Global Store Reputation. As reputation grows, the shop naturally becomes busier.

## Step 50: The Employee Task List (MVP)
* **Core Tasks Only:** The customizable employee priority list is restricted to exactly two tasks: *Work Register* and *Stock Shelves*. This validates the top-to-bottom array evaluation engine for future stretch goals.

## Step 51: Reputation Math
* **Flat 1-to-1 Ratio:** A successful interaction grants +1 Reputation; an angry abandonment grants -1 Reputation.
* **Faction Dual-Tick:** Faction customers simultaneously apply this flat +1/-1 to both their specific Faction Reputation *and* the Global Store Reputation.

## Step 52: Customer Price Sensitivity & Market Fluctuation
* **Individual Tolerances:** Each customer spawns with a randomized price tolerance multiplier. If the player's markup exceeds this threshold, the customer rejects the item.
* **End-of-Day Fluctuation:** Item Market Prices fluctuate dynamically, but *only* when the player clicks "End Day". This allows the player to safely re-price their inventory during the paused downtime before opening the shop.

## Step 53: Visualizing the Patience Timer
* **Color-Coded Emote Escalation:** Instead of UI progress bars, customers in the checkout queue periodically flash emote bubbles that shift in color and intensity as their patience timer drains. It remains diegetic and unobtrusive.

## Step 54: The Checkout Interface (DOM UI)
* **Tactile Scanning Minigame:** When ringing up a customer, their items appear as scattered individual icon windows inside the Register UI (e.g., 4 rifles = 4 separate windows).
* **Execution:** The player must click (or click-and-drag over) each item window. Scanning triggers a "beep" audio cue and linearly animates the item into a UI paper shopping bag, naturally pacing the clearing speed based on order size.

## Step 55: Receiving Payment & Making Change
* **Unified Change (Galactic Credits):** While lore dictates multiple currencies, to streamline the UI, all final totals and exact change calculations are converted to standard Galactic Credits.
* **Card vs. Cash:**
  * *Card:* Player uses the numpad to type the exact transaction amount.
  * *Cash:* The UI displays the "Change Owed," and the player types that exact amount to complete the transaction.

## Step 56: Daily Events and Modifiers
* **Static Predictability (No Random Events):** For the MVP, there are no randomized daily disruptions (e.g., sudden supply shortages or VIPs). The simulation relies entirely on the player-driven logistics loop.

## Step 57: Camera Control (Phaser 2D Canvas)
* **Static Viewport:** For the MVP, the physical shop floor will never expand beyond the size of a single monitor screen. There is no camera panning, scrolling, or tracking required.