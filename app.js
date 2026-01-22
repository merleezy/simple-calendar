const grid = document.querySelector(".button-grid");
const currentInput = document.querySelector(".current-input");
const answerScreen = document.querySelector(".answer-screen");

let currentValue = "0";
let previousValue = "";
let operator = "";
let justCalculated = false;

grid.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const value = btn.textContent.trim();

  if (btn.id === "clear") {
    clear();
    return;
  }

  if (btn.classList.contains("number-button")) {
    if (justCalculated) {
      clear();
      justCalculated = false;
    }
    handleNumber(value);
  } else if (btn.classList.contains("operator-button")) {
    handleOperator(value);
  }

  updateDisplay();
});

function handleNumber(num) {
  const MAX_LENGTH = 15;

  if (num === ".") {
    if (currentValue.includes(".")) return;

    currentValue = currentValue === "0" ? "0." : currentValue + ".";
    return;
  }
  if (currentValue.length > MAX_LENGTH) return;

  currentValue = currentValue === "0" ? num : currentValue + num;
}

function handleOperator(op) {
  if (op === "+/-") return toggleSign();
  if (op === "=") return executeCalculation();

  // If we reach this point, it's a standard operator
  chainOperation(op);
}

function toggleSign() {
  currentValue = String(-parseFloat(currentValue));
}

function executeCalculation() {
  if (!operator) return;
  calculate();
  justCalculated = true;
  operator = "";
  previousValue = "";
}

function chainOperation(nextOp) {
  if (previousValue && operator) {
    calculate();
  }

  if (currentValue !== "0" || previousValue === "") {
    previousValue = currentValue;
    currentValue = "0";
  }

  operator = nextOp;
  justCalculated = false;
}

function calculate() {
  if (previousValue === "" || currentValue === "0") return;

  const prev = parseFloat(previousValue);
  const current = parseFloat(currentValue);
  let result;

  switch (operator) {
    case "+":
      result = prev + current;
      break;
    case "-":
      result = prev - current;
      break;
    case "x":
      result = prev * current;
      break;
    case "/":
    case "÷":
      result = prev / current;
      break;
    default:
      return;
  }

  currentValue = String(parseFloat(result.toFixed(10)));

  // Convert to exponential if too long
  if (currentValue.replace("-", "").replace(".", "").length > 17) {
    currentValue = parseFloat(result).toExponential(6);
  }
}

function updateDisplay() {
  answerScreen.textContent = currentValue;
  currentInput.textContent =
    previousValue && operator ? `${previousValue} ${operator}` : "";
}

function clear() {
  currentValue = "0";
  previousValue = "";
  operator = "";
  updateDisplay();
}
