const numFloors = parseInt(localStorage.getItem("numFloors"));
const numLifts = parseInt(localStorage.getItem("numLifts"));

let liftSimulatorContainer = document.querySelector(
  "#lift-simulator-container"
);

let lifts = [];
let liftQueue = []; // Queue to store lift requests

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
  lift.querySelector("#left-door").style.transform = "translateX(-100%)";
  lift.querySelector("#right-door").style.transform = "translateX(100%)";
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

    // Lift move duration
    const liftMoveDuration =
      3 * Math.abs(floorNumber - availableLift.currentFloor);

    // Set the transition duration for the lift movement
    lift.style.transition = `transform ${liftMoveDuration}s ease-in-out`;

    // Move the lift
    lift.style.transform = `translateY(-${translation}rem)`;

    setTimeout(() => {
      // Update lift's current floor
      availableLift.currentFloor = floorNumber;

      // Open doors only if the lift is on the same floor as the button clicked
      if (availableLift.currentFloor === floorNumber) {
        openDoors(lift);
        setTimeout(() => {
          closeDoors(lift);
          setTimeout(() => {
            // Reset the lift state after the doors close
            availableLift.isMoving = false;
            // Enable the clicked button
            button.disabled = false;
            // Process the next request in the queue
            processQueue();
          }, 2500);
        }, 2500);
      } else {
        // Reset the lift state if the lift is not on the same floor
        availableLift.isMoving = false;
        // Enable the clicked button
        button.disabled = false;
        // Process the next request in the queue
        processQueue();
      }
    }, liftMoveDuration * 1000);
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
    const direction = event.target.classList.contains("up") ? "up" : "down";
    // Disable the button immediately when clicked
    event.target.disabled = true;
    // Add the request to the queue
    liftQueue.push({ floorNumber, direction, button: event.target });
    // Process the queue
    processQueue();
  }
}

function processQueue() {
  if (liftQueue.length === 0) {
    return;
  }

  liftQueue.forEach((request, index) => {
    const { floorNumber, direction, button } = request;
    const availableLift = findNearestAvailableLift(floorNumber);
    if (availableLift) {
      liftQueue.splice(index, 1); // Remove the request from the queue
      moveLift(floorNumber, button);
    }
  });
}

function createBackButton() {
  const backButton = document.createElement("button");
  backButton.type = "button";
  backButton.textContent = "Modify the Floor and Lift";
  backButton.className = "backButton";
  backButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });
  return backButton;
}

function initializeLiftSimulator() {
  const backButton = createBackButton();
  liftSimulatorContainer.appendChild(backButton);

  for (let floorNumber = numFloors; floorNumber > 0; floorNumber--) {
    liftSimulatorContainer.appendChild(
      createFloor(floorNumber, numFloors, numLifts)
    );
  }
  document.addEventListener("click", handleButtonClick);
}

initializeLiftSimulator();
