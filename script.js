"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Hassaan Ahmed Zuberi",
  transactions: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Muhammad Omar Chohan",
  transactions: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Saifullah Khan Chughtai",
  transactions: [200, -200, 340, -300, -20, 50, 4000, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Hasan Baig",
  transactions: [430, 1000, 700, 50, 90],
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

const displayTransactions = function (transactions) {
  containerTransactions.innerHTML = "";
  let d = 1;
  let w = 1;
  transactions.forEach((trans, i) => {
    const type = trans > 0 ? "deposit" : "withdrawal";
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      (type === "deposit" && d++) || w++
    } ${type}t</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${trans}$</div>
    </div>`;
    containerTransactions.insertAdjacentHTML("afterbegin", html);
  });
};

const displayBalance = function (account) {
  account.balance = account.transactions.reduce(function (bal, cur) {
    return (bal += cur);
  }, 0);
  labelBalance.textContent = `${account.balance}$`;
};

const displaySummary = function (account) {
  const deposits = account.transactions
    .filter((tr) => tr > 0)
    .reduce((sum, tr) => sum + tr, 0);
  labelSumIn.textContent = `${deposits}$`;
  const withdrawals = account.transactions
    .filter((tr) => tr < 0)
    .reduce((sum, tr) => sum + tr, 0);
  labelSumOut.textContent = `${Math.abs(withdrawals)}$`;
  const interest = account.transactions
    .filter((tr) => tr > 0)
    .map((tr) => (tr * account.interestRate) / 100)
    .filter((int) => int > 1)
    .reduce((sum, int) => sum + int, 0);
  labelSumInterest.textContent = `${interest}$`;
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

const updateUI = function (account) {
  //1. Display Transactions
  displayTransactions(account.transactions);
  //2. Display Balance
  displayBalance(account);
  //3. Display Summary
  displaySummary(account);
};

//Add Event Handelers

let currentUser = {};

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
  }
});

btnTransfer.addEventListener("click", function (event) {
  //to prevent from submitting form
  event.preventDefault();

  //getting user input
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
    currentUser.transactions.push(-amount);
    recAcc.transactions.push(amount);
    console.log(currentUser, recAcc);
    //update account
    updateUI(currentUser);
  }
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
