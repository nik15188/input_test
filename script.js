// Pricing Constants
const PRICING = {
    workers: {
        free: {
            requestsPerDay: 100000,
            cpuTimePerInvocation: 10
        },
        paid: {
            includedRequestsPerMonth: 10000000,
            includedCpuTimePerMonth: 30000000,
            additionalRequestsCost: 0.30,
            additionalCpuTimeCost: 0.02
        }
    },
    r2: {
        free: {
            storageGB: 10,
            classAMonthly: 1000000,
            classBMonthly: 10000000
        },
        paid: {
            storagePerGB: 0.015,
            classAPerMillion: 4.50,
            classBPerMillion: 0.36
        }
    },
    workersKV: {
        free: {
            readsPerDay: 100000,
            writesPerDay: 1000,
            deletesPerDay: 1000,
            listsPerDay: 1000,
            storageGB: 1
        },
        paid: {
            includedReadsPerMonth: 10000000,
            includedWritesPerMonth: 1000000,
            includedDeletesPerMonth: 1000000,
            includedListsPerMonth: 1000000,
            includedStorageGB: 1,
            additionalReadsPerMillion: 0.50,
            additionalWritesPerMillion: 5.0,
            additionalDeletesPerMillion: 5.0,
            additionalListsPerMillion: 5.0,
            additionalStoragePerGB: 0.50
        }
    },
    // ... continue with other products
};

// Utility Functions
function calculateMonthlyUsage(dailyValue) {
    return (parseFloat(dailyValue) || 0) * 30;
}

function calculateExcessCost(usage, included, ratePerUnit, unitSize = 1000000) {
    const excess = Math.max(usage - included, 0);
    return Math.ceil(excess / unitSize) * ratePerUnit;
}


// Calculate workers monthly volume test
function calculateWorkersMonthlyRequests() {
    // Get and validate input
    const requestsPerDay = parseFloat(document.getElementById('workers-requests').value) || 0;
    
    // Calculate monthly requests
    const monthlyRequests = requestsPerDay * 30;
    
    // Update the span element with the monthly value
    const monthlySpan = document.getElementById('workers-month');
    if (monthlySpan) {
        monthlySpan.textContent = formatNumber(monthlyRequests);
    }

    return {
        month: monthlyRequests
    };
}


// Product Calculation Functions
function calculateWorkers() {
    const requestsPerDay = parseFloat(document.getElementById('workers-requests').value) || 0;
    const cpuTime = parseFloat(document.getElementById('workers-cpu').value) || 0;
    
    const monthlyRequests = calculateMonthlyUsage(requestsPerDay);
    const monthlyCPUTime = monthlyRequests * cpuTime;
    
    let cost = 0;
    let isPaid = false;

    if (requestsPerDay > PRICING.workers.free.requestsPerDay || 
        cpuTime > PRICING.workers.free.cpuTimePerInvocation) {
        isPaid = true;
        
        const billedRequests = monthlyRequests - PRICING.workers.paid.includedRequestsPerMonth;
        const billedCPUTime = monthlyCPUTime - PRICING.workers.paid.includedCpuTimePerMonth;
        
        cost += Math.max(Math.ceil(billedRequests/1000000) * PRICING.workers.paid.additionalRequestsCost, 0);
        cost += Math.max(Math.ceil(billedCPUTime/1000000) * PRICING.workers.paid.additionalCpuTimeCost, 0);
    }

    return {
        cost: cost.toFixed(2),
        isPaid
    };
}

// Add this event listener code
document.addEventListener('DOMContentLoaded', function() {
    // Get the workers requests input
    const workersInput = document.getElementById('workers-requests');
    
    if (workersInput) {
        // Listen for input changes
        workersInput.addEventListener('input', function() {
            calculateWorkersMonthlyRequests();
        });

        // Initial calculation when page loads
        calculateWorkersMonthlyRequests();
    }
});

// Helper function to format numbers (optional)
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

function calculateR2() {
    const storage = parseFloat(document.getElementById('r2-storage').value) || 0;
    const classA = parseFloat(document.getElementById('r2-class-a').value) || 0;
    const classB = parseFloat(document.getElementById('r2-class-b').value) || 0;
    
    const monthlyClassA = calculateMonthlyUsage(classA);
    const monthlyClassB = calculateMonthlyUsage(classB);
    
    let cost = 0;
    let isPaid = false;

    if (storage > PRICING.r2.free.storageGB || 
        monthlyClassA > PRICING.r2.free.classAMonthly ||
        monthlyClassB > PRICING.r2.free.classBMonthly) {
        isPaid = true;
        
        if (storage > PRICING.r2.free.storageGB) {
            cost += (storage - PRICING.r2.free.storageGB) * PRICING.r2.paid.storagePerGB;
        }
        
        cost += calculateExcessCost(monthlyClassA, PRICING.r2.free.classAMonthly, 
                                  PRICING.r2.paid.classAPerMillion);
        cost += calculateExcessCost(monthlyClassB, PRICING.r2.free.classBMonthly, 
                                  PRICING.r2.paid.classBPerMillion);
    }

    return {
        cost: cost.toFixed(2),
        isPaid
    };
}

// Similar functions for other products...
function calculateWorkersKV() {
    const reads = parseFloat(document.getElementById('kv-reads').value) || 0;
    const writes = parseFloat(document.getElementById('kv-writes').value) || 0;
    const deletes = parseFloat(document.getElementById('kv-deletes').value) || 0;
    const lists = parseFloat(document.getElementById('kv-lists').value) || 0;
    const storage = parseFloat(document.getElementById('kv-storage').value) || 0;
    
    let cost = 0;
    let isPaid = false;

    if (reads > PRICING.workersKV.free.readsPerDay ||
        writes > PRICING.workersKV.free.writesPerDay ||
        deletes > PRICING.workersKV.free.deletesPerDay ||
        lists > PRICING.workersKV.free.listsPerDay ||
        storage > PRICING.workersKV.free.storageGB) {
        isPaid = true;
        
        const monthlyReads = calculateMonthlyUsage(reads);
        const monthlyWrites = calculateMonthlyUsage(writes);
        const monthlyDeletes = calculateMonthlyUsage(deletes);
        const monthlyLists = calculateMonthlyUsage(lists);

        cost += calculateExcessCost(monthlyReads, PRICING.workersKV.paid.includedReadsPerMonth,
                                  PRICING.workersKV.paid.additionalReadsPerMillion);
        cost += calculateExcessCost(monthlyWrites, PRICING.workersKV.paid.includedWritesPerMonth,
                                  PRICING.workersKV.paid.additionalWritesPerMillion);
        cost += calculateExcessCost(monthlyDeletes, PRICING.workersKV.paid.includedDeletesPerMonth,
                                  PRICING.workersKV.paid.additionalDeletesPerMillion);
        cost += calculateExcessCost(monthlyLists, PRICING.workersKV.paid.includedListsPerMonth,
                                  PRICING.workersKV.paid.additionalListsPerMillion);
        
        if (storage > PRICING.workersKV.free.storageGB) {
            cost += (storage - PRICING.workersKV.free.storageGB) * 
                    PRICING.workersKV.paid.additionalStoragePerGB;
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
    const requests = parseFloat(document.getElementById('do-requests').value) || 0;
    const duration = parseFloat(document.getElementById('do-duration').value) || 0;
    
    let cost = 0;
    let isPaid = false;

    if (requests > 0 || duration > 0) {
        isPaid = true;
        
        const excessRequests = Math.max(requests - 1000000, 0);
        const excessDuration = Math.max(duration - 400000, 0);

        cost += Math.ceil(excessRequests / 1000000) * 0.15;      // $0.15 per million requests
        cost += Math.ceil(excessDuration / 1000000) * 12.50;     // $12.50 per million GB-seconds
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

        cost += Math.ceil(excessQueries / 1000000) * 0.01;           // $0.01 per million queries
        cost += Math.ceil(excessStorage / 100000000) * 0.05;         // $0.05 per 100M dimensions
    }

    return {
        cost: cost.toFixed(2),
        isPaid
    };
}

function calculateAIGateway() {
    const logsPerDay = parseFloat(document.getElementById('ai-gateway-logs').value) || 0;
    const monthlyLogs = calculateMonthlyUsage(logsPerDay);
    
    let cost = 0;
    let isPaid = false;

    if (monthlyLogs > 100000) {
        isPaid = true;
        
        if (monthlyLogs > 200000) {
            const excessLogs = monthlyLogs - 200000;
            cost += Math.ceil(excessLogs / 100000) * 8.0;    // $8 per 100k logs
        }
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

        cost += Math.ceil(excessDataPoints / 1000000) * 0.25;    // $0.25 per million datapoints
        cost += Math.ceil(excessQueries / 1000000) * 1.0;        // $1.00 per million queries
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
        cost += Math.ceil(excessEvents / 1000000) * 5.0;    // $5.00 per million events
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
            cost += excessMinutes * 0.005;    // $0.005 per minute
        }
    }

    return {
        cost: cost.toFixed(2),
        isPaid
    };
}

// UI Update Functions
function updateProductUI(productId, result) {
    const planBadge = document.getElementById(`${productId}-plan`);
    const costElement = document.getElementById(`${productId}-cost`);
    
    planBadge.textContent = result.isPaid ? 'Paid Plan' : 'Free Plan';
    planBadge.className = `plan-badge ${result.isPaid ? 'paid' : 'free'}`;
    costElement.textContent = `$${result.cost}`;
}

function updateTotalCost() {
    const products = [
        { id: 'workers', calc: calculateWorkers },
       // { id: 'workers', calc:calculateWorkersMonthlyRequests },
        { id: 'r2', calc: calculateR2 },
        { id: 'kv', calc: calculateWorkersKV },
        { id: 'd1', calc: calculateD1 },
        { id: 'do', calc: calculateDurableObjects },
        { id: 'vectorize', calc: calculateVectorize },
        { id: 'ai-gateway', calc: calculateAIGateway },
        { id: 'analytics', calc: calculateAnalyticsEngine },
        { id: 'zaraz', calc: calculateZaraz },
        { id: 'cicd', calc: calculateCICD }
    ];

    let totalCost = 0;
    let hasAnyPaidPlan = false;

    // Calculate costs and update UI for each product
    products.forEach(product => {
        const result = product.calc();
        updateProductUI(product.id, result);
        
        totalCost += parseFloat(result.cost);
        if (result.isPaid) hasAnyPaidPlan = true;
    });

    // Add platform fee if any paid plan
    if (hasAnyPaidPlan) {
        totalCost += 5; // $5 platform fee
    }

    // Update total cost display
    document.getElementById('total-cost').textContent = `$${totalCost.toFixed(2)}`;
    
    // Update overall plan badge
    const overallPlan = document.getElementById('overall-plan');
    const planNote = document.getElementById('plan-note');
    
    overallPlan.textContent = hasAnyPaidPlan ? 'Paid Plan' : 'Free Plan';
    overallPlan.className = `plan-badge ${hasAnyPaidPlan ? 'paid' : 'free'}`;
    planNote.textContent = hasAnyPaidPlan ? '(Includes $5 platform fee)' : '';
}

// Error Handling
function handleError(error, productId) {
    console.error(`Error calculating ${productId} cost:`, error);
    const costElement = document.getElementById(`${productId}-cost`);
    costElement.textContent = 'Error';
    costElement.style.color = '#f44336';
}

// Navigation Functions
function initializeNavigation() {
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
                const targetPosition = targetSection.getBoundingClientRect().top + 
                                    window.pageYOffset - headerHeight - 20;
                
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
                    button.classList.toggle('active', 
                        button.getAttribute('data-target') === targetId);
                });
            }
        });
    });
}

// Input Formatting Functions
const formatConfig = {
    workers: {
        requests: { max: 1000000000, step: 1000, suffix: ' requests' },
        cpu: { max: 50, step: 0.1, suffix: ' ms' }
    },
    r2: {
        storage: { max: 1000000, step: 1, suffix: ' GB' },
        classA: { max: 1000000000, step: 1000, suffix: ' ops' },
        classB: { max: 1000000000, step: 1000, suffix: ' ops' }
    },
    kv: {
        reads: { max: 1000000000, step: 1000, suffix: ' ops' },
        writes: { max: 1000000000, step: 1000, suffix: ' ops' },
        deletes: { max: 1000000000, step: 1000, suffix: ' ops' },
        lists: { max: 1000000000, step: 1000, suffix: ' ops' },
        storage: { max: 1000000, step: 1, suffix: ' GB' }
    },
    d1: {
        reads: { max: 1000000000, step: 1000, suffix: ' rows' },
        writes: { max: 1000000000, step: 1000, suffix: ' rows' },
        storage: { max: 1000000, step: 1, suffix: ' GB' }
    },
    vectorize: {
        queries: { max: 1000000000, step: 1000, suffix: ' dims' },
        storage: { max: 1000000000, step: 1000, suffix: ' dims' }
    },
    analytics: {
        datapoints: { max: 1000000000, step: 1000, suffix: ' points' },
        queries: { max: 1000000000, step: 1000, suffix: ' queries' }
    }
};

function formatNumber(value) {
    if (value >= 1000000000) {
        return (value / 1000000000).toFixed(1) + 'B';
    } else if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
        return (value / 1000).toFixed(1) + 'K';
    }
    return value.toString();
}

function formatInputValue(value, config) {
    if (!value) return '0' + (config.suffix || '');
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '0' + (config.suffix || '');
    
    return formatNumber(numValue) + (config.suffix || '');
}

function getCleanNumber(value) {
    if (typeof value === 'string') {
        // Remove any non-numeric characters except decimal point
        value = value.replace(/[^0-9.]/g, '');
    }
    return parseFloat(value) || 0;
}

// Enhanced Input Event Handlers
function setupInputFormatting() {
    const inputs = document.querySelectorAll('input[type="number"]');
    
    inputs.forEach(input => {
        const [productId, inputType] = input.id.split('-');
        const config = formatConfig[productId]?.[inputType];
        
        if (!config) return;

        // Create formatted display element
        const formattedDisplay = document.createElement('div');
        formattedDisplay.className = 'formatted-value';
        input.parentNode.appendChild(formattedDisplay);

        // Style the input container
        input.parentNode.style.position = 'relative';

        // Input event handlers
        input.addEventListener('input', function(e) {
            let value = getCleanNumber(this.value);
            
            // Apply max limit
            if (config.max && value > config.max) {
                value = config.max;
                this.value = value;
            }

            // Update formatted display
            formattedDisplay.textContent = formatInputValue(value, config);
            
            // Trigger cost calculation
            updateTotalCost();
        });

        input.addEventListener('focus', function() {
            formattedDisplay.style.opacity = '0';
            this.value = getCleanNumber(this.value);
        });

        input.addEventListener('blur', function() {
            let value = getCleanNumber(this.value);
            
            // Round to step
            if (config.step) {
                value = Math.round(value / config.step) * config.step;
            }
            
            this.value = value;
            formattedDisplay.style.opacity = '1';
            formattedDisplay.textContent = formatInputValue(value, config);
        });

        // Initialize formatted display
        formattedDisplay.textContent = formatInputValue(input.value, config);
    });
}

// Add this CSS
const style = document.createElement('style');
style.textContent = `
    .input-group {
        position: relative;
    }
    
    .formatted-value {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        color: #666;
        pointer-events: none;
        transition: opacity 0.2s;
        font-size: 0.9em;
    }
    
    input[type="number"] {
        padding-right: 80px;
    }
    
    /* Hide browser arrows */
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    input[type="number"] {
        -moz-appearance: textfield;
    }
`;
document.head.appendChild(style);

// Product descriptions for tooltips
const productDescriptions = {
    workers: {
        title: "Workers",
        description: "Serverless JavaScript execution environment. Run code across the Cloudflare network edge.",
        pricing: "Free Tier: 100,000 requests/day, 10ms CPU time\nPaid: $0.30/million requests after first 10M/month",
        useCase: "Ideal for: API handling, web applications, and edge computing tasks"
    },
    r2: {
        title: "R2 Storage",
        description: "Object storage service with no egress fees. Compatible with S3 API.",
        pricing: "Free Tier: 10GB storage, 1M Class A ops, 10M Class B ops\nPaid: $0.015/GB/month after free tier",
        useCase: "Ideal for: Storing large files, backups, and static assets"
    },
    workersKV: {
        title: "Workers KV",
        description: "Low-latency key-value data store accessible from Workers.",
        pricing: "Free Tier: 100k reads/day, 1k writes/day\nPaid: $0.50/million reads, $5.00/million writes",
        useCase: "Ideal for: Configuration data, user sessions, and cached content"
    },
    d1: {
        title: "D1 Database",
        description: "Serverless SQL database built on SQLite.",
        pricing: "Free Tier: 5M rows read/day, 100k writes/day, 5GB storage\nPaid: Based on usage",
        useCase: "Ideal for: Relational data storage, full SQL query capabilities"
    },
    durableObjects: {
        title: "Durable Objects",
        description: "Stateful serverless computing with strong consistency.",
        pricing: "Paid: $0.15/million requests, $12.50/million GB-seconds",
        useCase: "Ideal for: Coordination, real-time applications, and gaming"
    },
    aiGateway: {
        title: "AI Gateway",
        description: "Managed access to AI models with built-in caching and security.",
        pricing: "Free Tier: 100k logs/month\nPaid: $8.00/100k logs after 200k",
        useCase: "Ideal for: AI model integration and management"
    },
    vectorize: {
        title: "Vectorize",
        description: "Vector database for AI and machine learning applications.",
        pricing: "Free Tier: 30M vector dimensions queried/month\nPaid: $0.01/million after 50M",
        useCase: "Ideal for: Semantic search, AI embeddings storage"
    },
    cicd: {
        title: "Workers CI/CD",
        description: "Continuous integration and deployment for Workers.",
        pricing: "Free Tier: 3,000 minutes/month\nPaid: $0.005/minute after 6,000",
        useCase: "Ideal for: Automated testing and deployment"
    },
    observability: {
        title: "Observability",
        description: "Monitoring and debugging tools for Workers and Pages.",
        pricing: "Free Tier: 200k events/day\nPaid: $0.60/million events after 20M/month",
        useCase: "Ideal for: Performance monitoring and debugging"
    },
    analytics: {
        title: "Workers Analytics Engine",
        description: "Real-time analytics processing and storage.",
        pricing: "Free Tier: 100k points/day, 10k queries/day\nPaid: $0.25/million points",
        useCase: "Ideal for: Custom analytics and event tracking"
    },
    zaraz: {
        title: "Zaraz",
        description: "Third-party tool manager running at the edge.",
        pricing: "Free Tier: 1M events/month\nPaid: $5.00/million events",
        useCase: "Ideal for: Marketing tags, analytics, and third-party scripts"
    }
};

// Add this CSS
const tooltipStyles = document.createElement('style');
tooltipStyles.textContent = `
    .product-tooltip {
        position: relative;
        cursor: help;
    }

    .product-tooltip .tooltip-content {
        visibility: hidden;
        position: absolute;
        z-index: 1000;
        width: 300px;
        background: white;
        border: 1px solid #e3f2fd;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        opacity: 0;
        transition: opacity 0.3s, transform 0.3s;
        transform: translateY(10px);
        left: -10px;
        top: 100%;
        margin-top: 10px;
        pointer-events: none;
    }

    .product-tooltip:hover .tooltip-content {
        visibility: visible;
        opacity: 1;
        transform: translateY(0);
    }

    .tooltip-content::before {
        content: '';
        position: absolute;
        top: -6px;
        left: 20px;
        width: 12px;
        height: 12px;
        background: white;
        transform: rotate(45deg);
        border-left: 1px solid #e3f2fd;
        border-top: 1px solid #e3f2fd;
    }

    .tooltip-title {
        font-weight: bold;
        color: #1976d2;
        margin-bottom: 8px;
        font-size: 1.1em;
    }

    .tooltip-description {
        margin-bottom: 8px;
        color: #333;
    }

    .tooltip-pricing {
        margin-bottom: 8px;
        color: #666;
        font-size: 0.9em;
        white-space: pre-line;
    }

    .tooltip-usecase {
        color: #2196f3;
        font-style: italic;
        font-size: 0.9em;
    }
`;
document.head.appendChild(tooltipStyles);

// Function to create tooltips
function setupTooltips() {
    const productTitles = document.querySelectorAll('.product-card h3');
    
    productTitles.forEach(title => {
        const productId = title.closest('.product-card').id.split('-')[0];
        const productInfo = productDescriptions[productId];
        
        if (!productInfo) return;

        // Wrap title text in tooltip container
        const tooltipWrapper = document.createElement('div');
        tooltipWrapper.className = 'product-tooltip';
        tooltipWrapper.innerHTML = `
            ${title.textContent}
            <div class="tooltip-content">
                <div class="tooltip-title">${productInfo.title}</div>
                <div class="tooltip-description">${productInfo.description}</div>
                <div class="tooltip-pricing">${productInfo.pricing}</div>
                <div class="tooltip-usecase">${productInfo.useCase}</div>
            </div>
        `;

        title.textContent = '';
        title.appendChild(tooltipWrapper);
    });
}

// Event Listeners and Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initializeNavigation();

    // Add input formatting
    setupInputFormatting();

    // Add input event listeners to all numeric inputs
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            try {
                // Ensure non-negative values
                if (this.value < 0) this.value = 0;
                
                // Update costs
                updateTotalCost();
            } catch (error) {
                handleError(error, this.id.split('-')[0]);
            }
        });

        // Add blur event to format numbers
        input.addEventListener('blur', function() {
            if (this.value === '') this.value = '0';
        });
    });

    // Initialize calculations
    updateTotalCost();

    // Add tooltips
    setupTooltips();
});

// Input Validation
function validateInput(input) {
    const value = parseFloat(input.value);
    if (isNaN(value) || value < 0) {
        input.value = 0;
        return false;
    }
    return true;
}
