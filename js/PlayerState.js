import { Debugger } from './Debugger.js';

export class PlayerState {
    constructor() {
        this.credits = 1500; 
        this.globalReputation = 2;
        this.listeners = [];
    }

    addCredits(amount) {
        this.credits += amount;
        Debugger.log(`Earned ${amount}c. New Balance: ${this.credits}c`, '#10b981');
        this.notifyListeners();
    }

    spendCredits(amount) {
        this.credits -= amount;
        
        if (this.credits < 0) {
            Debugger.log(`Spent ${amount}c. WARNING: Account in deficit! Balance: ${this.credits}c`, '#ef4444');
        } else {
            Debugger.log(`Spent ${amount}c. New Balance: ${this.credits}c`, '#ef4444');
        }
        
        this.notifyListeners();
        return true; 
    }

    addReputation(amount) {
        this.globalReputation += amount;
        Debugger.log(`Reputation increased to ${this.globalReputation}!`, '#38bdf8');
        this.notifyListeners();
    }

    subscribe(callback) {
        this.listeners.push(callback);
        callback(this); // Fire immediately on subscribe to initialize UI
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback(this));
    }
}