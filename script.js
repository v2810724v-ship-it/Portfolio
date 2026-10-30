(function () {
  var trigger = document.getElementById("email-trigger");
  var tip = document.getElementById("email-tip");
  var status = document.getElementById("copy-status");
  if (!trigger || !tip) return;

  var address = tip.textContent.trim();
  var resetTimer;

  function legacyCopy(text) {
    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.top = "-9999px";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();

      try {
        var ok = document.execCommand("copy");
        ok ? resolve() : reject(new Error("copy failed"));
      } catch (error) {
        reject(error);
      } finally {
        document.body.removeChild(area);
      }
    });
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () {
        return legacyCopy(text);
      });
    }
    return legacyCopy(text);
  }

  function showTip(message) {
    tip.textContent = message;
    trigger.classList.add("is-open");
  }

  function reset() {
    tip.textContent = address;
    trigger.classList.remove("is-open");
  }

  trigger.addEventListener("click", function (event) {
    event.stopPropagation();
    clearTimeout(resetTimer);

    copyText(address)
      .then(function () {
        showTip("복사되었습니다 ✓");
        if (status) status.textContent = "메일 주소가 클립보드에 복사되었습니다.";
      })
      .catch(function () {
        // 복사가 막힌 환경에서는 주소를 그대로 보여줍니다.
        showTip(address);
        if (status) status.textContent = "복사에 실패했습니다. 주소를 직접 확인해 주세요.";
      })
      .then(function () {
        resetTimer = setTimeout(reset, 1800);
      });
  });

  document.addEventListener("click", function () {
    trigger.classList.remove("is-open");
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      clearTimeout(resetTimer);
      reset();
    }
  });
})();
