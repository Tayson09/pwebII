const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector("#taskList");
const counter = document.querySelector("#counter");
const emptyState = document.querySelector("#emptyState");

const STORAGE_KEY = "todo-list-tasks";

let tasks = loadTasks();

function loadTasks() {
    try {
        const savedTasks = localStorage.getItem(STORAGE_KEY);

        if (!savedTasks) {
            return [];
        }

        return JSON.parse(savedTasks);
    } catch (error) {
        console.log("Erro ao carregar tarefas.", error);
        return [];
    }
}

function saveTasks() {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(tasks)
        );
    } catch (error) {
        console.log("Erro ao salvar tarefas.", error);
    }
}

function getCurrentDate() {
    return new Date().toLocaleDateString("pt-BR");
}

function renderTasks() {
    taskList.innerHTML = "";

    const completedTasks = tasks.filter(
        task => task.completed
    ).length;

    counter.innerHTML = `
        ${completedTasks} de ${tasks.length}
        <span>concluídas</span>
    `;

    emptyState.classList.toggle(
        "visible",
        tasks.length === 0
    );

    tasks.forEach(task => {
        const taskElement = document.createElement("article");

        taskElement.className = `task ${
            task.completed ? "completed" : ""
        }`;

        taskElement.innerHTML = `
            <input
                class="task-check"
                type="checkbox"
                ${task.completed ? "checked" : ""}
                aria-label="Marcar tarefa como concluída"
            >

            <div class="task-info">
                <p class="task-title"></p>

                <p class="task-date">
                    ${task.completed ? "Concluída" : "Criada"}
                    em: ${task.date}
                </p>
            </div>

            <button
                class="delete-btn"
                type="button"
                aria-label="Excluir tarefa"
                title="Excluir tarefa"
            >
                <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        d="M9 3h6l1 2h4v2H4V5h4l1-2zm-2 6h2v9H7V9zm4 0h2v9h-2V9zm4 0h2v9h-2V9z"
                    />

                    <path
                        d="M6 20c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v13z"
                    />
                </svg>
            </button>
        `;

        taskElement
            .querySelector(".task-title")
            .textContent = task.title;

        taskElement
            .querySelector(".task-check")
            .addEventListener(
                "change",
                () => toggleTask(task.id)
            );

        taskElement
            .querySelector(".delete-btn")
            .addEventListener(
                "click",
                () => deleteTask(task.id)
            );

        taskList.appendChild(taskElement);
    });
}

function addTask(title) {
    const cleanTitle = title.trim();

    if (!cleanTitle) {
        taskInput.focus();
        return;
    }

    const newTask = {
        id: crypto.randomUUID(),
        title: cleanTitle,
        completed: false,
        date: getCurrentDate()
    };

    tasks.unshift(newTask);

    saveTasks();
    renderTasks();

    taskForm.reset();
    taskInput.focus();
}

function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id !== id) {
            return task;
        }

        return {
            ...task,
            completed: !task.completed
        };
    });

    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(
        task => task.id !== id
    );

    saveTasks();
    renderTasks();
}

taskForm.addEventListener("submit", event => {
    event.preventDefault();

    addTask(taskInput.value);
});

renderTasks();