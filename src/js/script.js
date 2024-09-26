const submit = document.querySelector("#submit");

submit.addEventListener("click", function (event) {
  event.preventDefault();

  const floorInput = document.getElementById("floor").value;
  const liftInput = document.getElementById("lift").value;

  const numFloors = parseInt(floorInput, 10);
  const numLifts = parseInt(liftInput, 10);

  // Validation for whole numbers and minimum values
  if (
    isNaN(numFloors) ||
    isNaN(numLifts) ||
    numFloors < 2 ||
    numLifts < 1 ||
    !Number.isInteger(numFloors) ||
    !Number.isInteger(numLifts) ||
    floorInput.includes(".") ||
    liftInput.includes(".")
  ) {
    alert(
      "Please enter valid whole numbers. There should be at least 2 floors and 1 lift."
    );
    return;
  }

  // Store floor and lift values in localStorage
  localStorage.setItem("numFloors", numFloors);
  localStorage.setItem("numLifts", numLifts);

  // Redirect to the new page
  window.location.href = "liftSimulation.html";
});
