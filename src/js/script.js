const liftForm = document.querySelector("#lift-form");
liftForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const numFloors = parseInt(document.getElementById("floor").value, 10);
  const numLifts = parseInt(document.getElementById("lift").value, 10);
  const building = document.getElementById("building");
  liftForm.style.display = "none";

  for (let i = numFloors; i > 0; i--) {
    const floorContainer = document.createElement("div");
    floorContainer.className = "floorContainer";

    const btnContainer = document.createElement("div");
    btnContainer.id = "btnContainer";
    btnContainer.innerHTML = `<p>Floor - ${i}</p>`;
    if (i < numFloors) {
      btnContainer.innerHTML += '<button type="button" class="up">Up</button>';
    }
    if (i > 1) {
      btnContainer.innerHTML +=
        '<button type="button" class="down">Down</button>';
    }

    const liftContainer = document.createElement("div");
    liftContainer.id = "liftContainer";

    floorContainer.appendChild(btnContainer);
    if (i === 1) {
      for (let j = 0; j < numLifts; j++) {
        const liftContainer = document.createElement("div");
        liftContainer.className = "liftContainer";
        floorContainer.appendChild(liftContainer);
      }
    }
    building.appendChild(floorContainer);
  }
});
