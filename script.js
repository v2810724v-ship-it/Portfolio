(function () {
  var trigger = document.getElementById("email-trigger");
  if (!trigger) return;

  function close() {
    trigger.classList.remove("is-open");
  }

  trigger.addEventListener("click", function (event) {
    event.stopPropagation();
    trigger.classList.toggle("is-open");
  });

  document.addEventListener("click", close);
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") close();
  });
})();
