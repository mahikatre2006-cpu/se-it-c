const API = "http://localhost:8080/api/todos";
const form = document.querySelector("#todo-form");
const taskInput = document.querySelector("#task");
const list = document.querySelector("#todo-list");
const count = document.querySelector("#count");
const message = document.querySelector("#message");

function showMessage(text) { message.textContent = text; }

async function request(url, options = {}) {
  const response = await fetch(url, { headers: { "Content-Type": "application/json" }, ...options });
  if (!response.ok) throw new Error("Request failed");
  return response.status === 204 ? null : response.json();
}

function render(todos) {
  list.innerHTML = "";
  count.textContent = `${todos.length} TASK${todos.length === 1 ? "" : "S"}`;
  if (!todos.length) list.innerHTML = '<li class="empty">NO TASKS YET. NICE.</li>';
  todos.forEach(todo => {
    const item = document.createElement("li");
    item.className = `todo ${todo.completed ? "completed" : ""}`;
    item.innerHTML = `<input type="checkbox" ${todo.completed ? "checked" : ""} aria-label="Complete ${todo.task}"><span class="task"></span><button class="delete" aria-label="Delete ${todo.task}">X</button>`;
    item.querySelector(".task").textContent = todo.task;
    item.querySelector("input").addEventListener("change", () => update(todo, !todo.completed));
    item.querySelector(".delete").addEventListener("click", () => remove(todo.id));
    list.append(item);
  });
}

async function loadTodos() {
  try { render(await request(API)); showMessage(""); }
  catch { showMessage("CAN'T REACH THE API. START SPRING BOOT FIRST."); }
}
async function update(todo, completed) {
  try { await request(`${API}/${todo.id}`, { method: "PUT", body: JSON.stringify({ ...todo, completed }) }); loadTodos(); }
  catch { showMessage("COULDN'T UPDATE THAT TASK."); }
}
async function remove(id) {
  try { await request(`${API}/${id}`, { method: "DELETE" }); loadTodos(); }
  catch { showMessage("COULDN'T DELETE THAT TASK."); }
}
form.addEventListener("submit", async event => {
  event.preventDefault();
  const task = taskInput.value.trim();
  if (!task) return;
  try { await request(API, { method: "POST", body: JSON.stringify({ task, completed: false }) }); taskInput.value = ""; loadTodos(); }
  catch { showMessage("COULDN'T ADD THAT TASK."); }
});
loadTodos();
