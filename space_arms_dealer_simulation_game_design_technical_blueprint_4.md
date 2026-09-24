# Space Arms Dealer Simulation - Technical & Design Blueprint (Part 4)

## Step 21: Modular Shop Expansion
- **Layered Growth:** Expansion starts from a base footprint (e.g., 10x10). New tiles are purchased in "Layers" based on their proximity to the original footprint. 
- **Cost Scaling:** Costs increase linearly by layer (Layer 3 costs more than Layer 2), preventing players from expanding too rapidly, but scaling steadily rather than exponentially.
- **Bulk Discounts:** Tiles can be purchased in tiers (e.g., 5, 10, 20, 40). Buying larger tiers grants a percentage discount.
- **Boundaries & Padding:** The Master State permanently locks the top and bottom visual rows of the grid to ensure map walls are always visible and UI doesn't obscure playability.
- **Pathfinding Validation:** The simulation runs a flood-fill algorithm from the shop entrance. If a fixture is placed on a disconnected/unreachable tile, its `isReachable` flag is set to false, preventing customer AI and employee stocking AI from targeting it.

## Step 22: Hybrid Fixture Logic
- **Universal Shelving:** Standard items can go on any universal shelf, provided they meet the basic spatial width/height requirements.
- **Specialized Displays:** Certain display types restrict what can be placed on them (e.g., a weapon rack only accepts items tagged with the 'weapon' category). In exchange for this restriction, these specialized fixtures offer a gameplay benefit, such as a much deeper `stackDepth` in a smaller physical tile footprint.

## Step 23: Security & Shrinkage (Stretch Goals)
- **MVP Scope:** There is no active or passive theft in the MVP. The game remains a pure logistics and management puzzle.
- **Stretch Goals Log:** "Active Theft / Security Mini-Game" has been officially decoupled from the core loop and moved to a dedicated stretch goals list for post-MVP consideration.

## Step 24: Customer Factions & Accumulative Generation
- **Accumulative Spawning:** The daily customer count is not a zero-sum pie. The store's global reputation dictates a baseline pool of standard ("None" Faction) customers. 
- **Faction Additions:** As specific Faction reputations rise, those factions roll separately to *add* their members to the total daily customer pool.
- **Dual Reputation Tracking:** If a Faction member has a good/bad experience, the player gains/loses reputation points for both the Global Store Reputation and that specific Faction's Reputation simultaneously and independently.

## Step 25-28: Faction Identities & Demographics

**1. Scavengers**
- **Demands:** Strictly buy low-tier and surplus items.
- **Habits:** Feature very large "Optional" shopping lists. They are impulse buyers who act as excellent sweepers for cheap stock.
- **Currency:** Frequently pay in, and request change in, M-Scrips, though they still utilize Galactic Credits.

**2. Mercenaries**
- **Demands:** Mid-to-high range gear and weapons.
- **Habits:** Highly discriminating. They feature large "Primary" lists and small "Optional" lists, making them high risk/reward for reputation hits. They almost never buy multiples of a singular non-ammo/ordnance item (e.g., they will only buy qty: 1 of a specific rifle).

**3. Explorers**
- **Demands:** Primarily seek Tools, Survival gear, and Protective gear. Will only purchase small, self-defense tier weapons.
- **Habits:** Their "Primary" shopping list is guaranteed to contain at least one Tool. 
- **Currency:** Frequently pay with corporate Vouchers but expect their physical change in standard Galactic Credits.

## Step 29: Unified Procurement Market
- **Supplier Contracts:** Players unlock access to goods by purchasing Supplier Contracts (e.g., "Survival Surplus Supplier"). This requires meeting a fixed reputation threshold and paying a one-time contract fee. Once unlocked, access is permanent even if reputation later drops.
- **Unified Catalog:** Items are not siloed by supplier in the UI. All unlocked items populate into a single, unified DOM UI catalog (grouped by type like Weapons, Ammo, etc.) to eliminate tedious menu-hopping.
- **Pricing:** Base prices are fixed, but bulk purchasing (e.g., 10x Rifles) applies automatic discounts to the total cost.

## Step 30: Player Presence & Collision Logic
- **Hybrid Presence:** The player controls a physical avatar on the 2D Phaser canvas (to haul crates, man the register, etc.) but can access macro-management interfaces (like procurement or employee rosters) instantly via DOM UI overlays without walking to a physical terminal.
- **Collision Optimization:** To preserve performance and prevent AI gridlock, there is **no dynamic entity collision**. Customers and the player do not physically block each other; they only collide with static environments (walls/fixtures).
- **Z-Index & Rendering:** 
  - The player's avatar is strictly set to the highest depth (e.g., z-index 9999), ensuring they are never lost in a crowd.
  - Customers use Y-sorting for depth.
  - A "Micro-Offset" (tiny randomized pixel variance) is applied to customer sprites upon reaching a destination to prevent them from perfectly merging into a single visual blob if they target the same tile.

## Step 31: Avatar Customization
- **MVP Scope:** There is no player avatar customization for the MVP. The player character utilizes a single, static sprite sheet to streamline the 2D animation pipeline.