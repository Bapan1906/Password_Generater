const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-length]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const upperCaseCheck = document.querySelector("#upperCase");
const lowerCaseCheck = document.querySelector("#lowerCase");
const numbersCheck = document.querySelector("#numbers");
const symbilsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indecator]");
const generateBtn = document.querySelector(".Generate-Button");
const allCheckBox = document.querySelectorAll("input[type = checkbox]");
const symbols = '~,!@#$%^&*()_-+={}[]|:;"<,>.?/';

// Default case.
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

// Set strength circle color to grey by default.
setIndicater("#ccc");

// Set Password Length. --> working of this function is reflect password length in the UI.
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;

  const min = parseInt(inputSlider.min);
  const max = parseInt(inputSlider.max);
  inputSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%"; // CK
}

// Set indicater.
function setIndicater(color) {
  indicator.style.backgroundColor = color;
  // Shadow.
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// Generate Random number.
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// generate random number between 0 to 9
function generateRandomNumber() {
  return getRandomInt(0, 9);
}

// generate random letter between a to z
function generateLowerCase() {
  // String.fromCharCode() -> this is use for convert number to char.
  return String.fromCharCode(getRandomInt(97, 123));
}

// generate random letter between A to Z
function generateUpperCase() {
  return String.fromCharCode(getRandomInt(65, 91));
}

// generate random letter between some provided symbols.
function generateSymbols() {
  const randNum = getRandomInt(0, symbols.length);
  return symbols.charAt(randNum); // charAt -> char at that index.
}

// calculate strength.
function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  if (upperCaseCheck.checked) hasUpper = true;
  if (lowerCaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbilsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicater("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicater("#ff0");
  } else {
    setIndicater("#f00");
  }
}

// copy content.
async function copyContent() {
  try {
    // navigator.clipboard.writeText() -> using this method copy the value from clipboard.
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = " Copied ";
  } catch (e) {
    copyMsg.innerText = " Failed ";
  }
  //   to make copied messege visible.
  copyMsg.classList.add("active");

  //   remove copied function after 2 sec.
  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

// shuffle the password.
function shufflePassword(Array) {
  // Fisher Yates Method.
  for (let i = Array.length - 1; i > 0; i--) {
    // Random J. find out using random function.
    const j = Math.floor(Math.random() * (i + 1));
    // Swap number at i index and j index.
    const temp = Array[i];
    Array[i] = Array[j];
    Array[j] = temp;
  }

  // After shuffle all element are store in a string and return the string.
  let str = "";
  Array.forEach((el) => (str += el));
  return str;
}

//  Add enevt Listner.

// Add event listener on slider.
inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

// Add event Listner on copy button.
copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyContent();
  }
});

// handle check box handle. --> check how many check boxed are ticked or unticked.
function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  // Special Condition.
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

// This function is working for -> generate password button.
generateBtn.addEventListener("click", () => {
  // none of the checkbox are selected.
  handleCheckBoxChange(); // Ensure checkCount is updated before generating the password
  if (checkCount <= 0) {
    return;
  }

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  // let's start the journey to find the new password.
  //   console.log("Starting the Journey");
  // remove old password.
  password = "";

  // Let's put the stuff mentained by checkboxes.

  //   if (upperCaseCheck.checked) {
  //     password += generateUpperCase();
  //   }

  //   if (lowerCaseCheck.checked) {
  //     password += generateLowerCase();
  //   }

  //   if (numbersCheck.checked) {
  //     password += generateRandomNumber();
  //   }

  //   if (symbilsCheck.checked) {
  //     password += generateSymbols();
  //   }

  //    create an array and store all function.
  let funcArr = [];
  if (upperCaseCheck.checked) {
    funcArr.push(generateUpperCase);
  }

  if (lowerCaseCheck.checked) {
    funcArr.push(generateLowerCase);
  }

  if (numbersCheck.checked) {
    funcArr.push(generateRandomNumber);
  }

  if (symbilsCheck.checked) {
    funcArr.push(generateSymbols);
  }

  // Compulsory addition.
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }
  //   console.log("Compulsory Addition Done");

  // Remaining addition.
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRandomInt(0, funcArr.length);
    password += funcArr[randIndex]();
  }
  //   console.log("Remaining Addition done");

  // shuffle the password. --> passing the value in array formate.
  password = shufflePassword(Array.from(password));

  //   console.log("Shuffleing Done");

  // Show in UI
  passwordDisplay.value = password;

  //   console.log("Display Password Done");

  // Calculate strength --> calling the function.
  calcStrength();

  //   console.log("Calculate Strength Done");
});
