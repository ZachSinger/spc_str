# Space Arms Dealer Simulation - Technical & Design Blueprint (Part 2)

## Step 10: The Procurement & Logistics Flow

**1. The Loading Pad**
- When stock is purchased via the market DOM UI, it does not instantly teleport to storage.
- A physical, interactable "Delivery Crate" spawns on a top-down "Loading Pad" outside the shop in the 2D Phaser canvas. 
- The player must physically move these crates into the backroom to unpack them, adding physical weight to logistics.
- *Economy of Scale:* Crates hold varying amounts (e.g., 3, 5, or 20 items). Ordering larger crates is incentivized via reduced delivery fees.

**2. The Hovercart System**
- The Hovercart acts as a mobile inventory for crates. It hovers, allowing it to path over customers without collision/traffic jams on the shop floor.
- **Hovercart UI:** A two-column, multi-row, scrollable DOM window.
- **Extraction Animation (No 2D Sprite Animation Needed):**
  - Clicking a crate in the UI "opens" the lid.
  - The item inside scales from `0` to `1` (width/height) via CSS transition while translating to a dedicated "Active Slot" in the UI.
  - Clicking a different crate triggers a reverse transition for the current item (putting it away) and extracts the new item.
- **Stocking:** Dragging the final item from the active slot onto the spatial grid shelf marks the crate as empty. The lid replaces itself.

**3. Waste Management**
- Empty crates are **not** automatically deleted. They remain on the Hovercart, marked with a red 'X', taking up premium spatial UI slots.
- **Disposal (Backroom Only):**
  - *Trash Compactor:* Infinite space, instantly deletes the crate.
  - *Recycle Bin:* Fills up over time. When full, the player can empty it to earn "M-Scrips" (scavenger currency), providing a tangible economic incentive for waste management.

## Step 11: The Shift Cycle (Soft Close)

- A standard operational shift lasts 12 GTC (Galactic Time Code) hours.
- **The Soft Close Mechanic:**
  - When the 12-hour timer hits zero, the shop doors lock. No *new* customers can spawn or enter.
  - The simulation continues running for any customers already inside the shop. They will finish pathfinding, browsing, and waiting in line.
  - The shift formally ends *only* when the register queue drops to zero.

## Step 12: Customer AI & Purchasing Decisions

**1. "Intent + Impulse" Shopping Lists**
- Customers spawn with a pre-generated `shoppingList` array in the Master State, dictating their pathfinding.
- **Primary Items:** Guaranteed attempts. The customer will definitely try to buy these.
- **Optional Items:** Rolled at spawn (hidden 1d6). If the roll is a 5 or 6, the item is added to the list. Customers can have duplicate targets across both lists (e.g., Primary: 1 Rifle. Optional: 1 Rifle. Total intent: Buy 2 Rifles).

**2. Out of Stock & Reputation Logic**
- *Forgiveness:* If a customer wants 3 of an item, but only 2 are available, the player takes **no** reputation penalty. As long as the customer gets at least 1, it counts as a success.
- *Primary Penalty:* If a Primary item is completely out of stock, the player takes a reputation hit *for each* missing primary item.
- *Optional Forgiveness:* If an Optional item is out of stock, there is no reputation penalty.
- *Pathfinding Optimization:* If a shelf is empty, the Master State scrubs the customer's remaining `shoppingList` array for any future instances of that specific item ID so they don't waste time walking to other empty shelves.

**3. The Checkout Queue & Patience Timer**
- Customers in line have a hidden patience timer. 
- *Juggling Mechanic:* Checking out *any* customer at the register globally resets the patience timer for the next person in line. This allows the player to multitask (stocking shelves between ringing people up).
- **The "Go-Backs" Cart (Fail State Resolution):**
  - If a customer's patience timer hits zero, they leave angry (reputation hit) and abandon their virtual cart.
  - To prevent data collisions on the strict shelf grid, abandoned items are sent to an infinite-capacity "Go-Backs Cart."
  - *Go-Backs UI:* Accessible while stocking shelves. It dynamically groups identical abandoned items into "virtual crates."
  - *One-Way Street:* The player can only drag items *out* of the Go-Backs cart. Items cannot be manually put inside. When a virtual crate hits zero, it disappears from the UI.