async function loadCatalog() {
  const res = await fetch("http://127.0.0.1:8000/tasks/");
  const tasks = await res.json();
  
  const container = document.getElementById("tasksContainer");
  container.innerHTML = "";

  const groups = {
    easy: [],
    medium: [],
    hard: []
  };

  tasks.forEach(task => {
    const diff = task.difficulty.toLowerCase();
    if (groups[diff]) groups[diff].push(task);
  });

  function createCard(task) {
    const card = document.createElement("div");
    card.classList.add("taskCard");
    card.innerHTML = `
      <h4>${task.title}</h4>
      <p>Category: ${task.category}</p>
      <button onclick="location.href='start.html?task=${task.id}'">Solve it</button>
    `;
    return card;
  }

  for (const [difficulty, tasksArr] of Object.entries(groups)) {
    if (tasksArr.length === 0) continue;

    const title = document.createElement("h2");
    title.textContent = difficulty.toUpperCase();
    title.classList.add("sectionTitle", difficulty);
    container.append(title);

    const section = document.createElement("div");
    section.classList.add("tasksSection", difficulty);
    tasksArr.forEach(task => section.append(createCard(task)));

    container.append(section);
  }
}

loadCatalog();