(function () {
  "use strict";
  var office = window.FIGHT_CLUB || {};
  document.getElementById("office-name").textContent = office.name || "Fight Club PS Store";
  var phone = document.getElementById("office-phone");
  phone.textContent = office.phone || "";
  var address = document.getElementById("office-address");
  address.textContent = office.address || "";
  address.hidden = !office.address;
  var status = document.getElementById("status");
  var detail = document.getElementById("status-detail");
  var group = document.getElementById("run-sequence");
  var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-payload]"));
  var state = { ready: false, busy: false, sent: [] };
  var repeatable = ["PoorDS4.elf", "PoorDS4-status.elf", "PoorDS4-stop.elf"];
  var sequence = ["kstuff.elf", "shadowmountplus.elf", "OnionHEN.elf"];
  function render() {
    var complete = sequence.every(function (name) { return state.sent.indexOf(name) !== -1; });
    group.disabled = !state.ready || state.busy || complete;
    group.textContent = "اضغط لتشغيل الالعاب";
    buttons.forEach(function (button) {
      var name = button.getAttribute("data-payload");
      var done = state.sent.indexOf(name) !== -1;
      button.disabled = !state.ready || state.busy || (done && repeatable.indexOf(name) === -1);
      button.querySelector(".payload-state").textContent = done ? "تم الإرسال" : "يدوي";
    });
    sequence.forEach(function (name, index) {
      document.getElementById("step-" + index).textContent = state.sent.indexOf(name) !== -1 ? "تم الإرسال" : "بانتظار R2";
    });
    if (state.ready) {
      status.textContent = state.busy ? "جارٍ إرسال البايلود" : "المحمّل جاهز";
      detail.textContent = state.busy ? "انتظر انتهاء الإرسال قبل اختيار أمر آخر." : "اختر مجموعة R2 أو أحد البايلودات اليدوية.";
    }
  }
  window.fcUI = {
    onSequence: null,
    onPayload: null,
    update: function (value) { state = value; render(); },
    showError: function (message) {
      document.getElementById("error").hidden = false;
      document.getElementById("error").textContent = String(message);
      if (!state.ready) { status.textContent = "لم يكتمل التشغيل"; detail.textContent = "راجع سجل التشغيل أدناه."; }
    }
  };
  function clearError() { document.getElementById("error").hidden = true; }
  group.addEventListener("click", function () {
    if (group.disabled || !window.fcUI.onSequence) return;
    clearError();
    window.fcUI.onSequence();
  });
  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      if (button.disabled || !window.fcUI.onPayload) return;
      clearError();
      window.fcUI.onPayload(button.getAttribute("data-payload"));
    });
  });
  render();
})();
