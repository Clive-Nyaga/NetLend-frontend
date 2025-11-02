/**
 * Payment Scheduler Utility
 * 
 * Handles mortgage payment scheduling and calculations for NetLend platform.
 * Implements the requirement that monthly payments are due on the last day of each month.
 */

/**
 * Calculate the last day of a given month
 * @param {Date} date - Reference date
 * @returns {Date} - Last day of the month
 */
export const getLastDayOfMonth = (date = new Date()) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  // Get last day by going to first day of next month and subtracting 1 day
  return new Date(year, month + 1, 0);
};

/**
 * Calculate the next payment due date (last day of current or next month)
 * @param {Date} lastPaymentDate - Date of last payment (optional)
 * @returns {Date} - Next payment due date
 */
export const getNextPaymentDueDate = (lastPaymentDate = null) => {
  const today = new Date();
  const lastDayOfCurrentMonth = getLastDayOfMonth(today);
  
  // If no previous payment or it's before the last day of current month, due this month
  if (!lastPaymentDate || today <= lastDayOfCurrentMonth) {
    return lastDayOfCurrentMonth;
  }
  
  // Otherwise, due last day of next month
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  return getLastDayOfMonth(nextMonth);
};

/**
 * Calculate monthly payment amount using standard mortgage formula
 * @param {number} principal - Loan principal amount
 * @param {number} annualRate - Annual interest rate (percentage)
 * @param {number} years - Loan term in years
 * @returns {number} - Monthly payment amount
 */
export const calculateMonthlyPayment = (principal, annualRate, years) => {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;
  
  if (monthlyRate === 0) {
    return principal / numPayments;
  }
  
  const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                        (Math.pow(1 + monthlyRate, numPayments) - 1);
  
  return Math.round(monthlyPayment);
};

/**
 * Calculate remaining balance after a payment
 * @param {number} currentBalance - Current outstanding balance
 * @param {number} paymentAmount - Payment amount
 * @param {number} monthlyInterest - Monthly interest rate (decimal)
 * @returns {number} - New remaining balance
 */
export const calculateRemainingBalance = (currentBalance, paymentAmount, monthlyInterest) => {
  const interestPayment = currentBalance * monthlyInterest;
  const principalPayment = paymentAmount - interestPayment;
  return Math.max(0, currentBalance - principalPayment);
};

/**
 * Generate payment schedule for a mortgage
 * @param {Object} mortgageData - Mortgage details
 * @returns {Array} - Array of payment schedule objects
 */
export const generatePaymentSchedule = (mortgageData) => {
  const {
    principalAmount,
    interestRate,
    loanTermYears = 25,
    startDate = new Date()
  } = mortgageData;
  
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = loanTermYears * 12;
  const monthlyPayment = calculateMonthlyPayment(principalAmount, interestRate, loanTermYears);
  
  const schedule = [];
  let remainingBalance = principalAmount;
  let currentDate = new Date(startDate);
  
  for (let i = 0; i < numPayments && remainingBalance > 0; i++) {
    // Set payment due date to last day of the month
    const paymentDate = getLastDayOfMonth(currentDate);
    
    const interestPayment = remainingBalance * monthlyRate;
    const principalPayment = Math.min(monthlyPayment - interestPayment, remainingBalance);
    remainingBalance -= principalPayment;
    
    schedule.push({
      paymentNumber: i + 1,
      dueDate: paymentDate,
      totalPayment: monthlyPayment,
      principalPayment: Math.round(principalPayment),
      interestPayment: Math.round(interestPayment),
      remainingBalance: Math.round(remainingBalance)
    });
    
    // Move to next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  return schedule;
};

/**
 * Check if a payment is overdue
 * @param {Date} dueDate - Payment due date
 * @param {Date} currentDate - Current date (defaults to today)
 * @returns {boolean} - True if payment is overdue
 */
export const isPaymentOverdue = (dueDate, currentDate = new Date()) => {
  return currentDate > dueDate;
};

/**
 * Calculate days until next payment
 * @param {Date} dueDate - Payment due date
 * @param {Date} currentDate - Current date (defaults to today)
 * @returns {number} - Days until payment (negative if overdue)
 */
export const getDaysUntilPayment = (dueDate, currentDate = new Date()) => {
  const timeDiff = dueDate.getTime() - currentDate.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

/**
 * Format payment status based on due date
 * @param {Date} dueDate - Payment due date
 * @returns {Object} - Status object with text and color
 */
export const getPaymentStatus = (dueDate) => {
  const daysUntil = getDaysUntilPayment(dueDate);
  
  if (daysUntil < 0) {
    return { status: 'overdue', color: '#ef4444', text: `${Math.abs(daysUntil)} days overdue` };
  } else if (daysUntil === 0) {
    return { status: 'due_today', color: '#f59e0b', text: 'Due today' };
  } else if (daysUntil <= 7) {
    return { status: 'due_soon', color: '#f59e0b', text: `Due in ${daysUntil} days` };
  } else {
    return { status: 'current', color: '#10b981', text: `Due in ${daysUntil} days` };
  }
};

export default {
  getLastDayOfMonth,
  getNextPaymentDueDate,
  calculateMonthlyPayment,
  calculateRemainingBalance,
  generatePaymentSchedule,
  isPaymentOverdue,
  getDaysUntilPayment,
  getPaymentStatus
};