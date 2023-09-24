document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("myForm");
  const ok = document.getElementById("ok");
  const btn = document.getElementById("btn");

  btn.addEventListener("click", async function () {
    const a = await chrome.storage.local.get(["savedKey"]);
    if (a.savedKey === undefined) {
      ok.innerText = "Please save your key first!";
      ok.className = "text-green-500 font-bold";
      setTimeout(() => {
        ok.remove();
      }, 2000);
      return;
    }
    chrome.runtime.sendMessage({ msg: "start" });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var keyInput = document.getElementById("keyInput");
    var key = keyInput.value.trim();

    if (key !== "") {
      chrome.storage.local.set({ savedKey: key }, function () {
        console.log("Key saved:", key);

        ok.innerText = "Key saved!";

        form.reset();
      });
    }
  });

  if (
    chrome.storage.local.get(["savedKey"], function (result) {
      if (result.savedKey !== undefined) {
        form.style.display = "none";
        ok.innerText = "Key saved!";
        ok.className = "text-green-500 font-bold";
      }
    })
  );
});
