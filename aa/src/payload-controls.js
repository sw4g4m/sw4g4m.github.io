import { loadPayloadSequence, PAYLOAD_FILES } from "./kexp.js";

const sequence = ["kstuff.elf", "shadowmountplus.elf", "OnionHEN.elf"];
const repeatable = new Set(["PoorDS4.elf", "PoorDS4-status.elf", "PoorDS4-stop.elf"]);

export function installPayloadControls(p, chain, log) {
  const sent = new Set();
  let busy = false;
  const ui = window.fcUI;
  const update = () => ui && ui.update({ ready: true, busy, sent: Array.from(sent) });

  async function run(requested) {
    if (busy) return;
    const names = requested.filter((name) => !sent.has(name) || repeatable.has(name));
    if (!names.length) return;
    if (names.some((name) => !PAYLOAD_FILES.includes(name))) return;
    if ((names.includes("etaHEN.elf") && sent.has("OnionHEN.elf")) ||
        (names.includes("OnionHEN.elf") && sent.has("etaHEN.elf"))) {
      log("Use only one HEN per session; restart the console to switch.", "error");
      return;
    }
    busy = true;
    update();
    try {
      await loadPayloadSequence(names, p, chain, (message) => log(message, "info"), (name) => {
        sent.add(name);
        update();
      });
    } catch (error) {
      log(error instanceof Error ? error.message : String(error), "error");
    } finally {
      busy = false;
      update();
    }
  }

  if (ui) {
    ui.onSequence = () => run(sequence);
    ui.onPayload = (name) => run([name]);
  }
  window.addEventListener("keydown", (event) => {
    if (event.key !== "F8" || event.code !== "Unidentified" || event.repeat) return;
    event.preventDefault();
    run(sequence);
  }, true);
  update();
  log("R2: kstuff → shadowmountplus → onionhen", "info");
}
