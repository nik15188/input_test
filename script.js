const PRODUCT_1_PRICING = {
    free_tier: {
        usage: 100000,  // Monthly usage limit
        storage: 10,    // Storage limit in GB
    },
    paid_tier: {
        usage_cost: 0.50,    // Cost per 100k usage
        storage_cost: 0.10   // Cost per GB
    }
};

function calculateProduct1Cost() {
    const usage = parseInt(document.getElementById('product1-usage').value) || 0;
    const storage = parseFloat(document.getElementById('product1-storage').value) || 0;
    
    let cost = 0;
    let isPaid = false;

    // Check if exceeds free tier
    if (usage > PRODUCT_1_PRICING.free_tier.usage || 
        storage > PRODUCT_1_PRICING.free_tier.storage) {
        isPaid = true;
        
        // Calculate usage cost
        if (usage > PRODUCT_1_PRICING.free_tier.usage) {
            const extraUsage = usage - PRODUCT_1_PRICING.free_tier.usage;
            cost += Math.ceil(extraUsage / 100000) * PRODUCT_1_PRICING.paid_tier.usage_cost;
        }
        
        // Calculate storage cost
        if (storage > PRODUCT_1_PRICING.free_tier.storage) {
            const extraStorage = storage - PRODUCT_1_PRICING.free_tier.storage;
            cost += extraStorage * PRODUCT_1_PRICING.paid_tier.storage_cost;
        }
    }

    // Update UI
    const planBadge = document.getElementById('product1-plan');
    planBadge.textContent = isPaid ? 'Paid Plan' : 'Free Plan';
    planBadge.className = `plan-badge ${isPaid ? 'paid' : 'free'}`;
    
    document.getElementById('product1-cost').textContent = `$${cost.toFixed(2)}`;
    
    updateTotalCost();
}

function updateTotalCost() {
    const product1Cost = parseFloat(document.getElementById('product1-cost').textContent.replace('$', ''));
    const isPaid = document.getElementById('product1-plan').textContent === 'Paid Plan';
    
    let totalCost = product1Cost;
    if (isPaid) totalCost += 5; // Additional $5 for paid plan

    document.getElementById('total-cost').textContent = `$${totalCost.toFixed(2)}`;
    
    const overallPlan = document.getElementById('overall-plan');
    const planNote = document.getElementById('plan-note');
    
    overallPlan.textContent = isPaid ? 'Paid Plan' : 'Free Plan';
    overallPlan.className = `plan-badge ${isPaid ? 'paid' : 'free'}`;
    planNote.textContent = isPaid ? '(Includes $5 platform fee)' : '';
}

// Add event listeners
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', calculateProduct1Cost);
    });
});
