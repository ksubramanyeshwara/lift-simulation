const submit = document.querySelector("#submit");

submit.addEventListener("click", function (event) {
  event.preventDefault();

  const numFloors = parseInt(document.getElementById("floor").value, 10);
  const numLifts = parseInt(document.getElementById("lift").value, 10);
  // Store floor and lift values in localStorage
  localStorage.setItem("numFloors", numFloors);
  localStorage.setItem("numLifts", numLifts);
  // redirect to the new page
  window.location.href = "liftSimulation.html";
});
