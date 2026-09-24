// ==========================================
// FILE: Debugger.js
// ==========================================
export class Debugger {
  static log(message, color = "var(--color-text-main)") {
    const debugEl = document.getElementById("debug-text");
    if (debugEl) {
      const timestamp = new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      });
      const newEntry = `<div style="color: ${color}; margin-bottom: 2px;">[${timestamp}] ${message}</div>`;
      debugEl.innerHTML = newEntry + debugEl.innerHTML;

      const lines = debugEl.innerHTML.split("</div>");
      if (lines.length > 6)
        debugEl.innerHTML = lines.slice(0, 5).join("</div>") + "</div>";
    } else {
      console.log(`[DEBUG] ${message}`);
    }
  }
}

import { StoreItem } from "./Items.js";
import { Debugger } from "./Debugger.js";

// ==========================================
// FILE: DatabaseManager.js
// ==========================================
export class DatabaseManager {
  constructor() {
    this.items = new Map();
    this.itemList = [];
  }

  // Pass the parsed JSON array directly into here
  loadJSON(jsonArray) {
    let loadedCount = 0;
    jsonArray.forEach((data) => {
      const newItem = new StoreItem(data);
      this.items.set(newItem.id, newItem);
      this.itemList.push(newItem);
      loadedCount++;
    });
    Debugger.log(
      `Database loaded ${loadedCount} items successfully.`,
      "#10b981",
    );
  }

  getAllItems() {
    return this.itemList;
  }

  getItem(id) {
    return this.items.get(id);
  }
}

export class StoreItem {
  constructor(data) {
    // Core Properties (Shared by 100% of items)
    this.id = data.id;
    this.name = data.name;
    this.flavor = data.flavor;
    this.tags = data.tags; // e.g., ['Firearm', 'Standard', 'Rifle']
    this.dimensions = data.dimensions; // e.g., { w: 2, h: 1 }
    this.stackSize = data.stackSize;
    this.baseCost = data.baseCost;

    // Conditional Properties (Safely default to null/empty if not present)
    this.ammo = data.ammo || null; // String: What a gun shoots, or what an ammo box contains
    this.count = data.count || null; // Number: How many rounds are in an ammo box
    this.fits = data.fits || []; // Array: What tags/weapons an attachment can snap onto
  }

  // Example Helper Method:
  hasTag(tagString) {
    return this.tags.includes(tagString);
  }
}

// ==========================================
// FILE: UIWindow.js
// ==========================================
import { Debugger } from "./Debugger.js";

export class UIWindow {
  /**
   * @param {Object} config - { id, title, contentHTML, width, height, x, y, shouldCloseOtherWindows }
   * @param {WindowManager} manager - Reference to the central window manager
   */
  constructor(config, manager) {
    this.id = config.id;
    this.title = config.title;
    this.manager = manager;

    // --- Core State Properties ---
    this.screenX = config.x || 50;
    this.screenY = config.y || 50;
    this.width = config.width || "300px";
    this.height = config.height || "auto";
    this.shouldCloseOtherWindows = config.shouldCloseOtherWindows || false;

    this.isOpen = false;
    this.isDragging = false;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;

    // Build DOM and inject
    this.element = this.buildHTML(config.contentHTML);
    this.bindInternalEvents();
    document.getElementById("ui-layer").appendChild(this.element);

    // Register self with the manager
    this.manager.registerWindow(this);
  }

  buildHTML(contentHTML) {
    const win = document.createElement("div");
    win.id = this.id;
    win.className = "retro-window hidden";
    win.style.width = this.width;
    win.style.height = this.height;

    win.innerHTML = `
            <div class="retro-window-header" tabindex="0" aria-label="Drag ${this.title}">
                <span class="retro-window-title">${this.title}</span>
                <button class="retro-window-close" aria-label="Close">X</button>
            </div>
            <div class="retro-window-body">
                ${contentHTML}
            </div>
        `;
    return win;
  }

  bindInternalEvents() {
    const header = this.element.querySelector(".retro-window-header");
    const closeBtn = this.element.querySelector(".retro-window-close");

    // Internal Close Button
    closeBtn.addEventListener("click", () => this.close());

    // Focus on click anywhere inside
    this.element.addEventListener("mousedown", () =>
      this.manager.focusWindow(this),
    );

    // Dragging Initialization
    header.addEventListener("mousedown", (e) => {
      if (e.target.closest(".retro-window-close")) return;
      this.isDragging = true;
      const rect = this.element.getBoundingClientRect();
      this.dragOffsetX = e.clientX - rect.left;
      this.dragOffsetY = e.clientY - rect.top;
      this.manager.setDraggingWindow(this);
    });
  }

  // Called by WindowManager during mousemove
  updateDragPosition(clientX, clientY) {
    if (!this.isDragging) return;
    let newX = Math.max(
      0,
      Math.min(window.innerWidth - 100, clientX - this.dragOffsetX),
    );
    let newY = Math.max(
      0,
      Math.min(window.innerHeight - 50, clientY - this.dragOffsetY),
    );
    this.element.style.left = `${newX}px`;
    this.element.style.top = `${newY}px`;
  }

  // Called by WindowManager during mouseup
  stopDrag() {
    if (this.isDragging) {
      this.isDragging = false;
      // Update state to remember new location
      const rect = this.element.getBoundingClientRect();
      this.screenX = rect.left;
      this.screenY = rect.top;
      Debugger.log(
        `${this.id} coordinates saved: X:${Math.floor(this.screenX)}, Y:${Math.floor(this.screenY)}`,
      );
    }
  }

  // --- The Primary API Methods ---
  openWindow() {
    if (this.isOpen) {
      this.manager.focusWindow(this);
      return;
    }

    // The Gatekeeper Check
    if (this.shouldCloseOtherWindows) {
      Debugger.log(`${this.id} demands solo mode. Closing others.`, "#eab308");
      this.manager.closeAllExcept(this.id);
    }

    // Apply saved coordinates
    this.element.style.left = `${this.screenX}px`;
    this.element.style.top = `${this.screenY}px`;

    this.element.classList.remove("hidden");
    this.isOpen = true;
    this.manager.focusWindow(this);
    Debugger.log(`Opened ${this.id}`);
  }

  close() {
    if (!this.isOpen) return;
    this.element.classList.add("hidden");
    this.element.classList.remove("active");
    this.isOpen = false;
    Debugger.log(`Closed ${this.id}`);
    this.manager.passFocusToNextHighest();
  }
}

// ==========================================
// FILE: InventoryRenderer.js
// ==========================================
export class InventoryRenderer {
  static generateHTML(databaseManager) {
    const items = databaseManager.getAllItems();

    let html = `
        <div style="display: flex; gap: 4px; margin-bottom: 10px;">
            <button class="retro-tab-btn">Shift</button>
            <button class="retro-tab-btn active">Inventory DB</button>
            <button class="retro-tab-btn">Finances</button>
        </div>
        <div class="retro-slot custom-scrollbar" style="padding: 10px; display: flex; flex-direction: column; gap: 8px; flex: 1; overflow-y: auto;">
    `;

    items.forEach((item) => {
      // Map the tags array into HTML pills
      const tagHTML = item.tags
        .map((t) => `<span class="tag-badge">${t}</span>`)
        .join("");

      // Conditionally generate the extra data row ONLY if ammo or count exist
      let extraDataHTML = "";
      if (item.ammo || item.count) {
        const ammoSpan = item.ammo
          ? `<span>Uses: ${item.ammo}</span>`
          : `<span></span>`;
        const countSpan = item.count
          ? `<span>Qty: ${item.count}</span>`
          : `<span></span>`;

        // This ensures the optional row stays perfectly formatted and independent
        extraDataHTML = `
                <div style="display: flex; justify-content: space-between; margin-top: 4px; color: #eab308;">
                    ${ammoSpan}
                    ${countSpan}
                </div>
            `;
      }

      // Build the card layout (Footer is now strictly separated into rows)
      html += `
            <div class="item-card">
                <div class="item-card-header">
                    <span class="item-card-title">${item.name}</span>
                    <span class="item-card-cost">${item.baseCost}c</span>
                </div>
                <div class="item-card-flavor">"${item.flavor}"</div>
                <div style="display:flex; gap: 6px; flex-wrap:wrap; margin: 4px 0;">
                    ${tagHTML}
                </div>
                <div class="item-card-footer">
                    <div style="display: flex; justify-content: space-between;">
                        <span>Dim: [${item.dimensions.w}x${item.dimensions.h}]</span>
                        <span>Stack: x${item.stackSize}</span>
                    </div>
                    ${extraDataHTML}
                </div>
            </div>
        `;
    });

    html += `</div>`;
    return html;
  }
}

// ==========================================
// FILE: WindowManager.js
// ==========================================
export class WindowManager {
  constructor() {
    this.windows = new Map(); // Store UIWindow class instances
    this.draggedWindow = null;
    this.currentMaxZ = 100;

    this.bindGlobalEvents();
  }

  registerWindow(uiWindowInstance) {
    this.windows.set(uiWindowInstance.id, uiWindowInstance);
  }

  getWindow(id) {
    return this.windows.get(id);
  }

  bindGlobalEvents() {
    // Global Drag Listeners
    document.addEventListener("mousemove", (e) => {
      if (this.draggedWindow)
        this.draggedWindow.updateDragPosition(e.clientX, e.clientY);
    });

    document.addEventListener("mouseup", () => {
      if (this.draggedWindow) {
        this.draggedWindow.stopDrag();
        this.draggedWindow = null;
      }
    });

    // Global Keyboard Accessibility (Escape key)
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const activeWinEl = document.querySelector(".retro-window.active");
        if (activeWinEl) {
          const activeWinObj = this.getWindow(activeWinEl.id);
          if (activeWinObj) activeWinObj.close();
        }
      }
    });
  }

  setDraggingWindow(win) {
    this.draggedWindow = win;
    this.focusWindow(win);
  }

  focusWindow(win) {
    this.windows.forEach((w) => w.element.classList.remove("active"));
    win.element.classList.add("active");
    this.currentMaxZ++;
    win.element.style.zIndex = this.currentMaxZ;
  }

  passFocusToNextHighest() {
    let highest = null;
    let maxZ = 0;
    this.windows.forEach((w) => {
      if (w.isOpen) {
        const z = parseInt(w.element.style.zIndex || 0);
        if (z > maxZ) {
          maxZ = z;
          highest = w;
        }
      }
    });
    if (highest) this.focusWindow(highest);
  }

  closeAllExcept(ignoreId = null) {
    this.windows.forEach((w) => {
      if (w.id !== ignoreId) w.close();
    });
  }
}
