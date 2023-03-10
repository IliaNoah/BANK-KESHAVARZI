"use strict";

// ACCOUNTS DATA
const account1 = {
  owner: "Ilia Ahadi",
  name: "ایلیا احدی",
  movements: [4000000, 450000, -2000000, 3000, 6500000, -1300000, 70000, 13000],
  interestRate: 1.2,
  pin: 1111,
};

const account2 = {
  owner: "Ali Mohammadi",
  name: "علی محمدی",
  movements: [500000, 340000, -15000, -79000, -321000, -100000, 850000, -3000],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Mohammad Hosein Karimi",
  name: "محمد حسین کریمی",
  movements: [100000, -20000, 3400, -30000, -200, 500, 40000, -4600],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sara Hoseini",
  name: "سارا حسینی",
  movements: [43000, 10000000, 7000000, 5000, 9000],
  interestRate: 1,
  pin: 4444,
};
const accounts = [account1, account2, account3, account4];

// ELEMENTS
const labelWelcome = document.querySelector(".welcome");
const labelBalance = document.querySelector(".balance__value");

const containerMovements = document.querySelector(".movements");
const app = document.querySelector(".app");

const summaryIn = document.querySelector(".summary__value--in");
const summaryOut = document.querySelector(".summary__value--out");
const summaryInterest = document.querySelector(".summary__value--interest");

const inputLogin = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const btnLogin = document.querySelector(".login__btn");

const inputTransfer = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const btnTransfer = document.querySelector(".form__btn--transfer");

const inputLoan = document.querySelector(".form__input--loan");
const btnLoan = document.querySelector(".form__btn--loan");

const inputDelete = document.querySelector(".form__input--user");
const inputDeletePin = document.querySelector(".form__input--pin");
const btnDelete = document.querySelector(".form__btn--close");

const btnSort = document.querySelector(".btn--sort");

// FUNCTIONS

// MOVEMENTS
function displayMovements(movements, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? "واریز" : "برداشت";
    const typeClass = mov > 0 ? "deposit" : "withdrawal";

    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${typeClass}">${type} ${
      i + 1
    }</div>
        <div class="movements__value">${mov} تومان</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}

// BALANCE CALCULATION
function displayBalance(acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} تومان`;
}

// DISPLAY SUMMARY
function displaySummary(acc) {
  const sumIn = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  summaryIn.textContent = `${sumIn} تومان`;

  const sumOut = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  summaryOut.textContent = `${sumOut} تومان`;

  const sumInterest = acc.movements
    .filter((mov) => mov > 0)
    .map((depo) => (depo * acc.interestRate) / 100)
    .reduce((acc, mov) => acc + mov, 0);
  summaryInterest.textContent = `${sumInterest} تومان`;
}

// USERNAME CREATION
function usernameCreation(accs) {
  accs.forEach(
    (acc) =>
      (acc.username = acc.owner
        .toLowerCase()
        .split(" ")
        .map((name) => name[0])
        .join(""))
  );
}
usernameCreation(accounts);

function updateUI(acc) {
  // DISPALY ACCOUNT BALANCE
  displayBalance(acc);
  // DISPLAY MOVEMENTS
  displayMovements(acc.movements);
  // DISPLAY ACCOUNT SUMMARY
  displaySummary(acc);
}

// EVENT HANDLERS

// LOGIN
let currentAcc;
btnLogin.addEventListener("click", (e) => {
  e.preventDefault();

  currentAcc = accounts.find((acc) => acc.username === inputLogin.value);

  if (currentAcc?.pin === +inputLoginPin.value) {
    // WELCOME MESSAGE
    labelWelcome.textContent = `${currentAcc.name.split(" ")[0]} خوش آمدید`;

    // CLEAR INPUT FIELDS
    inputLogin.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // DISPLAY APP
    app.style.visibility = "visible";
    app.style.opacity = 1;

    // UPDATE UI
    updateUI(currentAcc);
  }
});

// TRANSFER
btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();

  const transferTo = accounts.find(
    (acc) => acc.username === inputTransfer.value
  );
  const transferAmount = +inputTransferAmount.value;

  if (
    currentAcc.balance >= transferAmount &&
    transferAmount > 0 &&
    transferTo &&
    transferTo?.username !== currentAcc.username
  ) {
    // DOING TRANSFER
    currentAcc.movements.push(-transferAmount);
    transferTo.movements.push(transferAmount);

    // UPDATE UI
    updateUI(currentAcc);

    // CLEAR FIELDS
    inputTransfer.value = inputTransferAmount.value = "";
  }
});

// REQUEST LOAN
btnLoan.addEventListener("click", (e) => {
  e.preventDefault();

  const amountLoan = +inputLoan.value;

  if (
    amountLoan > 0 &&
    currentAcc.movements.some((mov) => mov >= amountLoan * 0.1)
  ) {
    // ADD LOAN
    currentAcc.movements.push(amountLoan);

    // UPDATE UI
    updateUI(currentAcc);

    // CLEAR FIELDS
    inputLoan.value = "";
  }
});

// DELETE ACCOUNT
btnDelete.addEventListener("click", (e) => {
  e.preventDefault();

  if (
    inputDelete.value === currentAcc.username &&
    +inputDeletePin.value === currentAcc.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAcc.username
    );

    // DELETE ACCOUNT
    accounts.splice(index, 1);

    // HIDE UI
    app.style.visibility = "hidden";
    app.style.opacity = 0;
  }

  inputDelete.value = inputDeletePin.value = "";
});

// SORTING MOVEMENTS
let sorted = false;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();

  displayMovements(currentAcc.movements, !sorted);
  sorted = !sorted;
  if (sorted === true) btnSort.innerHTML = "&#8645; مرتب سازی";
  else if (sorted === false) btnSort.innerHTML = "&downarrow; مرتب سازی";
});
