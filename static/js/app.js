(() => {
  const expEl = document.getElementById('expression');
  const resEl = document.getElementById('result');
  const buttons = Array.from(document.querySelectorAll('.btn'));
  const historyBtn = document.getElementById('historyBtn');
  const historyPane = document.getElementById('history');
  const historyList = document.getElementById('historyList');
  const clearHistoryBtn = document.getElementById('clearHistory');
  const themeBtn = document.getElementById('themeBtn');

  let expression = "";
  let history = [];

  
  const savedTheme = localStorage.getItem("calc-theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  themeBtn.textContent = savedTheme === "light" ? "☀️" : "🌙";

  
  themeBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("calc-theme", next);

    themeBtn.textContent = next === "light" ? "☀️" : "🌙";
  });

 
  function refreshScreen() {
    expEl.textContent = expression;
    try {
      const safe = expression.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-');
      if (!safe.trim()) return resEl.textContent = "0";
      const val = eval(safe);
      resEl.textContent = val ?? "0";
    } catch {
      resEl.textContent = "Err";
    }
  }

 
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const v = btn.dataset.val;
      if (!v) return;

      if (v === "CE") {
        expression = "";
        return refreshScreen();
      }

      if (v === "back") {
        expression = expression.slice(0, -1);
        return refreshScreen();
      }

      if (v === "=") {
        try {
          const safe = expression.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-');
          const val = eval(safe);
          history.unshift({expr: expression, result: val});
          expression = String(val);
          refreshScreen();
          renderHistory();
        } catch {
          resEl.textContent = "Err";
        }
        return;
      }

      expression += v;
      refreshScreen();
    });
  });

 
  function renderHistory() {
    historyList.innerHTML = "";
    history.forEach(h => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${h.expr}</strong><small>= ${h.result}</small>`;
      li.addEventListener("click", () => {
        expression = h.expr;
        refreshScreen();
        historyPane.classList.add("hidden");
      });
      historyList.appendChild(li);
    });
  }

  historyBtn.addEventListener("click", () => {
    historyPane.classList.toggle("hidden");
  });

  clearHistoryBtn.addEventListener("click", () => {
    history = [];
    renderHistory();
  });

  refreshScreen();
})();
