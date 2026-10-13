
"use strict";

// ========================================
// SkillPath - Smart Career Roadmap
// Main JavaScript File
// ========================================

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const STORAGE_KEYS = {
    profile: "skillpath_profile_v1",
    tasks: "skillpath_tasks_v1"
};

function loadStorage(key, fallback) {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    } catch (error) {
        console.warn("Could not load saved data:", error);
        return fallback;
    }
}

function saveStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        showToast("Could not save data. Check your browser storage.");
        return false;
    }
}

let profile = loadStorage(STORAGE_KEYS.profile, {
    name: "",
    education: "BCA",
    year: "Final Year",
    career: "Web Developer",
    goal: "",
    skills: []
});

let tasks = loadStorage(STORAGE_KEYS.tasks, []);
let toastTimer;

function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// ========================================
// 1. COURSE DATA
// ========================================

const courses = [
    { name: "C Programming", category: "Programming", icon: "🔷", level: "Beginner", description: "Learn variables, conditions, loops, arrays and functions.", url: "https://www.learn-c.org/" },
    { name: "C++ Programming", category: "Programming", icon: "⚙️", level: "Beginner", description: "Explore C++ syntax, functions, classes and OOP.", url: "https://www.learncpp.com/" },
    { name: "C# Programming", category: "Programming", icon: "🟣", level: "Beginner", description: "Learn C# fundamentals, classes, methods and collections.", url: "https://learn.microsoft.com/en-us/dotnet/csharp/" },
    { name: ".NET Development", category: "Programming", icon: "🧩", level: "Beginner", description: "Understand .NET and build applications with C#.", url: "https://learn.microsoft.com/en-us/dotnet/" },
    { name: "Object-Oriented Programming", category: "Programming", icon: "🏗️", level: "Beginner", description: "Practise classes, objects, inheritance and polymorphism.", url: "https://www.w3schools.com/cpp/cpp_oop.asp" },
    { name: "Data Structures & Algorithms", category: "Programming", icon: "🧠", level: "Intermediate", description: "Study arrays, searching, sorting and algorithm basics.", url: "https://www.geeksforgeeks.org/" },
    { name: "Python", category: "Programming", icon: "🐍", level: "Beginner", description: "Start with Python syntax, functions and useful programs.", url: "https://docs.python.org/3/tutorial/" },
    { name: "Java Programming", category: "Programming", icon: "☕", level: "Beginner", description: "Learn Java fundamentals, OOP and application development.", url: "https://dev.java/learn/" },
    { name: "HTML", category: "Web Development", icon: "🌐", level: "Beginner", description: "Create web pages with headings, links, images and forms.", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
    { name: "CSS", category: "Web Development", icon: "🎨", level: "Beginner", description: "Style web pages with layouts, colours and responsive design.", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
    { name: "JavaScript", category: "Web Development", icon: "✨", level: "Beginner", description: "Make web pages interactive with JavaScript.", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
    { name: "Bootstrap", category: "Web Development", icon: "🅱️", level: "Beginner", description: "Build responsive layouts using Bootstrap components.", url: "https://getbootstrap.com/docs/" },
    { name: "React", category: "Web Development", icon: "⚛️", level: "Intermediate", description: "Build interactive interfaces using components and state.", url: "https://react.dev/learn" },
    { name: "Angular", category: "Web Development", icon: "🔺", level: "Intermediate", description: "Explore components, services and Angular applications.", url: "https://angular.dev/tutorials" },
    { name: "Node.js", category: "Web Development", icon: "🟢", level: "Intermediate", description: "Learn JavaScript on the server side.", url: "https://nodejs.org/en/learn" },
    { name: "Express.js", category: "Web Development", icon: "🚀", level: "Intermediate", description: "Create web servers and APIs with Express.", url: "https://expressjs.com/" },
    { name: "SQL & Databases", category: "Data & Tools", icon: "🗄️", level: "Beginner", description: "Practise SQL queries, tables, filtering and joins.", url: "https://www.w3schools.com/sql/" },
    { name: "Git & GitHub", category: "Data & Tools", icon: "🐙", level: "Beginner", description: "Track code changes and publish your projects.", url: "https://docs.github.com/en/get-started" },
    { name: "Linux Fundamentals", category: "Data & Tools", icon: "🐧", level: "Beginner", description: "Understand commands, files and the Linux environment.", url: "https://ubuntu.com/tutorials/command-line-for-beginners" },
    { name: "Operating Systems", category: "Data & Tools", icon: "💻", level: "Beginner", description: "Study processes, memory and operating system concepts.", url: "https://www.geeksforgeeks.org/operating-systems/" },
    { name: "Computer Networks", category: "Data & Tools", icon: "🌐", level: "Beginner", description: "Learn networking basics, IP addresses and protocols.", url: "https://www.cloudflare.com/learning/" },
    { name: "Cloud Fundamentals", category: "Data & Tools", icon: "☁️", level: "Beginner", description: "Understand cloud computing and basic cloud services.", url: "https://learn.microsoft.com/en-us/training/azure/" },
    { name: "Cybersecurity Basics", category: "Data & Tools", icon: "🔐", level: "Beginner", description: "Learn safe computing and security fundamentals.", url: "https://www.cisa.gov/secure-our-world" },
    { name: "Software Testing", category: "Programming", icon: "🧪", level: "Beginner", description: "Explore test cases, bug reports and testing methods.", url: "https://www.guru99.com/software-testing.html" },
    { name: "Excel & Power BI", category: "Data & Tools", icon: "📊", level: "Beginner", description: "Organise data and create reports and dashboards.", url: "https://learn.microsoft.com/en-us/training/powerplatform/power-bi/" },
    { name: "Aptitude & Interview Prep", category: "Career Skills", icon: "🎯", level: "All levels", description: "Practise reasoning, communication and interview questions.", url: "https://www.indiabix.com/" },
    { name: "Full Stack Development", category: "Web Development", icon: "🛠️", level: "Intermediate", description: "Combine frontend, backend and database fundamentals.", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development" },
    { name: "MVS / Mainframe Basics", category: "Programming", icon: "🖥️", level: "Beginner", description: "Explore mainframe concepts and enterprise computing.", url: "https://www.ibm.com/docs/en" }
];

// ========================================
// 2. CAREER ROADMAP DATA
// ========================================

const roadmaps = {
    "Web Developer": {
        description: "Learn to build responsive websites and interactive web applications.",
        stages: [
            { title: "Web Fundamentals", time: "2–3 weeks", topics: ["HTML structure and forms", "CSS colours, layouts and Flexbox", "Responsive design"] },
            { title: "JavaScript", time: "3–4 weeks", topics: ["Variables and functions", "Arrays and objects", "DOM and events"] },
            { title: "Build Real Projects", time: "3–4 weeks", topics: ["Portfolio website", "Interactive task manager", "Git and GitHub"] },
            { title: "Frontend Framework", time: "4–6 weeks", topics: ["React components", "Props and state", "Routing and API basics"] },
            { title: "Job Preparation", time: "2–3 weeks", topics: ["Polish portfolio", "Practise interview questions", "Resume and applications"] }
        ]
    },
    "Software Developer": {
        description: "Build a strong programming foundation and develop useful software applications.",
        stages: [
            { title: "Programming Fundamentals", time: "3–4 weeks", topics: ["C or C# fundamentals", "Conditions, loops and functions", "Problem-solving exercises"] },
            { title: "OOP & Data Structures", time: "4–6 weeks", topics: ["Classes and objects", "Inheritance and polymorphism", "Arrays, searching and sorting"] },
            { title: "Database & SQL", time: "2–3 weeks", topics: ["Tables and data types", "INSERT, SELECT, UPDATE and DELETE", "Joins and relationships"] },
            { title: "Application Development", time: "4–6 weeks", topics: ["C# and .NET", "Build a student management app", "Connect an application to SQL Server"] },
            { title: "Job Preparation", time: "2–3 weeks", topics: ["Revise programming basics", "Explain your projects", "Resume and interview practice"] }
        ]
    },
    "Data Analyst": {
        description: "Learn to organise, analyse and communicate insights from data.",
        stages: [
            { title: "Excel Fundamentals", time: "2–3 weeks", topics: ["Formulas and functions", "Sorting and filtering", "Pivot tables"] },
            { title: "SQL", time: "3–4 weeks", topics: ["SELECT and WHERE", "GROUP BY and JOIN", "Practice with sample datasets"] },
            { title: "Python for Data", time: "4–5 weeks", topics: ["Python fundamentals", "Pandas basics", "Data cleaning"] },
            { title: "Visualisation", time: "3–4 weeks", topics: ["Charts and reports", "Power BI fundamentals", "Build a dashboard"] },
            { title: "Portfolio & Interviews", time: "2–3 weeks", topics: ["Complete a data project", "Explain your findings", "Prepare a resume"] }
        ]
    }
};

// ========================================
// 3. PROJECT IDEAS
// ========================================

const projects = [
    { title: "Personal Portfolio", icon: "🌐", level: "Beginner", stack: "HTML, CSS, JavaScript", description: "Showcase your skills, education, projects and contact details." },
    { title: "Student Management System", icon: "🎓", level: "Beginner–Intermediate", stack: "C# / .NET, SQL Server", description: "Save, search and display student records in a database." },
    { title: "SkillPath Career Planner", icon: "🧭", level: "Beginner–Intermediate", stack: "HTML, CSS, JavaScript", description: "Build a learning dashboard with career paths and task tracking." },
    { title: "Expense Tracker", icon: "💰", level: "Beginner", stack: "HTML, CSS, JavaScript", description: "Record expenses and view spending totals." },
    { title: "Quiz Application", icon: "📝", level: "Beginner", stack: "JavaScript", description: "Create multiple-choice questions and calculate scores." },
    { title: "Data Dashboard", icon: "📈", level: "Intermediate", stack: "Excel / Power BI", description: "Turn sample data into clear charts and useful insights." }
];

// ========================================
// 4. LEARNING RESOURCES
// ========================================

const resources = [
    { title: "MDN Web Docs", icon: "🌐", category: "Web Development", description: "Reliable documentation for HTML, CSS and JavaScript.", url: "https://developer.mozilla.org/" },
    { title: "Microsoft Learn", icon: "🟦", category: "Programming", description: "Learn C#, .NET, Azure and Microsoft technologies.", url: "https://learn.microsoft.com/" },
    { title: "W3Schools", icon: "📘", category: "Web Development", description: "Beginner tutorials and examples for web technologies.", url: "https://www.w3schools.com/" },
    { title: "GitHub Skills", icon: "🐙", category: "Tools", description: "Interactive lessons for GitHub workflows.", url: "https://skills.github.com/" },
    { title: "freeCodeCamp", icon: "🔥", category: "Web Development", description: "Free coding lessons and practical projects.", url: "https://www.freecodecamp.org/learn/" },
    { title: "Python Documentation", icon: "🐍", category: "Programming", description: "Official Python tutorial and language reference.", url: "https://docs.python.org/3/tutorial/" },
    { title: "GeeksforGeeks", icon: "🧠", category: "Programming", description: "Programming, DSA, computer science and interview topics.", url: "https://www.geeksforgeeks.org/" },
    { title: "IndiaBIX", icon: "🎯", category: "Career Skills", description: "Practise aptitude, reasoning and interview questions.", url: "https://www.indiabix.com/" },
    { title: "SQLBolt", icon: "🗄️", category: "Database", description: "Interactive introductory SQL lessons.", url: "https://sqlbolt.com/" }
];

// ========================================
// 5. NAVIGATION
// ========================================

function openPage(pageId) {
    const page = document.getElementById(pageId);
    if (!page) return;

    $$(".page").forEach((item) => item.classList.remove("active"));
    page.classList.add("active");

    $$(".nav-link").forEach((button) => {
        button.classList.toggle("active", button.dataset.page === pageId);
    });

    const activeButton = $(`.nav-link[data-page="${pageId}"]`);
    $("#pageLabel").textContent = activeButton
        ? activeButton.querySelector("span").textContent
        : pageId;

    $("#sidebar")?.classList.remove("open");
    $(".sidebar")?.classList.remove("open");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("click", (event) => {
    const pageButton = event.target.closest("[data-page]");
    if (pageButton) {
        event.preventDefault();
        openPage(pageButton.dataset.page);
    }
});

$("#menuToggle").addEventListener("click", () => {
    $(".sidebar").classList.toggle("open");
});

// ========================================
// 6. COURSES
// ========================================

function renderHomeCourses() {
    $("#homeCourses").innerHTML = courses.slice(0, 4).map((course) => `
        <div class="home-course">
            <div class="course-symbol">${course.icon}</div>
            <div class="home-course-info">
                <strong>${escapeHTML(course.name)}</strong>
                <small>${escapeHTML(course.level)} · ${escapeHTML(course.category)}</small>
            </div>
            <button type="button" data-course-url="${escapeHTML(course.url)}">Explore</button>
        </div>
    `).join("");
}

function renderCourses() {
    const search = $("#courseSearch").value.trim().toLowerCase();
    const category = $("#categoryFilter").value;

    const filtered = courses.filter((course) => {
        const matchesSearch =
            course.name.toLowerCase().includes(search) ||
            course.description.toLowerCase().includes(search) ||
            course.category.toLowerCase().includes(search);

        return matchesSearch &&
            (category === "All" || course.category === category);
    });

    $("#coursesGrid").innerHTML = filtered.length
        ? filtered.map((course) => `
            <article class="course-card">
                <div class="course-card-top">
                    <div class="course-symbol">${course.icon}</div>
                    <span class="category-tag">${escapeHTML(course.category)}</span>
                </div>
                <h3>${escapeHTML(course.name)}</h3>
                <p>${escapeHTML(course.description)}</p>
                <div class="course-meta">${escapeHTML(course.level)}</div>
                <button class="button button-primary" type="button"
                    data-course-url="${escapeHTML(course.url)}">Start learning ↗</button>
            </article>
        `).join("")
        : '<div class="empty-state">No courses found. Try another search.</div>';
}

$("#courseSearch").addEventListener("input", renderCourses);
$("#categoryFilter").addEventListener("change", renderCourses);

document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-course-url]");
    if (!button) return;

    const url = button.dataset.courseUrl;
    if (url && url.startsWith("https://")) {
        window.open(url, "_blank", "noopener,noreferrer");
    }
});

function renderProjects() {
    $("#projectsGrid").innerHTML = projects.map((project) => `
        <article class="course-card">
            <div class="course-card-top">
                <div class="course-symbol">${project.icon}</div>
                <span class="category-tag">${escapeHTML(project.level)}</span>
            </div>
            <h3>${escapeHTML(project.title)}</h3>
            <p>${escapeHTML(project.description)}</p>
            <div class="course-meta">Tech stack: ${escapeHTML(project.stack)}</div>
            <button class="button button-primary" type="button"
                data-project-task="${escapeHTML(project.title)}">＋ Add as task</button>
        </article>
    `).join("");
}

$("#projectsGrid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-project-task]");
    if (!button) return;

    addTask(button.dataset.projectTask, "Project", "");
    openPage("practice");
    showToast("Project added to your task list!");
});

function renderResources() {
    $("#resourcesGrid").innerHTML = resources.map((resource) => `
        <article class="course-card">
            <div class="course-card-top">
                <div class="course-symbol">${resource.icon}</div>
                <span class="category-tag">${escapeHTML(resource.category)}</span>
            </div>
            <h3>${escapeHTML(resource.title)}</h3>
            <p>${escapeHTML(resource.description)}</p>
            <button class="button button-primary" type="button"
                data-course-url="${escapeHTML(resource.url)}">Open resource ↗</button>
        </article>
    `).join("");
}

// ========================================
// 7. CAREER ROADMAP
// ========================================

function renderRoadmap() {
    const career = $("#careerSelect").value;
    const roadmap = roadmaps[career];

    if (!roadmap) return;

    $("#roadmapSummary").innerHTML = `
        <h2>${escapeHTML(career)}</h2>
        <p>${escapeHTML(roadmap.description)}</p>
    `;

    $("#roadmapContent").innerHTML = roadmap.stages.map((stage, index) => `
        <article class="roadmap-card">
            <div class="roadmap-step">${index + 1}</div>
            <div>
                <h3>${escapeHTML(stage.title)}</h3>
                <span class="stage-time">Suggested duration: ${escapeHTML(stage.time)}</span>
                <ul>${stage.topics.map((topic) => `<li>${escapeHTML(topic)}</li>`).join("")}</ul>
                <button class="text-button roadmap-task" type="button"
                    data-stage="${escapeHTML(stage.title)}">＋ Add stage as task</button>
            </div>
        </article>
    `).join("");
}

$("#careerSelect").addEventListener("change", renderRoadmap);

$("#roadmapContent").addEventListener("click", (event) => {
    const button = event.target.closest(".roadmap-task");
    if (!button) return;

    addTask("Learn: " + button.dataset.stage, "Programming", "");
    updateDashboard();
    showToast("Roadmap stage added to your tasks.");
});

$$(".career-card").forEach((button) => {
    button.addEventListener("click", () => {
        $("#careerSelect").value = button.dataset.career;
        renderRoadmap();
        openPage("roadmap");
    });
});

// ========================================
// 8. HOMEWORK AND TASKS
// ========================================

function addTask(title, category, dueDate) {
    const task = {
        id: Date.now().toString() + Math.random().toString(36).slice(2, 7),
        title: title,
        category: category,
        dueDate: dueDate,
        completed: false
    };

    tasks.unshift(task);

    if (saveStorage(STORAGE_KEYS.tasks, tasks)) {
        renderTasks();
        updateDashboard();
    }
}

$("#taskForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const title = $("#taskInput").value.trim();
    if (!title) {
        showToast("Please enter a task name.");
        return;
    }

    addTask(title, $("#taskCategory").value, $("#taskDate").value);
    $("#taskForm").reset();
    showToast("Task added successfully!");
});

function renderTasks() {
    const filter = $("#taskFilter").value;
    const filtered = tasks.filter((task) => {
        if (filter === "Pending") return !task.completed;
        if (filter === "Completed") return task.completed;
        return true;
    });

    $("#taskList").innerHTML = filtered.length
        ? filtered.map((task) => `
            <div class="task-item ${task.completed ? "is-done" : ""}">
                <input type="checkbox" aria-label="Complete ${escapeHTML(task.title)}"
                    data-task-toggle="${escapeHTML(task.id)}"
                    ${task.completed ? "checked" : ""}>
                <div class="task-details">
                    <strong>${escapeHTML(task.title)}</strong>
                    <small>${escapeHTML(task.category)}${task.dueDate ? " · Due " + escapeHTML(task.dueDate) : ""}</small>
                </div>
                <button class="delete-task" type="button"
                    data-task-delete="${escapeHTML(task.id)}" aria-label="Delete task">✕</button>
            </div>
        `).join("")
        : '<div class="empty-state">No tasks here yet. Add your first learning task above!</div>';
}

$("#taskFilter").addEventListener("change", renderTasks);

$("#taskList").addEventListener("change", (event) => {
    const id = event.target.dataset.taskToggle;
    if (!id) return;

    const task = tasks.find((item) => item.id === id);
    if (!task) return;

    task.completed = event.target.checked;

    if (saveStorage(STORAGE_KEYS.tasks, tasks)) {
        renderTasks();
        updateDashboard();
        showToast(task.completed ? "Great work! Task completed." : "Task marked as pending.");
    }
});

$("#taskList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-task-delete]");
    if (!button) return;

    tasks = tasks.filter((task) => task.id !== button.dataset.taskDelete);
    if (saveStorage(STORAGE_KEYS.tasks, tasks)) {
        renderTasks();
        updateDashboard();
        showToast("Task deleted.");
    }
});

// ========================================
// 9. PROGRESS DASHBOARD
// ========================================

function updateDashboard() {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const pending = total - completed;
    const percent = total ? Math.round((completed / total) * 100) : 0;

    $("#courseCount").textContent = courses.length;
    $("#completedCount").textContent = completed;
    $("#pendingCount").textContent = pending;
    $("#progressNumber").textContent = percent + "%";

    $("#miniProgressText").textContent = percent + "%";
    $("#miniProgressBar").style.width = percent + "%";

    $("#progressTotal").textContent = total;
    $("#progressDone").textContent = completed;
    $("#progressPending").textContent = pending;
    $("#progressPercent").textContent = percent + "%";
    $("#largeProgressBar").style.width = percent + "%";

    $("#progressMessage").textContent = total
        ? `${completed} of ${total} tasks completed. ${pending ? "Keep going—you are making progress!" : "Excellent! You completed every task."}`
        : "Add your first task to begin tracking your progress.";

    $("#taskSummary").innerHTML = `
        <div class="stats-grid">
            <article class="stat-card"><p>Total tasks</p><h3>${total}</h3></article>
            <article class="stat-card"><p>Completed</p><h3>${completed}</h3></article>
            <article class="stat-card"><p>Pending</p><h3>${pending}</h3></article>
            <article class="stat-card"><p>Progress</p><h3>${percent}%</h3></article>
        </div>
    `;
}

// ========================================
// 10. PROFILE
// ========================================

function renderProfile() {
    $("#studentName").value = profile.name || "";
    $("#education").value = profile.education || "BCA";
    $("#year").value = profile.year || "Final Year";
    $("#career").value = profile.career || "Web Developer";
    $("#goal").value = profile.goal || "";

    $$('input[name="skills"]').forEach((checkbox) => {
        checkbox.checked = (profile.skills || []).includes(checkbox.value);
    });

    updateProfileDisplay();
}

function updateProfileDisplay() {
    const name = profile.name.trim();
    const initial = name ? name.charAt(0).toUpperCase() : "S";

    $("#topAvatar").textContent = initial;
    $("#profileAvatar").textContent = initial;

    $("#welcomeTitle").textContent = name
        ? `Welcome back, ${name}! 👋`
        : "Welcome to SkillPath! 👋";
}

$("#profileForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const name = $("#studentName").value.trim();

    if (!name) {
        showToast("Please enter your name.");
        return;
    }

    profile = {
        name: name,
        education: $("#education").value,
        year: $("#year").value,
        career: $("#career").value,
        goal: $("#goal").value.trim(),
        skills: Array.from($$('input[name="skills"]:checked'))
            .map((checkbox) => checkbox.value)
    };

    if (saveStorage(STORAGE_KEYS.profile, profile)) {
        updateProfileDisplay();
        $("#profileMessage").textContent = "Your profile has been saved on this device.";
        $("#careerSelect").value = profile.career;
        renderRoadmap();
        showToast("Profile saved successfully!");
    }
});

// ========================================
// 11. INITIALISE WEBSITE
// ========================================

function initialiseSkillPath() {
    renderHomeCourses();
    renderCourses();
    renderProjects();
    renderResources();
    renderRoadmap();
    renderTasks();
    renderProfile();
    updateDashboard();

    // Use the saved career preference in the roadmap.
    if (roadmaps[profile.career]) {
        $("#careerSelect").value = profile.career;
        renderRoadmap();
    }
}

initialiseSkillPath();

/* ===== SkillPath AI Study Assistant ===== */
(function () {
    const chatForm = document.getElementById("aiChatForm");

    // Do nothing on pages that don't contain the assistant.
    if (!chatForm) return;

    const input = document.getElementById("aiMessageInput");
    const messages = document.getElementById("aiMessages");
    const emptyState = document.getElementById("aiEmptyState");
    const clearButton = document.getElementById("aiClearChat");

    function addMessage(text, sender) {
        if (emptyState) emptyState.style.display = "none";

        const row = document.createElement("div");
        row.className = "ai-message " +
            (sender === "user" ? "ai-user-message" : "ai-bot-message");

        if (sender !== "user") {
            const avatar = document.createElement("div");
            avatar.className = "ai-avatar";
            avatar.textContent = "🤖";
            row.appendChild(avatar);
        }

        const bubble = document.createElement("div");
        bubble.className = "ai-bubble";

        // textContent keeps user input as text instead of executable HTML.
        bubble.textContent = text;
        row.appendChild(bubble);
        messages.appendChild(row);
        messages.scrollTop = messages.scrollHeight;
    }

    function getDemoAnswer(question) {
        const q = question.toLowerCase();

        if (q.includes("oop") || q.includes("inheritance")) {
            return "OOP means Object-Oriented Programming. It organizes programs using classes and objects. Its four main principles are Encapsulation, Inheritance, Polymorphism, and Abstraction. Example: a Student class can store a student's name and provide a method to display it.";
        }

        if (q.includes("html")) {
            return "HTML creates the structure of a web page. Example:\n\n<h1>Welcome</h1>\n<p>This is my first page.</p>\n\nSave the file as index.html and open it in your browser.";
        }

        if (q.includes("css")) {
            return "CSS controls the appearance of a web page. Example:\n\nh1 {\n  color: purple;\n  text-align: center;\n}\n\nAdd this to your CSS file to style your heading.";
        }

        if (q.includes("javascript") || q.includes(" js")) {
            return "JavaScript makes a website interactive. Example:\n\nconst name = 'Shraddha';\nconsole.log('Hello ' + name);\n\nThis prints a greeting in the browser console.";
        }

        if (q.includes("python")) {
            return "Python is a beginner-friendly programming language. Example:\n\nfirst = int(input('Enter first number: '))\nsecond = int(input('Enter second number: '))\nprint('Sum =', first + second)\n\nThis program accepts two numbers and prints their sum.";
        }

        if (q.includes("study plan") || q.includes("roadmap")) {
            return "Here is a simple daily study plan:\n1. Revise one programming concept.\n2. Practise two coding questions.\n3. Spend time on HTML, CSS, or JavaScript.\n4. Revise your notes.\n5. Review mistakes and plan tomorrow's study.";
        }

        if (q.includes("error") || q.includes("debug")) {
            return "To debug an error:\n1. Read the complete error message.\n2. Check the file name and line number.\n3. Review brackets, semicolons, and variable names.\n4. Test one change at a time.\n\nYou can paste your error message here, but this demo cannot inspect or run your project automatically.";
        }

        if (q.includes("c++") || q.includes("c#") ||
            q.includes("program") || q.includes("code") ||
            q.includes("coding")) {
            return "Let's solve it step by step! First identify the input, then the required logic, and finally the expected output. Please mention the programming language and exact question so I can give a more useful example. This version uses built-in demo responses, not a live AI model.";
        }

        return "Thanks for your question! This is the SkillPath assistant demo. It currently answers a few common programming topics using built-in examples. A secure backend and AI API connection are needed for genuine AI answers to general questions.";
    }

    chatForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const question = input.value.trim();
        if (!question) return;

        addMessage(question, "user");
        input.value = "";

        addMessage(getDemoAnswer(question), "assistant");
    });

    document.querySelectorAll(".ai-suggestion").forEach(function (button) {
        button.addEventListener("click", function () {
            input.value = button.dataset.prompt || "";
            input.focus();
        });
    });

    document.querySelectorAll(".ai-language-chips button").forEach(function (button) {
        button.addEventListener("click", function () {
            input.value = "Teach me " + button.dataset.topic +
                " with a simple example and practice question.";
            input.focus();
        });
    });

    clearButton.addEventListener("click", function () {
        messages.querySelectorAll(".ai-message").forEach(function (message) {
            message.remove();
        });

        if (emptyState) emptyState.style.display = "block";
    });
})();