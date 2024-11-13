// Product Calculation Functions

function calculateWorkers() {
    const requestsPerDay = parseFloat(document.getElementById('workers-requests').value) || 0;
    const cpuTime = parseFloat(document.getElementById('workers-cpu').value) || 0;
    
    const monthlyRequests = calculateMonthlyUsage(requestsPerDay);
    const monthlyCPUTime = monthlyRequests * cpuTime;
    
    let cost = 0;
    let isPaid = false;

    if (requestsPerDay > 100000 || cpuTime > 10) {
        isPaid = true;
        const billedRequests = monthlyRequests - 10000000;
        const billedCPUTime = monthlyCPUTime - 30000000;
        
        cost += Math.max(Math.ceil(billedRequests/1000000) * 0.30, 0);
        cost += Math.max(Math.ceil(billedCPUTime/1000000) * 0.02, 0);
    }

    return {
        cost: cost.toFixed(2),
        isPaid
    };
}

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
        
        if (storage > 10) {
            cost += (storage - 10) * 0.015;
        }
        
        if (monthlyClassA > 1000000) {
            cost += Math.ceil((monthlyClassA - 1000000) / 1000000) * 4.50;
        }
        
        if (monthlyClassB > 10000000) {
            cost += Math.ceil((monthlyClassB - 10000000) / 1000000) * 0.36;
        }
    }

    return {
        cost: cost.toFixed(2),
        isPaid
    };
}

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

    if (reads > 100000 || writes > 1000 || deletes > 1000 || 
        lists > 1000 || storage > 1) {
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

function calculateD1() {
    const readsPerDay = parseFloat(document.getElementById('d1-reads').value) || 0;
    const writesPerDay = parseFloat(document.getElementById('d1-writes').value) || 0;
    const storage = parseFloat(document.getElementById('d1-storage').value) || 0;
    
    const monthlyReads = calculateMonthlyUsage(readsPerDay);
    const monthlyWrites = calculateMonthlyUsage(writesPerDay);
    
    let cost = 0;
    let isPaid = false;

    if (readsPerDay > 5000000 || writesPerDay > 100000 || storage > 5) {
        isPaid = true;
        
        const excessReads = Math.max(monthlyReads - 25000000000, 0);
        const excessWrites = Math.max(monthlyWrites - 50000000, 0);
        const excessStorage = Math.max(storage - 5, 0);

        cost += Math.ceil(excessReads / 1000000) * 0.001;  // $0.001 per million reads
        cost += Math.ceil(excessWrites / 1000000) * 1.0;   // $1.00 per million writes
        cost += excessStorage * 0.75;  // $0.75 per GB
    }

    return {
        cost: cost.toFixed(2),
        isPaid
    };
}

function calculateDurableObjects() {
    const requests = parseFloat(document.getElementById('durableObjects-requests').value) || 0;
    const duration = parseFloat(document.getElementById('durableObjects-duration').value) || 0;
    
    const monthlyRequests = calculateMonthlyUsage(requests);
    const monthlyDuration = calculateMonthlyUsage(duration);
    
    let cost = 0;
    let isPaid = false;

    if (requests > 0 || duration > 0) {
        isPaid = true;
        
        const excessRequests = Math.max(monthlyRequests - 1000000, 0);
        const excessDuration = Math.max(monthlyDuration - 400000, 0);

        cost += Math.ceil(excessRequests / 1000000) * 0.15;
        cost += Math.ceil(excessDuration / 1000000) * 12.50;
    }

    return {
        cost: cost.toFixed(2),
        isPaid
    };
}

function calculateAIGateway() {
    const logsPerDay = parseFloat(document.getElementById('aiGateway-logs').value) || 0;
    const monthlyLogs = calculateMonthlyUsage(logsPerDay);
    
    let cost = 0;
    let isPaid = false;

    if (monthlyLogs > 100000) {
        isPaid = true;
        const excessLogs = Math.max(monthlyLogs - 200000, 0);
        cost += Math.ceil(excessLogs / 100000) * 8.00;
    }

    return {
        cost: cost.toFixed(2),
        isPaid
    };
}

function calculateVectorize() {
    const queries = parseFloat(document.getElementById('vectorize-queries').value) || 0;
    const storage = parseFloat(document.getElementById('vectorize-storage').value) || 0;
    
    let cost = 0;
    let isPaid = false;

    if (queries > 30000000 || storage > 5000000) {
        isPaid = true;
        
        const excessQueries = Math.max(queries - 50000000, 0);
        const excessStorage = Math.max(storage - 10000000, 0);

        cost += Math.ceil(excessQueries / 1000000) * 0.01;
        cost += Math.ceil(excessStorage / 100000000) * 0.05;
    }

    return {
        cost: cost.toFixed(2),
        isPaid
    };
}

function calculateAnalyticsEngine() {
    const dataPoints = parseFloat(document.getElementById('analytics-datapoints').value) || 0;
    const queries = parseFloat(document.getElementById('analytics-queries').value) || 0;
    
    const monthlyDataPoints = calculateMonthlyUsage(dataPoints);
    const monthlyQueries = calculateMonthlyUsage(queries);
    
    let cost = 0;
    let isPaid = false;

    if (dataPoints > 100000 || queries > 10000) {
        isPaid = true;
        
        const excessDataPoints = Math.max(monthlyDataPoints - 10000000, 0);
        const excessQueries = Math.max(monthlyQueries - 1000000, 0);

        cost += Math.ceil(excessDataPoints / 1000000) * 0.25;
        cost += Math.ceil(excessQueries / 1000000) * 1.0;
    }

    return {
        cost: cost.toFixed(2),
        isPaid
    };
}

function calculateZaraz() {
    const eventsPerDay = parseFloat(document.getElementById('zaraz-events').value) || 0;
    const monthlyEvents = calculateMonthlyUsage(eventsPerDay);
    
    let cost = 0;
    let isPaid = false;

    if (monthlyEvents > 1000000) {
        isPaid = true;
        const excessEvents = monthlyEvents - 1000000;
        cost += Math.ceil(excessEvents / 1000000) * 5.0;
    }

    return {
        cost: cost.toFixed(2),
        isPaid
    };
}

function calculateCICD() {
    const minutesPerDay = parseFloat(document.getElementById('cicd-minutes').value) || 0;
    const monthlyMinutes = calculateMonthlyUsage(minutesPerDay);
    
    let cost = 0;
    let isPaid = false;

    if (monthlyMinutes > 3000) {
        isPaid = true;
        
        if (monthlyMinutes > 6000) {
            const excessMinutes = monthlyMinutes - 6000;
            cost += excessMinutes * 0.005;
        }
    }

    return {
        cost: cost.toFixed(2),
        isPaid
    };
}

function calculateObservability() {
    const eventsPerDay = parseFloat(document.getElementById('observability-events').value) || 0;
    const monthlyEvents = calculateMonthlyUsage(eventsPerDay);
    
    let cost = 0;
    let isPaid = false;

    if (eventsPerDay > 200000) {
        isPaid = true;
        const excessEvents = Math.max(monthlyEvents - 20000000, 0);
        cost += Math.ceil(excessEvents / 1000000) * 0.60;
    }

    return {
        cost: cost.toFixed(2),
        isPaid
    };
}

// Utility Functions
function calculateMonthlyUsage(dailyValue) {
    return (parseFloat(dailyValue) || 0) * 30;
}

function updateProductUI(productId, result) {
    const planBadge = document.getElementById(`${productId}-plan`);
    const costElement = document.getElementById(`${productId}-cost`);
    
    if (planBadge && costElement) {
        planBadge.textContent = result.isPaid ? 'Paid Plan' : 'Free Plan';
        planBadge.className = `plan-badge ${result.isPaid ? 'paid' : 'free'}`;
        costElement.textContent = `$${result.cost}`;
    }
}

function calculateTotalCost() {
    let totalCost = 0;
    let hasAnyPaidPlan = false;

    const products = [
        { id: 'workers', calc: calculateWorkers },
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

    products.forEach(product => {
        try {
            const result = product.calc();
            if (result.isPaid) hasAnyPaidPlan = true;
            totalCost += parseFloat(result.cost);
            updateProductUI(product.id, result);
        } catch (error) {
            console.error(`Error calculating ${product.id}:`, error);
        }
    });

    if (hasAnyPaidPlan) {
        totalCost += 5; // Platform fee
    }

    // Update total cost display
    const totalCostElement = document.getElementById('total-cost');
    if (totalCostElement) {
        totalCostElement.textContent = `$${totalCost.toFixed(2)}`;
    }

    // Update overall plan badge
    const overallPlan = document.getElementById('overall-plan');
    const planNote = document.getElementById('plan-note');
    
    if (overallPlan && planNote) {
        overallPlan.textContent = hasAnyPaidPlan ? 'Paid Plan' : 'Free Plan';
        overallPlan.className = `plan-badge ${hasAnyPaidPlan ? 'paid' : 'free'}`;
        planNote.textContent = hasAnyPaidPlan ? '(Includes $5 platform fee)' : '';
    }
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initializeNavigation();

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
