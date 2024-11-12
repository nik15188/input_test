// Function to double the input number
function doubleNumber() {
    // Get the input value
    const input = Number(document.getElementById('inputNumber').value);
    
    // Calculate double
    const result = input * 2;
    
    // Display the result
    document.getElementById('result').textContent = result;
}
