const taskInput = document.querySelector('.task-input input'),
    filters = document.querySelectorAll('.filters span'),
    uncheckedCountSpan = document.getElementById('unchecked-count'),
    taskBox = document.querySelector('.task-box');

let editId;
let isEditedTask = false;
let todos = JSON.parse(localStorage.getItem("todo-list"));
let currentFilter = "all";

filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector('span.active').classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
        currentFilter = btn.id;
        countItem();
    });
});

function showTodo(filter) {
    let li = "";
    if (todos) {
        todos.forEach((todo, id) => {
            let isCompleted = todo.status === "completed" ? "checked" : " ";
            if (filter == todo.status || filter == "all") {
                li += ` <li class="task">
    <label for="${id}">
        <input onclick="updateStatus(this)" type="checkbox"  id="${id}" ${isCompleted}>
        <p class="${isCompleted}">${todo.name}</p>
    </label>
    <div class="settings">
      <i onclick ="showMenu(this)"> ...</i>
        <ul class="task-menu">
            <li onclick ="editTask(${id}, '${todo.name}')"><i class="edit"></i>Edit</li>
            <li onclick ="deleteTask(${id})"><i class="delete"></i>Delete</li>
        </ul>
    </div>
</li>`;
            }
        });
    }
    taskBox.innerHTML = li;
}
showTodo(currentFilter);
countItem();

function showMenu(selectedTask) {
    let taskMenu = selectedTask.parentElement.lastElementChild;
    taskMenu.classList.add("show");
    document.addEventListener('click', e => {
        if (e.target.tagName != "I" || e.target != selectedTask) {
            taskMenu.classList.remove("show");
        }
    })
}

function editTask(taskId, taskName) {
    editId = taskId;
    isEditedTask = true;
    taskInput.value = taskName;
}

function deleteTask(deleteId) {
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(currentFilter);
    countItem();
}

const clearButton = () => {
    var newArray = [...todos];
    var newItem = newArray.filter((element => element.status !== "completed"));
    todos = [...newItem];
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(currentFilter);
}

function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos))
    showTodo(currentFilter);
    countItem();
}

taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value;
    if (e.key == "Enter" && userTask) {
        if (!isEditedTask) {
            if (!todos) {
                todos = [];
            }
            let taskInfo = { name: userTask, status: "pending" }
            todos.push(taskInfo);
        } else {
            isEditedTask = false;
            todos[editId].name = userTask;
        }
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo(currentFilter);
        countItem();
    }

});

function countItem() {
    var newActiveArr = [...todos];
    var newItems = newActiveArr.filter((element => element.status === "pending"));
    newActiveArr = [...newItems];
    let uncheckedCount = newActiveArr.length
    uncheckedCountSpan.innerHTML = uncheckedCount
    uncheckedCount = newItems;
}
