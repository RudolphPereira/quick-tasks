// Requirements

/*
- [ ]  Data first - Done
- [ ]  Can add items - Done
- [ ]  Can delete items - Done
- [ ]  Can `tick` off items - Done

Extras 

- [ ]  Store the data in local storage - Done
- [ ]  Separate the done items and pending items in two different lists - Done

*/

// Selectors
const todoForm = document.querySelector(".todo__form"),
  todoInput = document.querySelector(".form__input"),
  todoSubmit = document.querySelector(".form__btn"),
  todoReset = document.querySelector(".resetBtn"),
  todoFilter = document.querySelector(".form__filer"),
  todoList = document.querySelector(".todo__list"),
  todoDeletedList = document.querySelector(".deleted__list"),
  todoOptions = document.querySelectorAll(".form__option"),
  pomoPopupCancel = document.querySelector(".pomo_action_no"),
  pomoPopupConfirm = document.querySelector(".pomo_action_yes"),
  pomoPopup = document.querySelector(".pomo_message"),
  pomoClose = document.querySelector(".pomo_close"),
  pomoTask = document.querySelector(".tasks p"),
  pomo = document.querySelector(".pomo"),
  pomoSetting = document.querySelector(".setting"),
  pomoForm = document.querySelector(".timer_inputs"),
  body = document.querySelector("body");

// Event Listners
window.addEventListener("load", onLoadActions);
todoSubmit.addEventListener("click", addTodo);
todoReset.addEventListener("click", resetApp);
todoFilter.addEventListener("change", filterOptions);
pomoClose.addEventListener("click", closePomo);
pomoPopupCancel.addEventListener("click", markTaskPendingViaPopup);
pomoPopupConfirm.addEventListener("click", markTaskCompleteViaPopup);
pomoSetting.addEventListener("click", showPomoSettings);

// Varaiables and Arrays
let todoArr = [];
let deletedTodoArr = [];

// Helper Functions

// Functions
function onLoadActions() {
  body.classList.add("loaded");
  renderLocalStorageData();
  filterOptions();
  console.log(todoArr);
}

function addTodo(e) {
  e.preventDefault();
  //   Get Value
  const inputValue = todoInput.value.trim();
  if (!inputValue) return;

  //   create object to add to array
  let todoObj = {
    task: inputValue,
    isCompleted: false,
    isDeleted: false,
    inPomodoro: false,
    inView: false,
  };
  todoArr.push(todoObj);

  // Save it to local storage
  localStorage.setItem("todoArr", JSON.stringify(todoArr));

  //   Reset input value to blank
  todoInput.value = "";

  //   Render Todos
  renderTodos();
}

function createTodos(arr) {
  arr.forEach((todo) => {
    //   CreateTodoItems
    if (!todo.isDeleted) {
      const todoItem = document.createElement("li");
      const todoBtnDelete = document.createElement("button");
      const todoBtnComplete = document.createElement("button");
      const todoBtnPomo = document.createElement("button");
      const todoSpan = document.createElement("span");
      const todoBtnBox = document.createElement("div");
      todoSpan.innerText = todo.task;
      todoItem.classList.add("todo_item");
      const bringInItem = setTimeout(() => {
        todoItem.classList.add("inView");
        todo.inView = true;
      }, 25);
      todoBtnBox.classList.add("todo_btnBox");
      todoBtnDelete.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
      todoBtnComplete.innerHTML = `<i class="fa-solid fa-check"></i>`;
      todoBtnPomo.innerHTML = `<i class="fa-regular fa-clock"></i>`;
      todoBtnDelete.setAttribute("title", "Mark Delete");
      todoBtnComplete.setAttribute("title", "Mark Complete");
      todoBtnPomo.setAttribute("title", "Add To Pomodoro");
      todoBtnComplete.classList.add("done");
      todoBtnPomo.classList.add("add_to_pomo_btn");
      todoItem.append(todoSpan);
      todoItem.append(todoBtnBox);
      todoBtnBox.append(todoBtnPomo);
      todoBtnBox.append(todoBtnComplete);
      todoBtnBox.append(todoBtnDelete);
      todoList.append(todoItem);
      todo.isCompleted && todoItem.classList.add("completed");
      todo.inPomodoro && todoItem.classList.add("added_to_pomo");
      todo.inView && todoItem.classList.add("inView");
      const todoItems = document.querySelectorAll(".todo_item");
      filterOptions();
      // Mark todo as complete
      todoBtnComplete.addEventListener("click", () => {
        todo.isCompleted = !todo.isCompleted;
        todo.inPomodoro = false;
        if (todo.isCompleted) {
          todoItem.classList.add("completed");
          todoItem.classList.remove("added_to_pomo");
        } else {
          todoItem.classList.remove("completed");
        }

        todoItems.forEach((todoItem) => {
          todoItem.classList.remove("disabled");
        });
        // Save updated values to local storage
        localStorage.setItem("todoArr", JSON.stringify(todoArr));
      });

      // Delete todo
      todoBtnDelete.addEventListener("click", () => {
        todoItem.classList.add("delete");
        todo.isDeleted = !todo.isDeleted;
        todo.inPomodoro = false;
        todoItems.forEach((todoItem) => {
          todoItem.classList.remove("disabled");
        });
        deletedTodoArr = todoArr.filter((todo) => {
          if (todo.isDeleted) {
            return todo;
          }
        });
        // Save updated values to local storage
        localStorage.setItem("todoArr", JSON.stringify(todoArr));
        // Set Deleted in local storage
        localStorage.setItem("deletedTodoArr", JSON.stringify(deletedTodoArr));
        todoItem.addEventListener("animationend", () => {
          todoItem.remove();
        });
      });

      // Add to Pomo
      if (todo.inPomodoro) {
        body.classList.add("pomo_inview");
        pomoTask.innerText = todo.task;
        todo.isCompleted = true;
        todoItem.classList.remove("completed");
      }

      todoBtnPomo.addEventListener("click", () => {
        todo.inPomodoro = !todo.inPomodoro;
        todo.isCompleted = true;
        todoItem.classList.remove("completed");
        root.style.setProperty("--widthPercent", 0);
        stop();
        console.log(todoArr);
        if (todo.inPomodoro) {
          todoItem.classList.add("added_to_pomo");
          body.classList.add("pomo_inview");
          pomoTask.innerText = todo.task;
        } else {
          todoItem.classList.remove("added_to_pomo");
          body.classList.remove("pomo_inview");
          pomoTask.innerText = "";
        }

        // Save updated values to local storage
        localStorage.setItem("todoArr", JSON.stringify(todoArr));
      });
    }
  });
}

function renderTodos() {
  todoList.innerHTML = "";
  //   Render Todos
  createTodos(todoArr);
}

function filterOptions() {
  const todoItems = document.querySelectorAll(".todo_item");
  todoItems.forEach((todoItem) => {
    if (
      todoFilter.value === "completed" &&
      todoItem.classList.contains("completed")
    ) {
      todoItem.style.display = "flex";
    } else if (
      todoFilter.value === "pending" &&
      !todoItem.classList.contains("completed")
    ) {
      todoItem.style.display = "flex";
    } else {
      todoItem.style.display = "none";
    }

    if (todoFilter.value === "all") {
      todoItem.style.display = "flex";
    }
  });

  renderDeletedItems();
}

function closePomo() {
  pomoPopup.classList.add("active");
  pomo.classList.add("active");
  body.classList.remove("workMode", "breakMode", "lg");
}

function markTaskPendingViaPopup() {
  pomoPopup.classList.remove("active");
  pomo.classList.remove("active");
  body.classList.remove("pomo_inview");
  pause();
  todoArr.forEach((todo) => {
    if (todo.inPomodoro) {
      todo.isCompleted = false;
    }
    todo.inPomodoro = false;
  });

  const todoItems = document.querySelectorAll(".todo_item");
  todoItems.forEach((todoItem) => {
    todoItem.classList.remove("added_to_pomo");

    if (todoItem.classList.contains("added_to_pomo completed")) {
      todoItem.classList.remove("completed");
    }
  });

  console.log(todoArr);

  // Save updated values to local storage
  localStorage.setItem("todoArr", JSON.stringify(todoArr));
}

function markTaskCompleteViaPopup() {
  pomoPopup.classList.remove("active");
  pomo.classList.remove("active");
  body.classList.remove("pomo_inview");
  stop();
  todoArr.forEach((todo) => {
    todo.inPomodoro = false;
    console.log(todoArr);
  });

  const todoItems = document.querySelectorAll(".todo_item");
  todoItems.forEach((todoItem) => {
    if (todoItem.classList.contains("added_to_pomo")) {
      todoItem.classList.add("completed");
      todoItem.classList.remove("added_to_pomo");
    }
  });

  console.log(todoArr);

  // Save updated values to local storage
  localStorage.setItem("todoArr", JSON.stringify(todoArr));
}

function showPomoSettings() {
  pomoForm.classList.add("active");
  pomo.classList.add("active");
}

function createDeletedItems() {
  deletedTodoArr.forEach((todo) => {
    const deletedItem = document.createElement("li");
    deletedItem.classList.add("deleted_item");
    const deletedSpan = document.createElement("span");
    deletedSpan.innerText = todo.task;
    deletedItem.append(deletedSpan);
    todoDeletedList.append(deletedItem);
  });
}

function renderDeletedItems() {
  if (todoFilter.value === "deleted") {
    todoDeletedList.innerHTML = "";
    createDeletedItems();
  }

  const deletedItems = document.querySelectorAll(".deleted_item");
  deletedItems.forEach((deletedItem) => {
    if (todoFilter.value === "deleted") {
      deletedItem.style.display = "flex";
    } else {
      deletedItem.style.display = "none";
    }
  });
}

function renderLocalStorageData() {
  //   Render Todos
  let todos = JSON.parse(localStorage.getItem("todoArr"));
  let deletedTodos = JSON.parse(localStorage.getItem("deletedTodoArr"));

  if (todoArr.length === 0 && todos !== null) {
    todoArr = [...todos];
    createTodos(todos);
  }

  if (deletedTodoArr.length === 0 && deletedTodos !== null) {
    deletedTodoArr = [...deletedTodos];
    createDeletedItems(deletedTodos);
  }
}

function resetApp(e) {
  e.preventDefault();
  todoArr = [];
  deletedTodoArr = [];
  todoList.innerHTML = "";
  todoDeletedList.innerHTML = "";
  localStorage.removeItem("todoArr");
  localStorage.removeItem("deletedTodoArr");
}

/*
Requirements
- Should allow the user to go through 4 cycles of work and break, and the last break type should
of long break - Done
- Should be able to start the pomodoro when clicking on a task in the todo app
- Should update the title of the pomodoro with the task you're working on - Done
- Should disable the start button if the pomodoro runs - Done
- Should allow the user to pause the pomodoro - Done
- Should allow the user to stop the pomodoro - Done

Extras
- Should allow the user to change the duration of cycles, work time, break time and long break
time - Done
- Should play a sound when the cycles change (work, break, long break)

For the real ones
- Should show a progress bar that updates every second - Done
- Should throw confetti when the long break is completed - Done
- Should show a modal that congratulates the user and asks if the task they were working was
completed. If the users says yes, then the task will be moved to completed (crossed, marked as
true in the data etc)  - Done
*/

// Selectors

const min = document.querySelector(".min"),
  sec = document.querySelector(".sec"),
  playTimer = document.querySelector(".play"),
  pauseTimer = document.querySelector(".pause"),
  stopTimer = document.querySelector(".stop"),
  settingTimer = document.querySelector(".setting"),
  cycles = document.querySelector(".cycles .number"),
  work = document.querySelector(".work"),
  shortBreak = document.querySelector(".short-break"),
  longBreak = document.querySelector(".long-break"),
  formSubmit = document.querySelector(".form-submit"),
  formCancel = document.querySelector(".form-cancel"),
  pomoTitle = document.querySelector(".pomo__title h2"),
  root = document.documentElement;

// Event Listeners
//   Variables
let timerInterval;
let totalSeconds;
let savedMins;
let workDetails;
let shortBreakDetails;
let longBreakDetails;
let isPaused = false;
let displayCycle = 1;
let cycleNum = 4;
let cycleCountMultiplied = cycleNum * 2;
let updatedCycleNum = cycleCountMultiplied;

formSubmit.addEventListener("click", runPomo);
formCancel.addEventListener("click", cancelPomo);
pauseTimer.addEventListener("click", pause);
playTimer.addEventListener("click", play);
stopTimer.addEventListener("click", stop);
window.addEventListener("load", onloadActions);

function onloadActions() {
  playTimer.setAttribute("disabled", true);
  pauseTimer.setAttribute("disabled", true);
  stopTimer.setAttribute("disabled", true);
}

function getTimerDetails(numValue) {
  if (
    workDetails > 0 &&
    workDetails <= 59 &&
    shortBreakDetails > 0 &&
    shortBreakDetails <= 59 &&
    longBreakDetails > 0 &&
    longBreakDetails <= 59
  ) {
    totalSeconds = numValue;
    convertNumToSec();
    runTimer();
    renderTimeOnScreen();
    settingTimer.setAttribute("disabled", true);
    playTimer.setAttribute("disabled", true);
    formSubmit.setAttribute("disabled", true);
    pauseTimer.removeAttribute("disabled", true);
    stopTimer.removeAttribute("disabled", true);
    pomoForm.classList.remove("active");
    pomo.classList.remove("active");
  } else {
    alert("Please add minutes from 1 - 59");
  }
}

function convertNumToSec() {
  totalSeconds = totalSeconds * 60;
  savedMins = totalSeconds / 60;
}

function getInputDetails() {
  workDetails = work.value;
  shortBreakDetails = shortBreak.value;
  longBreakDetails = longBreak.value;
}

function runTimer() {
  timerInterval = setInterval(() => {
    if (!isPaused && totalSeconds > 0) {
      totalSeconds--;
      renderTimeOnScreen();
      if (totalSeconds === 0) {
        clearInterval(timerInterval);
        updatedCycleNum--;
        isPaused === false;
        runPomo();
      }
    }
  }, 1000);
}

function renderTimeOnScreen() {
  const doubleDigitMin = Math.floor(totalSeconds / 60);
  const doubleDigitSec = totalSeconds % 60;
  min.innerText = doubleDigitMin.toString().padStart(2, "0");
  sec.innerText = doubleDigitSec.toString().padStart(2, "0");
  renderProgressBar();
}

function runPomo() {
  getInputDetails();
  runPomoAsPerCycles();
}

function pause() {
  isPaused = true;
  pauseTimer.setAttribute("disabled", true);
  playTimer.removeAttribute("disabled", true);
}

function play() {
  isPaused = false;
  playTimer.setAttribute("disabled", true);
  pauseTimer.removeAttribute("disabled", true);
}

function stop() {
  totalSeconds = 0;
  isPaused = false;
  updatedCycleNum = cycleCountMultiplied;
  cycles.innerText = 1;
  renderTimeOnScreen();
  body.classList.remove("workMode", "breakMode", "lg");
  settingTimer.removeAttribute("disabled", true);
  root.style.setProperty("--widthPercent", 0);
  formSubmit.removeAttribute("disabled", true);
  playTimer.setAttribute("disabled", true);
  pauseTimer.setAttribute("disabled", true);
  stopTimer.setAttribute("disabled", true);
  clearInterval(timerInterval);
}

function runPomoAsPerCycles() {
  if (updatedCycleNum % 2 === 0) {
    getTimerDetails(workDetails);
    body.classList.add("workMode");
    changeTitle("Time to focus!");
    body.classList.remove("breakMode", "lg");
    cycles.innerText = displayCycle++;
  } else if (updatedCycleNum % 2 !== 0) {
    getTimerDetails(shortBreakDetails);
    body.classList.remove("workMode");
    body.classList.add("breakMode");
    changeTitle("Go ahead Relax!");
  }

  if (updatedCycleNum === 1) {
    getTimerDetails(longBreakDetails);
    body.classList.remove("workMode");
    body.classList.add("breakMode", "lg");
    changeTitle("Good Job, you deserve it!");
  }

  if (updatedCycleNum === 0) {
    stop();
    setTimeout(shootStars, 0);
    setTimeout(shootStars, 100);
    setTimeout(shootStars, 200);
  }
}

function renderProgressBar() {
  const currentMin = totalSeconds / 60;
  const percentage = ((currentMin / savedMins) * 100).toFixed();
  const percentageLeftOver = `${100 - percentage}%`;
  root.style.setProperty("--widthPercent", percentageLeftOver);
}

function cancelPomo() {
  pomoPopup.classList.remove("active");
  pomo.classList.remove("active");
  pomoForm.classList.remove("active");
}

// Confetti stars
const defaultStars = {
  spread: 360,
  ticks: 50,
  gravity: 0,
  decay: 0.94,
  startVelocity: 30,
  shapes: ["star"],
  colors: ["#bd2a2e", "#ffffff", "#1963b6", "#8591d4"],
};

function shootStars() {
  confetti({
    ...defaultStars,
    particleCount: 80,
    scalar: 1.2,
    shapes: ["star"],
  });

  confetti({
    ...defaultStars,
    particleCount: 20,
    scalar: 0.75,
    shapes: ["circle"],
  });
}

function changeTitle(title) {
  pomoTitle.classList.add("title__change");
  setTimeout(() => {
    pomoTitle.classList.remove("title__change");
    pomoTitle.innerText = title;
  }, 500);
}
