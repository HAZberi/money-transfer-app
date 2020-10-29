"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Hassaan Ahmed Zuberi",
  transactions: [
    { amount: 200, type: "deposit" },
    { amount: 450, type: "deposit" },
    { amount: -400, type: "withdraw" },
    { amount: 3000, type: "deposit" },
    { amount: -650, type: "withdraw" },
    { amount: -130, type: "withdraw" },
    { amount: 70, type: "deposit" },
    { amount: 1300, type: "deposit" },
    { amount: 1000, type: "loan" },
  ],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Muhammad Omar Chohan",
  transactions: [
    { amount: 5000, type: "deposit" },
    { amount: 3400, type: "deposit" },
    { amount: -150, type: "withdraw" },
    { amount: -790, type: "withdraw" },
    { amount: -3210, type: "withdraw" },
    { amount: -1000, type: "withdraw" },
    { amount: 8500, type: "deposit" },
    { amount: -30, type: "withdraw" },
    { amount: 1000, type: "loan" },
  ],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Saifullah Khan Chughtai",
  transactions: [
    { amount: 200, type: "deposit" },
    { amount: -200, type: "withdraw" },
    { amount: 340, type: "deposit" },
    { amount: -300, type: "withdraw" },
    { amount: -20, type: "withdraw" },
    { amount: 50, type: "deposit" },
    { amount: 4000, type: "deposit" },
    { amount: -460, type: "withdraw" },
    { amount: 1000, type: "loan" },
  ],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Hasan Iqbal Baig",
  transactions: [
    { amount: 430, type: "deposit" },
    { amount: 1000, type: "deposit" },
    { amount: 700, type: "deposit" },
    { amount: 50, type: "deposit" },
    { amount: 90, type: "deposit" },
    { amount: 1000, type: "loan" },
  ],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerTransactions = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayTransactions = function (transactions, sort = false) {
  containerTransactions.innerHTML = "";
  const trans = sort
    ? [...transactions].sort((a, b) => a.amount - b.amount)
    : transactions;
  let countTr = Array.from({ length: 3 }, () => 1);
  trans.forEach((tran, i) => {
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${
      tran.type === "loan" || tran.type === "deposit" ? "deposit" : "withdrawal"
    }">${
      (tran.type === "deposit" && countTr[0]++) ||
      (tran.type === "withdraw" && countTr[1]++) ||
      countTr[2]++
    } ${tran.type}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${
      tran.amount > 0
        ? "$" + tran.amount.toFixed(2)
        : "-$" + Math.abs(tran.amount).toFixed(2)
    }</div>
    </div>`;
    containerTransactions.insertAdjacentHTML("afterbegin", html);
  });
  //Add Styling to the populated rows
  [...document.querySelectorAll(".movements__row")].forEach(
    (row, i) => i % 2 === 0 && (row.style.backgroundColor = "#f3f3f3")
  );
};

const displayBalance = function (account) {
  account.balance = account.transactions.reduce(function (bal, cur) {
    return (bal += cur.amount);
  }, 0);
  labelBalance.textContent = `${
    account.balance > 0
      ? "$" + account.balance.toFixed(2)
      : "-$" + Math.abs(account.balance).toFixed(2)
  }`;
};

const displaySummary = function (account) {
  const deposits = account.transactions
    .filter((tr) => tr.amount > 0)
    .reduce((sum, tr) => sum + tr.amount, 0);
  labelSumIn.textContent = `$${deposits.toFixed(2)}`;
  const withdrawals = account.transactions
    .filter((tr) => tr.amount < 0)
    .reduce((sum, tr) => sum + tr.amount, 0);
  labelSumOut.textContent = `$${Math.abs(withdrawals).toFixed(2)}`;
  const interest = account.transactions
    .filter((tr) => tr.amount > 0)
    .map((tr) => (tr.amount * account.interestRate) / 100)
    .filter((int) => int > 1)
    .reduce((sum, int) => sum + int, 0);
  labelSumInterest.textContent = `$${interest.toFixed(2)}`;
};

const updateUI = function (account) {
  //1. Display Transactions
  displayTransactions(account.transactions);
  //2. Display Balance
  displayBalance(account);
  //3. Display Summary
  displaySummary(account);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts);

//Add Event Handelers

let currentUser = {};
let sorted = false;

btnLogin.addEventListener("click", function (event) {
  //to prevent submitting form
  event.preventDefault();
  //1. Finding current User
  currentUser = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  //2. Logs the current User
  if (currentUser?.pin === Number(inputLoginPin.value)) {
    console.log("LOGGED IN");
    //3. Display UI and Welcome Message
    containerApp.style.opacity = 1;
    labelWelcome.textContent = `Welcome Back ${
      currentUser.owner.split(" ")[0]
    }`;
    //3.1. Clear Fields and focus
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    //4. UpdateUI
    updateUI(currentUser);
  } else {
    alert(`Wrong Username Or PIN`);
  }
});

btnTransfer.addEventListener("click", function (event) {
  //to prevent from submitting form
  event.preventDefault();

  //get user input
  const amount = Number(inputTransferAmount.value);
  const recAcc = accounts.find((acc) => acc.username === inputTransferTo.value);

  //clear fields
  inputTransferAmount.value = inputTransferTo.value = "";
  inputTransferAmount.blur();

  //making transfers with checks
  if (
    amount > 0 &&
    recAcc &&
    currentUser?.balance >= amount &&
    currentUser.username !== recAcc.username
  ) {
    currentUser.transactions.push({ type: "withdraw", amount: -amount });
    recAcc.transactions.push({ type: "deposit", amount: amount });
    //update account
    updateUI(currentUser);
  }
});

btnLoan.addEventListener("click", function (event) {
  //to prevent from submitting form
  event.preventDefault();
  console.log();
  //get user input
  const amount = Math.floor(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentUser.transactions.some((tr) => tr.amount > amount * 0.25)
  ) {
    currentUser.transactions.push({ type: "loan", amount: amount });
    console.log(`Loan Successfully Approved`);
  } else {
    alert(`Loan Request Declined`);
  }
  //clear fields
  inputLoanAmount.value = "";
  inputLoanAmount.blur();
  //update UI
  updateUI(currentUser);
});

btnClose.addEventListener("click", function (event) {
  //to prevent from submitting form
  event.preventDefault();
  //checks user and pin
  if (
    currentUser.username === inputCloseUsername.value &&
    currentUser.pin === Number(inputClosePin.value)
  ) {
    const delIndex = accounts.findIndex(
      (acc) => acc.username === currentUser.username
    );
    accounts.splice(delIndex, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Log In to Get Started`;
    console.log(`Account Successfully Closed`);
  }
  //clear fields
  inputCloseUsername.value = inputClosePin.value = "";
  inputClosePin.blur();
});

btnSort.addEventListener("click", function (event) {
  event.preventDefault();
  displayTransactions(currentUser.transactions, !sorted);
  sorted = !sorted;
});
