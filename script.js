const storageKey = "task-flow-lite-tasks";
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const activeCount = document.getElementById("activeCount");
const doneCount = document.getElementById("doneCount");
const clearDone = document.getElementById("clearDone");
const filters = Array.from(document.querySelectorAll(".filter"));
const addButton = taskForm.querySelector("button");

let tasks = loadTasks();
let currentFilter = "all";

function makeTaskId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return `task-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(storageKey, JSON.stringify(tasks));
}

function visibleTasks() {
  if (currentFilter === "active") return tasks.filter((task) => !task.completed);
  if (currentFilter === "completed") return tasks.filter((task) => task.completed);
  return tasks;
}

function render() {
  const active = tasks.filter((task) => !task.completed).length;
  const completed = tasks.length - active;
  activeCount.textContent = String(active);
  doneCount.textContent = String(completed);

  const list = visibleTasks();
  taskList.innerHTML = "";
  emptyState.hidden = list.length > 0;

  list.forEach((task) => {
    const row = document.createElement("article");
    row.className = `task${task.completed ? " completed" : ""}`;

    const check = document.createElement("button");
    check.className = "check";
    check.type = "button";
    check.setAttribute("aria-label", task.completed ? "Mark task active" : "Complete task");
    check.addEventListener("click", () => toggleTask(task.id));

    const title = document.createElement("p");
    title.className = "task-title";
    title.textContent = task.title;

    const remove = document.createElement("button");
    remove.className = "delete";
    remove.type = "button";
    remove.textContent = "Delete";
    remove.addEventListener("click", () => deleteTask(task.id));

    row.append(check, title, remove);
    taskList.append(row);
  });
}

function addTask(title) {
  tasks.unshift({
    id: makeTaskId(),
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  });
  saveTasks();
  render();
}

function toggleTask(id) {
  tasks = tasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task);
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  render();
}

function handleAddTask(event) {
  event.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;
  addTask(title);
  taskInput.value = "";
  taskInput.focus();
}

taskForm.addEventListener("submit", handleAddTask);
addButton.addEventListener("click", handleAddTask);

filters.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filters.forEach((item) => item.classList.toggle("active", item === button));
    render();
  });
});

clearDone.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  render();
});

render();
