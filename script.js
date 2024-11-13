const WORKERS_PRICING = {
    free_tier: {
        requests_daily: 100000,
        cpu_time: 10, // ms
    },
    paid_tier: {
        requests_cost_per_million: 0.30,
        cpu_cost_per_million: 0.02,
    }
};

function calculateWorkersCost() {
    const requestsPerDay = parseInt(document.getElementById('workers-requests').value) || 0;
    const cpuTime = parseFloat(document.getElementById('workers-cpu').value) || 0;
    
    // Calculate monthly values
    const monthlyRequests = requestsPerDay * 30;
    const monthlyCPUTime = monthlyRequests * cpuTime;
    
    let cost = 0;
    let isPaid = false;

    // Check if exceeds free tier
    if (requestsPerDay > WORKERS_PRICING.free_tier.requests_daily || 
        cpuTime > WORKERS_PRICING.free_tier.cpu_time) {
        isPaid = true;
        
        // Calculate requests cost
        if (requestsPerDay > WORKERS_PRICING.free_tier.requests_daily) {
            const extraRequests = monthlyRequests - (WORKERS_PRICING.free_tier.requests_daily * 30);
            cost += Math.max(0, (extraRequests / 1000000) * WORKERS_PRICING.paid_tier.requests_cost_per_million);
        }
        
        // Calculate CPU cost
        if (cpuTime > WORKERS_PRICING.free_tier.cpu_time) {
            const extraCPUTime = monthlyCPUTime - (WORKERS_PRICING.free_tier.requests_daily * 30 * WORKERS_PRICING.free_tier.cpu_time);
            cost += Math.max(0, (extraCPUTime / 1000000) * WORKERS_PRICING.paid_tier.cpu_cost_per_million);
        }
    }

    // Update UI
    const planBadge = document.getElementById('workers-plan');
    planBadge.textContent = isPaid ? 'Paid Plan' : 'Free Plan';
    planBadge.className = `plan-badge ${isPaid ? 'paid' : 'free'}`;
    
    document.getElementById('workers-cost').textContent = `$${cost.toFixed(2)}`;
    
    updateTotalCost();
}

function updateTotalCost() {
    const workersCost = parseFloat(document.getElementById('workers-cost').textContent.replace('$', ''));
    const isPaid = document.getElementById('workers-plan').textContent === 'Paid Plan';
    
    let totalCost = workersCost;
    if (isPaid) totalCost += 5; // Platform fee for paid plan

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
        input.addEventListener('input', calculateWorkersCost);
    });
});

// Continue with more product calculations
function calculateR2() {
    const storage = getCleanNumber(document.getElementById('r2-storage').value);
    const classA = getCleanNumber(document.getElementById('r2-class-a').value);
    const classB = getCleanNumber(document.getElementById('r2-class-b').value);
    
    const monthlyClassA = getMonthlyUsage(classA);
    const monthlyClassB = getMonthlyUsage(classB);
    
    let cost = 0;
    let isPaid = false;

    if (storage > PRICING.r2.free_tier.storage_gb || 
        monthlyClassA > PRICING.r2.free_tier.class_a_monthly ||
        monthlyClassB > PRICING.r2.free_tier.class_b_monthly) {
        isPaid = true;
        
        if (storage > PRICING.r2.free_tier.storage_gb) {
            cost += (storage - PRICING.r2.free_tier.storage_gb) * PRICING.r2.paid_tier.storage_cost_per_gb;
        }
        
        cost += calculateCostAboveFreeTier(monthlyClassA, PRICING.r2.free_tier.class_a_monthly, 
                                         PRICING.r2.paid_tier.class_a_cost_per_million);
        cost += calculateCostAboveFreeTier(monthlyClassB, PRICING.r2.free_tier.class_b_monthly, 
                                         PRICING.r2.paid_tier.class_b_cost_per_million);
    }

    updateProductUI('r2', cost, isPaid);
}

function calculateWorkersKV() {
    const reads = getCleanNumber(document.getElementById('kv-reads').value);
    const writes = getCleanNumber(document.getElementById('kv-writes').value);
    const deletes = getCleanNumber(document.getElementById('kv-deletes').value);
    const lists = getCleanNumber(document.getElementById('kv-lists').value);
    const storage = getCleanNumber(document.getElementById('kv-storage').value);
    
    let cost = 0;
    let isPaid = false;

    const monthlyReads = getMonthlyUsage(reads);
    const monthlyWrites = getMonthlyUsage(writes);
    const monthlyDeletes = getMonthlyUsage(deletes);
    const monthlyLists = getMonthlyUsage(lists);

    if (reads > PRICING.workersKV.free_tier.reads_daily ||
        writes > PRICING.workersKV.free_tier.writes_daily ||
        deletes > PRICING.workersKV.free_tier.deletes_daily ||
        lists > PRICING.workersKV.free_tier.lists_daily ||
        storage > PRICING.workersKV.free_tier.storage_gb) {
        isPaid = true;
        
        cost += calculateCostAboveFreeTier(monthlyReads, 
            PRICING.workersKV.free_tier.reads_daily * 30, 
            PRICING.workersKV.paid_tier.reads_cost_per_million);
        cost += calculateCostAboveFreeTier(monthlyWrites, 
            PRICING.workersKV.free_tier.writes_daily * 30, 
            PRICING.workersKV.paid_tier.writes_cost_per_million);
        cost += calculateCostAboveFreeTier(monthlyDeletes, 
            PRICING.workersKV.free_tier.deletes_daily * 30, 
            PRICING.workersKV.paid_tier.deletes_cost_per_million);
        cost += calculateCostAboveFreeTier(monthlyLists, 
            PRICING.workersKV.free_tier.lists_daily * 30, 
            PRICING.workersKV.paid_tier.lists_cost_per_million);
            
        if (storage > PRICING.workersKV.free_tier.storage_gb) {
            cost += (storage - PRICING.workersKV.free_tier.storage_gb) * 
                    PRICING.workersKV.paid_tier.storage_cost_per_gb;
        }
    }

    updateProductUI('kv', cost, isPaid);
}

// Similar calculation functions for other products...
// Add calculation functions for D1, Vectorize, Durable Objects, etc.

// UI Update Functions
function updateProductUI(productId, cost, isPaid) {
    const planBadge = document.getElementById(`${productId}-plan`);
    const costElement = document.getElementById(`${productId}-cost`);
    
    planBadge.textContent = isPaid ? 'Paid Plan' : 'Free Plan';
    planBadge.className = `plan-badge ${isPaid ? 'paid' : 'free'}`;
    costElement.textContent = `$${cost.toFixed(2)}`;
    
    updateTotalCost();
}

function updateTotalCost() {
    const products = ['workers', 'r2', 'kv', 'd1', 'vectorize', 'do', 'analytics', 
                     'zaraz', 'ai-gateway', 'cicd'];
    let totalCost = 0;
    let hasAnyPaidPlan = false;

    products.forEach(product => {
        const cost = parseFloat(document.getElementById(`${product}-cost`).textContent.replace('$', '')) || 0;
        const isPaid = document.getElementById(`${product}-plan`).textContent === 'Paid Plan';
        
        totalCost += cost;
        if (isPaid) hasAnyPaidPlan = true;
    });

    // Add platform fee if any paid plan
    if (hasAnyPaidPlan) {
        totalCost += 5;
    }

    // Update UI
    document.getElementById('total-cost').textContent = `$${totalCost.toFixed(2)}`;
    
    const overallPlan = document.getElementById('overall-plan');
    const planNote = document.getElementById('plan-note');
    
    overallPlan.textContent = hasAnyPaidPlan ? 'Paid Plan' : 'Free Plan';
    overallPlan.className = `plan-badge ${hasAnyPaidPlan ? 'paid' : 'free'}`;
    planNote.textContent = hasAnyPaidPlan ? '(Includes $5 platform fee)' : '';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add input event listeners to all numeric inputs
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            // Get the product ID from the input ID
            const productId = this.id.split('-')[0];
            
            // Call the appropriate calculation function
            switch(productId) {
                case 'workers': calculateWorkers(); break;
                case 'r2': calculateR2(); break;
                case 'kv': calculateWorkersKV(); break;
                // Add cases for other products
            }
        });
    });

    // Initialize calculations
    calculateWorkers();
    calculateR2();
    calculateWorkersKV();
    // Initialize other calculations
});

// Error Handling
function handleError(error, productId) {
    console.error(`Error calculating ${productId} cost:`, error);
    const costElement = document.getElementById(`${productId}-cost`);
    costElement.textContent = 'Error';
    costElement.style.color = '#f44336';
}

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Scroll to section
            const targetId = this.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.sticky-header').offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active button on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.category-section');
        const headerHeight = document.querySelector('.sticky-header').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionBottom) {
                const targetId = section.id;
                categoryButtons.forEach(button => {
                    button.classList.toggle('active', button.getAttribute('data-target') === targetId);
                });
            }
        });
    });
});
