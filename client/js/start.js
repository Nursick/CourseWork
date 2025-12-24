let editor;
let tasks = [];
let tempOutput = "";

function lockEditor() {
    editor.setOption("readOnly", "nocursor");
    editor.setValue("# Select a task to start coding...");
}

function unlockEditor() {
    editor.setOption("readOnly", false);
    if (editor.getValue().startsWith("# Select a task")) {
        editor.setValue("");
    }
}

function outf(text) {
    tempOutput += text;
    document.getElementById("output").textContent = tempOutput;
}

function builtinRead(x) {
    if (!Sk.builtinFiles || !Sk.builtinFiles["files"][x]) {
        throw `File not found: '${x}'`;
    }
    return Sk.builtinFiles["files"][x];
}

window.onload = async () => {
    editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
        lineNumbers: true,
        mode: "python",
        theme: "monokai",
        tabSize: 4,
        indentUnit: 4
    });

    lockEditor();
    await loadTasks();

    const params = new URLSearchParams(window.location.search);
    const taskId = params.get("task");
    if (
        taskId &&
        document
            .getElementById("taskSelect")
            .querySelector(`option[value="${taskId}"]`)
    ) {
        document.getElementById("taskSelect").value = taskId;
        showTaskInfo(taskId);
    }
};

async function loadTasks() {
    const res = await fetch("http://127.0.0.1:8000/tasks/");
    tasks = await res.json();

    const select = document.getElementById("taskSelect");
    select.innerHTML = `<option value="">Select Task</option>`;

    tasks.forEach(task => {
        select.insertAdjacentHTML(
            "beforeend",
            `<option value="${task.id}">${task.title}</option>`
        );
    });
}

function showTaskInfo(id) {
    const task = tasks.find(t => t.id == id);
    const descBox = document.getElementById("taskDescription");

    if (!task) {
        descBox.innerHTML = "";
        lockEditor();
        return;
    }

    descBox.innerHTML = `
        <h2>Task №${task.id} - ${task.title}</h2>
        <p>Goal: ${task.description}</p>
        <p>Given: "${task.inputData}"</p>
    `;

    unlockEditor();
}

document
    .getElementById("taskSelect")
    .addEventListener("change", (e) => {
        const taskId = e.target.value;
        showTaskInfo(taskId);
    });

function runCode() {
    const taskId = document.getElementById("taskSelect").value;
    if (!taskId) {
        document.getElementById("output").textContent = "Select a task first!";
        document.getElementById("output").style.color = "red";
        return;
    }

    const code = editor.getValue().trim();
    if (!code) {
        document.getElementById("output").textContent = "⚠ The editor is empty!";
        document.getElementById("output").style.color = "orange";
        return;
    }

    tempOutput = "";
    document.getElementById("output").textContent = "";

    Sk.configure({
        output: outf,
        read: builtinRead
    });

    Sk.misceval
        .asyncToPromise(() =>
            Sk.importMainWithBody("<stdin>", false, code)
        )
        .then(() => sendResultToCheck(taskId, tempOutput))
        .catch(err => {
            tempOutput += err.toString();
            document.getElementById("output").textContent = tempOutput;
            sendResultToCheck(taskId, tempOutput);
        });
}

async function sendResultToCheck(taskId, output) {
    const res = await fetch("http://127.0.0.1:8000/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            taskID: Number(taskId),
            userOutput: output
        })
    });

    const data = await res.json();

    const outputEl = document.getElementById("output");

    if (data.correct) {
        outputEl.textContent = "✅ Correct answer!";
        outputEl.style.color = "limegreen";
    } else {
        outputEl.textContent = "❌ Wrong answer!";
        outputEl.style.color = "red";
    }
}

document
    .querySelector(".runBtn")
    .addEventListener("click", runCode);
