'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (movement, i) {
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const html = `
          <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__value">${movement}€</div>
        </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);

  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${incomes}€`;

  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => {
      if (cur / 100 >= 1) {
        return acc + (cur * account.interestRate) / 100;
      } else {
        return acc;
      }
    }, 0);

  labelSumInterest.textContent = `${interest}€`;
};

const createUserNames = accounts => {
  accounts.forEach(
    acc =>
      (acc.username = acc.owner
        .toLowerCase()
        .split(' ')
        .map(word => word[0])
        .join('')),
  );
};

createUserNames(accounts);

const updateUI = function (acc) {
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

// EventHandler
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value,
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = '1';

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginUsername.blur();
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value,
  );

  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferTo.blur();
  inputTransferAmount.blur();

  if (
    amount > 0 &&
    receiverAcc &&
    amount <= currentAccount.balance &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    currentAccount?.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username,
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = '0';
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function () {
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// 1
const totalDeposit = accounts.reduce((acc, cur) => {
  return (
    acc + cur.movements.reduce((acc, cur) => (cur >= 1000 ? ++acc : acc), 0)
  );
}, 0);

// console.log(totalDeposit);

// 2
const deposits1000 = accounts.flatMap(acc => acc.movements);

// console.log(deposits1000.filter(item => item > 1000).length);

// 3

const accountsAll = accounts.flatMap(acc => acc.movements);

const { wir, dep } = accountsAll.reduce(
  (acc, mov) => {
    mov > 0 ? (acc.dep += mov) : (acc.wir += mov);
    return acc;
  },
  { dep: 0, wir: 0 },
);

// console.log(dep, wir);

// 4
const convertString = function (str) {
  const expections = ['a', 'an'];

  const newStr = str
    .toLowerCase()
    .split(' ')
    .map(word => {
      if (!expections.includes(word)) {
        return word[0].toUpperCase() + word.slice(1);
      } else {
        return word;
      }
    })
    .join(' ');

  return newStr[0].toUpperCase() + newStr.slice(1);
};

// console.log(convertString('this is a nice title'));

// Challenge 4
const dogs = [
  {
    weight: 22,
    curFood: 250,
    owner: ['Alice', 'Bob'],
  },
  {
    weight: 8,
    curFood: 200,
    owner: ['Matilda'],
  },
  {
    weight: 13,
    curFood: 275,
    owner: ['Sarah', 'John'],
  },
  {
    weight: 32,
    curFood: 350,
    owner: ['Michael'],
  },
];

// 1
dogs.forEach(
  dog => (dog['recommendedFood'] = Math.trunc(dog.weight ** 0.75 * 28)),
);

console.log(dogs);

// 2
const sarahDog = dogs.find(dog => dog.owner.includes('Sarah'));

const rangeBig = dog => {
  return dog.recommendedFood * 1.1;
};

const rangeSmall = dog => {
  return dog.recommendedFood * 0.9;
};

if (sarahDog.curFood > rangeBig(sarahDog)) {
  console.log('Big');
} else if (sarahDog.curFood < rangeSmall(sarahDog)) {
  console.log('Small');
}

// 3
const ownerEatTooMuch = dogs
  .filter(cur => cur.curFood > rangeBig(cur))
  .flatMap(dog => dog.owner);

const ownerEatTooLittle = dogs
  .filter(cur => cur.curFood < rangeSmall(cur))
  .flatMap(dog => dog.owner);

console.log(ownerEatTooMuch);
console.log(ownerEatTooLittle);

// 4
const consoleBigOrSmall = function (arr, isBig) {
  console.log(`${arr.join(' and ')} dogs eat too ${isBig ? 'much' : 'little'}`);
};

consoleBigOrSmall(ownerEatTooMuch, true);
consoleBigOrSmall(ownerEatTooLittle);

// 5
const dogEx = dogs.some(cur => cur.curFood === cur.recommendedFood);

console.log(dogEx);

// 6
const cond = cur =>
  cur.curFood > rangeSmall(cur) && cur.curFood < rangeBig(cur);

const dogRec = dogs.some(cur => cond(cur));

console.log(dogRec);

// 7
const correctFood = dogs.filter(cond);

console.log(correctFood);

// 8
const sortArr = dogs
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood);

console.log(sortArr);
