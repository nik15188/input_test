// Utility function to calculate monthly usage from daily input
function calculateMonthlyUsage(dailyValue) {
    return dailyValue * 30;
}

// Utility function to format numbers with K/M/B suffixes
function formatNumber(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// R2 Storage Calculation
function calculateR2() {
    const storage = parseFloat(document.getElementById('r2-storage').value) || 0;
    const classA = parseFloat(document.getElementById('r2-class-a').value) || 0;
    const classB = parseFloat(document.getElementById('r2-class-b').value) || 0;
    
    const monthlyClassA = calculateMonthlyUsage(classA);
    const monthlyClassB = calculateMonthlyUsage(classB);
    
    let cost = 0;
    let isPaid = false;

    if (storage > 10 || monthlyClassA > 1000000 || monthlyClassB > 10000000) {
        isPaid = true;
        const storageCost = Math.max(storage - 10, 0) * 0.015;
        const classACost = Math.ceil(Math.max(monthlyClassA - 1000000, 0) / 1000000) * 4.5;
        const classBCost = Math.ceil(Math.max(monthlyClassB - 10000000, 0) / 1000000) * 0.36;
        cost = storageCost + classACost + classBCost;
    }

    return {
        cost: cost.toFixed(2),
        isPaid
    };
}

// Workers KV Calculation
function calculateWorkersKV() {
    const reads = parseFloat(document.getElementById('kv-reads').value) || 0;
    const writes = parseFloat(document.getElementById('kv-writes').value) || 0;
    const deletes = parseFloat(document.getElementById('kv-deletes').value) || 0;
    const lists = parseFloat(document.getElementById('kv-lists').value) || 0;
    const storage = parseFloat(document.getElementById('kv-storage').value) || 0;
    
    const monthlyReads = calculateMonthlyUsage(reads);
    const monthlyWrites = calculateMonthlyUsage(writes);
    const monthlyDeletes = calculateMonthlyUsage(deletes);
    const monthlyLists = calculateMonthlyUsage(lists);
    
    let cost = 0;
    let isPaid = false;

    if (reads > 100000 || writes > 1000 || deletes > 1000 || lists > 1000 || storage > 1) {
        isPaid = true;
        
        if (monthlyReads > 10000000) {
            cost += Math.ceil((monthlyReads - 10000000) / 1000000) * 0.50;
        }
        if (monthlyWrites > 1000000) {
            cost += Math.ceil((monthlyWrites - 1000000) / 1000000) * 5.0;
        }
        if (monthlyDeletes > 1000000) {
            cost += Math.ceil((monthlyDeletes - 1000000) / 1000000) * 5.0;
        }
        if (monthlyLists > 1000000) {
            cost += Math.ceil((monthlyLists - 1000000) / 1000000) * 5.0;
        }
        if (storage > 1) {
            cost += (storage - 1) * 0.50;
        }
    }

    return {
        cost: cost.toFixed(2),
        isPaid
    };
}

// D1 Database Calculation
function calculateD1() {
    const reads = parseFloat(document.getElementById('d1-reads').value) || 0;
    const writes = parseFloat(document.getElementById('d1-writes').value) || 0;
    const storage = parseFloat(document.getElementById('d1-storage').value) || 0;
    
    const monthlyReads = calculateMonthlyUsage(reads);
    const monthlyWrites = calculateMonthlyUsage(writes);
    
    let cost = 0;
    let isPaid = false;

    if (reads > 5000000 || writes > 100000 || storage > 5) {
        isPaid = true;
        
        if (monthlyReads > 25000000000) {
            cost += Math.ceil((monthlyReads - 25000000000) / 1000000) * 0.001;
        }
        if (monthlyWrites > 50000000) {
            cost += Math.ceil((monthlyWrites - 50000000) / 1000000) * 1.0;
        }
        if (storage > 5) {
            cost += (storage - 5) * 0.75;
        }
    }

    return {
        cost: cost.toFixed(2),
        isPaid
    };
}

// Durable Objects Calculation
function calculateDurableObjects() {
    const requests = parseFloat(document.getElementById('durableObjects-requests').value) || 0;
    const duration = parseFloat(document.getElementById('durableObjects-duration').value) || 0;
    
    let cost = 0;
    let isPaid = false;

    if (requests > 0 || duration > 0) {
        isPaid = true;
        
        if (requests > 1000000) {
            cost += Math.ceil((requests - 1000000) / 1000000) * 0.15;
        }
        if (duration > 400000) {
            cost += Math.ceil((duration - 400000) / 1000000) * 12.50;
        }
    }

    return {
        cost: cost.toFixed(2),
        isPaid
    };
}

// AI Gateway Calculation
function calculateAIGateway() {
    const logsPerDay = parseFloat(document.getElementById('aiGateway-logs').value) || 0;
    const monthlyLogs = calculateMonthlyUsage(logsPerDay);
    
    let cost = 0;
    let isPaid = false;

    if (monthlyLogs > 100000) {
        isPaid = true;
        if (monthlyLogs > 200000) {
            cost += Math.ceil((monthlyLogs - 200000) / 100000) * 8.00;
        }
    }

    return {
        cost: cost.toFixed(2),
        isPaid
    };
}

// Vectorize Calculation
function calculateVectorize() {
    const queries = parseFloat(document.getElementById('vectorize-queries').value) || 0;
    const storage = parseFloat(document.getElementById('vectorize-storage').value) || 0;
    
    let cost = 0;
    let isPaid = false;

    if (queries > 30000000 || storage > 5000000) {
        isPaid = true;
        
        if (queries > 50000000) {
            cost += Math.ceil((queries - 50000000) / 1000000) * 0.01;
        }
        if (storage > 10000000) {
            cost += Math.ceil((storage - 10000000) / 100000000) * 0.05;
        }
    }

    return {
        cost: cost.toFixed(2),
        isPaid
    };
}

// Analytics Engine Calculation
function calculateAnalyticsEngine() {
    const dataPoints = parseFloat(document.getElementById('analytics-datapoints').value) || 0;
    const queries = parseFloat(document.getElementById('analytics-queries').value) || 0;
    
    const monthlyDataPoints = calculateMonthlyUsage(dataPoints);
    const monthlyQueries = calculateMonthlyUsage(queries);
    
    let cost = 0;
    let isPaid = false;

    if (dataPoints > 100000 || queries > 10000) {
        isPaid = true;
        
        if (monthlyDataPoints > 10000000) {
            cost += Math.ceil((monthlyDataPoints - 10000000) / 1000000) * 0.25;
        }
        if (monthlyQueries > 1000000) {
            cost += Math.ceil((monthlyQueries - 1000000) / 1000000) * 1.0;
        }
    }

    return {
        cost: cost.toFixed(2),
        isPaid
    };
}

// Zaraz Calculation
function calculateZaraz() {
    const eventsPerDay = parseFloat(document.getElementById('zaraz-events').value) || 0;
    const monthlyEvents = calculateMonthlyUsage(eventsPerDay);
    
    let cost = 0;
    let isPaid = false;

    if (monthlyEvents > 1000000) {
        isPaid = true;
        cost += Math.ceil((monthlyEvents - 1000000) / 1000000) * 5.0;
    }

    return {
        cost: cost.toFixed(2),
        isPaid
    };
}

// CI/CD Calculation
function calculateCICD() {
    const minutesPerDay = parseFloat(document.getElementById('cicd-minutes').value) || 0;
    const monthlyMinutes = calculateMonthlyUsage(minutesPerDay);
    
    let cost = 0;
    let isPaid = false;

    if (monthlyMinutes > 3000) {
        isPaid = true;
        
        if (monthlyMinutes > 6000) {
            cost += (monthlyMinutes - 6000) * 0.005;
        }
    }

    return {
        cost: cost.toFixed(2),
        isPaid
    };
}

// Observability Calculation
function calculateObservability() {
    const eventsPerDay = parseFloat(document.getElementById('observability-events').value) || 0;
    const monthlyEvents = calculateMonthlyUsage(eventsPerDay);
    
    let cost = 0;
    let isPaid = false;

    if (eventsPerDay > 200000) {
        isPaid = true;
        if (monthlyEvents > 20000000) {
            cost += Math.ceil((monthlyEvents - 20000000) / 1000000) * 0.60;
        }
    }

    return {
        cost: cost.toFixed(2),
        isPaid
    };
}

function calculateTotalCost() {
    // Initialize variables
    let totalCost = 0;
    let hasAnyPaidPlan = false;

    // Define all products and their calculation functions
    const products = [
        { id: 'workers', calc: calculateWorkersKV },
        { id: 'r2', calc: calculateR2 },
        { id: 'kv', calc: calculateWorkersKV },
        { id: 'd1', calc: calculateD1 },
        { id: 'durableObjects', calc: calculateDurableObjects },
        { id: 'vectorize', calc: calculateVectorize },
        { id: 'aiGateway', calc: calculateAIGateway },
        { id: 'analytics', calc: calculateAnalyticsEngine },
        { id: 'zaraz', calc: calculateZaraz },
        { id: 'cicd', calc: calculateCICD },
        { id: 'observability', calc: calculateObservability }
    ];

    // Calculate cost for each product and update UI
    products.forEach(product => {
        const result = product.calc();
        updateProductUI(product.id, result);
        
        totalCost += parseFloat(result.cost);
        if (result.isPaid) {
            hasAnyPaidPlan = true;
        }
    });

    // Add platform fee if any paid plan exists
    if (hasAnyPaidPlan) {
        totalCost += 5; // $5 platform fee
    }

    // Update total cost display
    const totalCostElement = document.getElementById('total-cost');
    if (totalCostElement) {
        totalCostElement.textContent = `$${totalCost.toFixed(2)}`;
    }

    // Update overall plan status
    const overallPlan = document.getElementById('overall-plan');
    const planNote = document.getElementById('plan-note');
    
    if (overallPlan && planNote) {
        overallPlan.textContent = hasAnyPaidPlan ? 'Paid Plan' : 'Free Plan';
        overallPlan.className = `plan-badge ${hasAnyPaidPlan ? 'paid' : 'free'}`;
        planNote.textContent = hasAnyPaidPlan ? '(Includes $5 platform fee)' : '';
    }
}

// Helper function to update individual product UI
function updateProductUI(productId, result) {
    const planBadge = document.getElementById(`${productId}-plan`);
    const costElement = document.getElementById(`${productId}-cost`);
    
    if (planBadge && costElement) {
        planBadge.textContent = result.isPaid ? 'Paid Plan' : 'Free Plan';
        planBadge.className = `plan-badge ${result.isPaid ? 'paid' : 'free'}`;
        costElement.textContent = `$${result.cost}`;
    }
}

// Function to check if a specific input would trigger paid tier
function checkIfPaidTier(inputId, value) {
    const paidTierLimits = {
        'workers-requests': 100000,
        'workers-cpu': 10,
        'r2-storage': 10,
        'r2-class-a': 33333, // 1M/30 days
        'r2-class-b': 333333, // 10M/30 days
        'kv-reads': 100000,
        'kv-writes': 1000,
        'kv-deletes': 1000,
        'kv-lists': 1000,
        'kv-storage': 1,
        'd1-reads': 5000000,
        'd1-writes': 100000,
        'd1-storage': 5,
        'durableObjects-requests': 0, // Any usage triggers paid
        'durableObjects-duration': 0, // Any usage triggers paid
        'vectorize-queries': 1000000, // 30M/30 days
        'vectorize-storage': 5000000,
        'aiGateway-logs': 3333, // 100K/30 days
        'analytics-datapoints': 100000,
        'analytics-queries': 10000,
        'zaraz-events': 33333, // 1M/30 days
        'cicd-minutes': 100, // 3000/30 days
        'observability-events': 200000
    };

    return value > (paidTierLimits[inputId] || 0);
}

// Function to update tier information as user types
function updateTierInfo(input, isPaidTier) {
    const parent = input.closest('.input-group');
    if (!parent) return;

    let tierNote = parent.querySelector('.tier-note');
    if (!tierNote) {
        tierNote = document.createElement('div');
        tierNote.className = 'tier-note';
        parent.appendChild(tierNote);
    }

    tierNote.textContent = isPaidTier ? 'This usage will trigger paid tier' : '';
    tierNote.className = `tier-note ${isPaidTier ? 'paid' : ''}`;
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Setup input formatting and event listeners
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value < 0) this.value = 0;
            calculateTotalCost();
            updateTierInfo(this, checkIfPaidTier(this.id, parseFloat(this.value) || 0));
        });

        input.addEventListener('blur', function() {
            if (this.value === '') this.value = '0';
            calculateTotalCost();
        });
    });

    // Initial calculation
    calculateTotalCost();
});
