# Space Arms Dealer Simulation - Technical & Design Blueprint (Part 3)

## Step 13: Employee Task Management
- **Priority-Based Workflow:** Employees do not have fixed "roles" (e.g., just a Cashier). Instead, players manage a checklist of roles/tasks for each employee.
- **Customization:** Players can enable, disable, and dynamically reorder these tasks.
- **Execution Logic:** The employee's AI evaluates the task list strictly from top to bottom.
- **UI Interaction:** The task hierarchy can be modified at any time (on or off shift) via the employee's status screen in the DOM UI.

## Step 14: Employee Logistics (Hovercarts)
- **Independent Instances:** Hired employees are granted their own unique Hovercart instance.
- **Capacity & Pathfinding:** The employee cart shares the exact same spatial capacity and hovering pathfinding rules as the player's cart.
- **Non-Interference:** Employee logistics are entirely segregated from player logistics. An employee utilizing their cart does not lock the player out of using their own personal Hovercart.

## Step 15: Employee Stocking Logic
- **Auto-Fill Routine:** When evaluating the "Stock Shelves" priority, the employee AI automatically scans all physical fixtures for empty `gridDimensions` slots.
- **Execution:** The AI cross-references the empty slots with available crates in the backroom inventory, claims the crates, loads them onto their personal Hovercart, and physically distributes them on the 2D Phaser canvas.

## Step 16: Empty Stock Handling
- **Event-Driven UI Alerts:** If an employee attempts to auto-fill an empty shelf but the backroom is completely devoid of matching stock, the AI skips the shelf.
- **Notification:** The Master State emits an out-of-stock event, prompting the DOM UI to display a lightweight notification (e.g., "Out of Stock: [Item Name]").
- **Player Agency:** The employee does *not* auto-purchase stock. Procurement remains a manual, strategic player action.

## Step 17: Shift Scheduling & Budgeting
- **Granular Scheduling:** Players dictate exactly how long an employee works during the 12 GTC hour shop shift.
- **Limits:** An employee can be scheduled between a minimum of 3 hours and a maximum of 12 hours (inclusive).
- **Economy:** Employees charge a flat hourly rate (always in Galactic Credits). This requires the player to actively budget their payroll prior to opening the shift.

## Step 18: Clocking Out (Polite Finish)
- **Graceful State Resolution:** When an employee's scheduled hours expire (e.g., hitting hour 6 of a 12-hour shift), they do not hard-stop or drop items.
- **Task Completion:** The AI finishes the immediate micro-interaction it is currently processing (e.g., finalizing a customer checkout or placing the active crate on a shelf).
- **Exit:** Once the immediate action resolves, the AI reads its `isClockingOut` flag, abandons the remainder of its priority list, and paths off the canvas.

## Step 19: The Hiring Pool, Stats & Training
- **Static Roster:** The applicant pool consists of hand-crafted, unique alien characters with preset names, species, initial recruitment costs, and hourly rates. Better base stats equate to higher costs.
- **Employee Stats:**
  - *Stock Speed*
  - *Checkout Speed*
  - *Attitude:* Low (chance of reputation penalty per interaction), Medium (no effect), High (chance of reputation boost per interaction).
- **Stat Grading:** Graded strictly from S (Best) to F (Worst): S, A, B, C, D, E, F.
- **The Training Loop (Money & Time Sink):**
  - Stats do not increase organically through gameplay.
  - Players manually pay to train one stat at a time.
  - *Cost:* Increases exponentially per rank (F to E is cheap; A to S is extremely expensive).
  - *Time Penalty:* Training takes exactly 1 full shift. The employee becomes completely unavailable for work starting the day *after* the training is purchased.

## Step 20: Roster Progression
- **Silent Unlocks:** As the shop's global reputation reaches hidden thresholds, new static employees are injected into the hiring pool.
- **UI Handling:** The DOM UI simply populates a new row in the hiring menu with a "New" badge, preserving the simulation's uninterrupted flow without forcing narrative pop-ups.