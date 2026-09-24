# Space Arms Dealer Simulation - Technical & Design Blueprint (Planning Doc 1)

## Step 1: Platform & Tech Stack Architecture

- **Target Platform:** PC Desktop (wrapped and distributed via Electron). Mobile and consoles are deprioritized to allow for a flexible, UI-heavy architecture.
- **Architecture Paradigm:** Hybrid Rendering.
  - **2D Canvas Engine (Phaser/Pixi.js):** Handles the top-down physical shop floor, character pathfinding, and collision.
  - **HTML/CSS/DOM:** Layered over the canvas to handle complex management windows, straight-on shelf views, procurement markets, and the interactive checkout register.
- **Core Philosophy:** S.O.L.I.D. principles, specifically separating the presentation layer from the simulation logic (Dependency Inversion). The DOM and the Canvas never directly manipulate each other.

## Step 2: Time Management & The Game Loop

- **Time Measurement:** Galactic Time Code (GTC).
- **Flow of Time:** Real-time simulation utilizing a "Manual Toggle" hybrid approach.
- **Mechanics:**
  - The player decides when to "Open Shift." A standard shift lasts 12 GTC hours.
  - When the shop is closed, time is paused (infinite downtime). The player can meticulously arrange shelves, check finances, and order stock without stress.
  - **Progression:** Early game requires the player to run the shop manually. Mid/Late game allows hiring employees (e.g., alien clerks) who can run shifts, allowing the player to manage macro-operations from the back office while the shop runs automatically.

## Step 3: The Minimum Viable Product (MVP) Bridge

To ensure the DOM UI and 2D Canvas work together seamlessly, the engine relies on three foundational pillars:

1. **The Master State:** The single source of truth (e.g., Redux or a custom state manager). It holds all financial data, inventory counts, and customer data.
2. **The Event Bus:** A messaging system that handles communication between the Canvas, the DOM, and the Master State without tangling their codebases.
3. **Strict Decoupling:** The UI is "dumb." It only displays data and reports user inputs. All logic happens in the Master State.

## Step 4: The Item Data Contract

Organizing the shop is a tactical, spatial puzzle viewed via straight-on DOM UI windows. Sellable items require this data structure:

- `baseDimensions`: {w, h} (The physical grid footprint).
- `isRotated`: Boolean (Allows swapping width and height on the fly; does not overwrite base dimensions).
- `supportedDisplayTypes`: Array of strings (e.g., `['rocket_hanger']`). Ensures heavy ordnance can't be placed on a simple pegboard.
- `canStack`: Boolean.
- `stackDepth`: Number (Volume capacity on the Z-axis).

## Step 5: The Fixture (Shelf) Data Contract

- `gridDimensions`: {w, h} (The capacity of the furniture).
- `displayType`: String (Checked against the item's supported types).
- `stackDepth`: Number (Limits how deep items can stack here).
- _Visual Rule:_ Stacked items occupying the same spatial grid slot will simply display an "xN" badge (e.g., "x4") on their sprite to avoid complex overlapping rendering.

## Step 6: The Checkout Flow

The checkout process is highly tactile and manually driven by the player in the early game.

- **The Grab (Phaser):** Customer decides to buy an item. The item vanishes from the shelf (updating the UI instantly) and is stored in the customer's "Virtual Cart."
- **The Queue (Phaser):** Customer walks to the register and enters a waiting state.
- **The Ring-Up (DOM UI):** Player clicks the register, opening a tactile numpad and cash drawer interface. Player manually punches in totals and drags/drops physical change.

## Step 7: Payment Resolution Logic

- **Mistake Resolution (Push Your Luck):** If the player gives the wrong change (too much or too little), the UI submits the raw transaction to the Master State.
- The Master State rolls a hidden die against the specific Customer's hidden traits (`honesty`, `temper`).
- The customer may accept the error, gently correct the player, or get angry (costing store reputation). The UI handles no logic here, only displays the Master State's resolution.

## Step 8: Currency System & Base Units

To simplify complex algebraic conversions, the Master State evaluates all money against a hidden "Base Unit" (like calculating everything down to pennies).

- Exchange rates across different space currencies are **static** (no daily market fluctuations).
- The DOM UI just multiplies the physical bills dragged by the player by their static value and sends one clean total integer to the Master State.

## Step 9: The Four Galactic Currencies & Data Structure

The game features four distinct galactic currencies with the following data contract (`id`, `name`, `baseMultiplier`, `denominations`):

1. **Galactic Credits:** The standard economic baseline.
2. **M-Scrips (Material Scrips):** Paper currency backed by raw/recycled materials; common in lower-tier scavenger economies.
3. **Vouchers:** High-value corporate/trade paper.
4. **Solar Bonds:** Highly stable currency used primarily by militaries and military-backed civilizations.

## Step 10: The Procurement Flow

_(Currently Brainstorming)_
