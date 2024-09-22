const numFloors = Number.parseInt(localStorage.getItem("numFloors"));
const numLifts = Number.parseInt(localStorage.getItem("numLifts"));

let liftSimulatorContainer = document.querySelector(
  "#lift-simulator-container"
);

let lifts = [];

function createButton(direction, floorNumber) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = direction;
  button.className = direction.toLowerCase();
  button.setAttribute("data-floor", floorNumber);
  return button;
}

function createButtonContainer(floorNumber, numFloors) {
  const btnContainer = document.createElement("div");
  btnContainer.id = "btnContainer";

  if (floorNumber < numFloors) {
    btnContainer.appendChild(createButton("Up", floorNumber));
  }
  if (floorNumber > 1) {
    btnContainer.appendChild(createButton("Down", floorNumber));
  }

  return btnContainer;
}

function createLift(id) {
  const lift = document.createElement("div");
  lift.className = "liftContainer";
  lift.id = `lift-${id}`;
  lift.style.transition = "transform 2s ease-in-out";

  const leftDoor = document.createElement("div");
  leftDoor.className = "door";
  leftDoor.id = "left-door";

  const rightDoor = document.createElement("div");
  rightDoor.className = "door";
  rightDoor.id = "right-door";

  lift.appendChild(leftDoor);
  lift.appendChild(rightDoor);

  // Create lift object
  const liftObject = {
    id: id,
    element: lift,
    currentFloor: 1,
    isMoving: false,
    direction: null,
  };

  lifts.push(liftObject);

  return lift;
}

function createFloor(floorNumber, numFloors, numLifts) {
  const floorContainer = document.createElement("div");
  floorContainer.className = "floorContainer";
  floorContainer.innerHTML = `<p>Floor - ${floorNumber}</p>`;
  floorContainer.appendChild(createButtonContainer(floorNumber, numFloors));

  if (floorNumber === 1) {
    for (let j = 0; j < numLifts; j++) {
      const lift = createLift(j + 1);
      floorContainer.appendChild(lift);
    }
  }
  return floorContainer;
}

function openDoors(lift) {
  lift.querySelector("#left-door").style.transform = "translateX(-50%)";
  lift.querySelector("#right-door").style.transform = "translateX(50%)";
}

function closeDoors(lift) {
  lift.querySelector("#left-door").style.transform = "translateX(0)";
  lift.querySelector("#right-door").style.transform = "translateX(0)";
}

function moveLift(floorNumber, button) {
  // Find the nearest available lift
  const availableLift = findNearestAvailableLift(floorNumber);

  if (availableLift) {
    const lift = availableLift.element;
    const floorHeight = 12;
    const translation = (floorNumber - 1) * floorHeight;

    availableLift.isMoving = true;
    availableLift.direction =
      floorNumber > availableLift.currentFloor ? "up" : "down";

    // Disable the clicked button
    button.disabled = true;

    // open doors
    openDoors(lift);

    setTimeout(() => {
      // close doors
      closeDoors(lift);

      setTimeout(() => {
        // move the lift
        lift.style.transform = `translateY(-${translation}rem)`;
        setTimeout(() => {
          openDoors(lift);
          setTimeout(() => {
            closeDoors(lift);
            // Reset the lift state after the doors close
            availableLift.isMoving = false;
            availableLift.currentFloor = floorNumber;
            // Enable the clicked button
            button.disabled = false;
          }, 2500);
        }, 2500);
      }, 2500);
    }, 2500);
  }
}

function findNearestAvailableLift(floorNumber) {
  return lifts.reduce((nearest, lift) => {
    // If the lift is moving, skip it
    if (lift.isMoving) return nearest;

    // Calculate the distance between the lift's current floor and the requested floor
    const distance = Math.abs(lift.currentFloor - floorNumber);

    // If 'nearest' is null (first iteration) or the current lift is closer than the nearest lift found so far
    if (!nearest || distance < Math.abs(nearest.currentFloor - floorNumber)) {
      return lift; // Update 'nearest' to the current lift
    }
    return nearest; // Keep the current nearest lift
  }, null); // Initial value of 'nearest' is null
}

function handleButtonClick(event) {
  if (
    event.target.classList.contains("up") ||
    event.target.classList.contains("down")
  ) {
    const floorNumber = parseInt(event.target.getAttribute("data-floor"));
    moveLift(floorNumber, event.target);
  }
}

function initializeLiftSimulator() {
  for (let floorNumber = numFloors; floorNumber > 0; floorNumber--) {
    liftSimulatorContainer.appendChild(
      createFloor(floorNumber, numFloors, numLifts)
    );
  }
  document.addEventListener("click", handleButtonClick);
}

initializeLiftSimulator();
