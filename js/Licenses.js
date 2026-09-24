export class SupplierLicense {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.tier = data.tier;
        this.baseCost = data.baseCost;
        this.reqReputation = data.reqReputation;
    }

    /**
     * Check if the player meets the reputation requirement to buy this license.
     * @param {PlayerState} playerState 
     */
    isUnlocked(playerState) {
        return playerState.globalReputation >= this.reqReputation;
    }

    /**
     * Check if the player has enough credits to buy this license.
     * @param {PlayerState} playerState 
     */
    canAfford(playerState) {
        return playerState.credits >= this.baseCost;
    }
}