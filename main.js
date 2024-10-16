document.addEventListener('DOMContentLoaded', () => {
    // Mock data for demonstration purposes
    let userXP = 0;
    let userLevel = 1;
    const projects = [];

    // DOM Elements
    const xpBarFill = document.getElementById('xp-bar-fill');
    const userLevelSpan = document.getElementById('user-level');
    const totalXPSpan = document.getElementById('total-xp');
    const projectList = document.getElementById('project-list');
    const addProjectButton = document.getElementById('add-project');

    // Update XP Bar
    function updateXPBar() {
        const nextLevelXP = userLevel * 1000;
        const progress = (userXP / nextLevelXP) * 100;
    
        gsap.to('#xp-bar-fill', {
            width: `${progress}%`,
            duration: 1.5,
            ease: 'power4.out'
        });
    
        userLevelSpan.textContent = userLevel;
        totalXPSpan.textContent = userXP;
    }

    // Level Up Logic
    function checkLevelUp() {
        const nextLevelXP = userLevel * 1000;
        if (userXP >= nextLevelXP) {
            userXP -= nextLevelXP;
            userLevel++;
            displayLevelUpNotification();
            updateXPBar();
        }
    }

    // Add Project
    function addProject() {
        const projectName = prompt('Enter the name of the new project:');
        if (projectName) {
            const difficulty = prompt('Enter project difficulty (1-5):');
            if (difficulty && !isNaN(difficulty) && difficulty >= 1 && difficulty <= 5) {
                const project = {
                    name: projectName,
                    difficulty: parseInt(difficulty),
                    completed: false
                };
                projects.push(project);
                renderProjects();
            } else {
                alert('Please enter a valid difficulty between 1 and 5.');
            }
        }
    }

    // Render Projects
    function renderProjects() {
        projectList.innerHTML = '';
        projects.forEach((project, index) => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <h3>${project.name}</h3>
                <p>Difficulty: ${project.difficulty}</p>
                <button onclick="completeProject(${index})">${project.completed ? 'Completed' : 'Complete Project'}</button>
            `;
            projectList.appendChild(projectCard);
        });
    }

    // Complete Project
    window.completeProject = function (index) {
        const project = projects[index];
        if (!project.completed) {
            project.completed = true;
            userXP += project.difficulty * 100;
            checkLevelUp();
            renderProjects();
            updateXPBar();
        }
    }

    // Display Level-Up Notification
    function displayLevelUpNotification() {
        alert(`Congratulations! You've reached Level ${userLevel}!`);
        // Trigger a confetti animation to celebrate the user's level-up
        confetti({
            particleCount: 150,
            spread: 60,
            origin: { y: 0.6 }
        });
    }

    // Event Listeners
    addProjectButton.addEventListener('click', addProject);

    // Initial Render
    updateXPBar();
    renderProjects();
});