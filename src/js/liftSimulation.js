const numFloors = parseInt(localStorage.getItem("numFloors"));
const numLifts = parseInt(localStorage.getItem("numLifts"));

let liftSimulatorContainer = document.querySelector(
  "#lift-simulator-container"
);

let liftArr = [];
let floorArr = [];

function createButton(direction) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = direction;
  button.className = direction.toLowerCase();
  return button;
}

function createInputForm() {
  const form = document.createElement("form");
  form.innerHTML = `
    <input type="number" name="Floor" placeholder="Floor Number" class="floorInput" required />
    <input type="number" name="Lift" placeholder="Lift Number" class="liftInput" required />
  `;
  return form;
}

function createButtonContainer(floorNumber, numFloors) {
  const btnContainer = document.createElement("div");
  btnContainer.id = "btnContainer";
  btnContainer.appendChild(createInputForm());

  if (floorNumber < numFloors) {
    btnContainer.appendChild(createButton("Up"));
  }
  if (floorNumber > 1) {
    btnContainer.appendChild(createButton("Down"));
  }

  return btnContainer;
}

function createLift() {
  const lift = document.createElement("div");
  lift.className = "liftContainer";

  lift.style.transition = "transform 2s ease-in-out";

  const leftDoor = document.createElement("div");
  leftDoor.className = "door";
  leftDoor.id = "left-door";

  const rightDoor = document.createElement("div");
  rightDoor.className = "door";
  rightDoor.id = "right-door";

  lift.appendChild(leftDoor);
  lift.appendChild(rightDoor);

  return lift;
}

function createFloor(floorNumber, numFloors, numLifts) {
  const floorContainer = document.createElement("div");
  floorContainer.className = "floorContainer";
  floorContainer.innerHTML = `<p>Floor - ${floorNumber}</p>`;
  floorArr.push(floorContainer);

  floorContainer.appendChild(createButtonContainer(floorNumber, numFloors));

  if (floorNumber === 1) {
    for (let j = 0; j < numLifts; j++) {
      const lift = createLift();
      floorContainer.appendChild(lift);
      liftArr.push(lift);
    }
  }
  return floorContainer;
}

function moveLift(liftArr, floorArr, liftInputValue, floorInputValue) {
  let lift = liftArr[liftInputValue - 1];
  let floor = floorArr[floorInputValue - 1];

  const floorHeight = 12;
  const translation = (floorInputValue - 1) * floorHeight;
  translation.className = "translation";

  // open doors
  lift.querySelector("#left-door").style.transform = "translateX(-50%)";
  lift.querySelector("#right-door").style.transform = "translateX(50%)";

  setTimeout(() => {
    // close doors
    lift.querySelector("#left-door").style.transform = "translateX(0)";
    lift.querySelector("#right-door").style.transform = "translateX(0)";

    setTimeout(() => {
      // move the lift
      lift.style.transform = `translateY(-${translation}rem)`;
      setTimeout(() => {
        lift.querySelector("#left-door").style.transform = "translateX(-50%)";
        lift.querySelector("#right-door").style.transform = "translateX(50%)";

        // 5. Wait for 1 second, then close doors
        setTimeout(() => {
          lift.querySelector("#left-door").style.transform = "translateX(0)";
          lift.querySelector("#right-door").style.transform = "translateX(0)";
        }, 2500);
      }, 2500);
    }, 2500); // Close doors after 2.5 seconds
  }, 2500);
}

function handleButtonClick(event) {
  if (
    event.target.classList.contains("up") ||
    event.target.classList.contains("down")
  ) {
    const btnContainer = event.target.closest("#btnContainer");
    const liftInput = btnContainer.querySelector(".liftInput");
    const floorInput = btnContainer.querySelector(".floorInput");

    const liftInputValue = parseInt(liftInput.value);
    const floorInputValue = parseInt(floorInput.value);

    // Check if both inputs have values
    if (!floorInputValue || !liftInputValue) {
      alert("Please enter values for both Floor and Lift.");
      return; // Stop further execution
    }
    moveLift(liftArr, floorArr, liftInputValue, floorInputValue);
    console.log(`Floor: ${floorInputValue}, Lift: ${liftInputValue}`);

    // Clear the input fields
    floorInput.value = "";
    liftInput.value = "";
  }
}

function initializeLiftSimulator() {
  for (let i = numFloors; i > 0; i--) {
    liftSimulatorContainer.appendChild(createFloor(i, numFloors, numLifts));
  }
  document.addEventListener("click", handleButtonClick);
}

initializeLiftSimulator();
