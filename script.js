class HabitTracker {
    constructor() {
        this.habits = JSON.parse(localStorage.getItem('habits')) || [];
        this.setupEventListeners();
        this.renderHabits();
        this.setupThemeToggle();
    }

    setupEventListeners() {
        document.getElementById('add-habit-btn').addEventListener('click', () => this.addHabit());
        document.getElementById('habit-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addHabit();
        });
    }

    setupThemeToggle() {
        const themeSwitch = document.getElementById('theme-switch');
        themeSwitch.addEventListener('change', () => {
            document.body.classList.toggle('dark-mode');
            this.updateLocalStorageTheme();
        });

        // Check previous theme preference
        if (localStorage.getItem('dark-mode') === 'true') {
            themeSwitch.checked = true;
            document.body.classList.add('dark-mode');
        }
    }

    updateLocalStorageTheme() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('dark-mode', isDarkMode);
    }

    addHabit() {
        const habitInput = document.getElementById('habit-input');
        const habitName = habitInput.value.trim();

        if (habitName) {
            const newHabit = {
                id: Date.now(),
                name: habitName,
                days: Array(7).fill(false),
                progress: 0
            };

            this.habits.push(newHabit);
            this.saveHabits();
            this.renderHabits();
            habitInput.value = '';
        }
    }

    renderHabits() {
        const container = document.getElementById('habits-container');
        container.innerHTML = '';

        this.habits.forEach(habit => {
            const habitElement = this.createHabitElement(habit);
            container.appendChild(habitElement);
        });
    }

    createHabitElement(habit) {
        const habitItem = document.createElement('div');
        habitItem.classList.add('habit-item');
        if (document.body.classList.contains('dark-mode')) {
            habitItem.classList.add('dark-mode');
        }

        habitItem.innerHTML = `
            <div class="habit-header">
                <h3>${habit.name}</h3>
                <button class="delete-habit" data-id="${habit.id}">🗑️</button>
            </div>
            <div class="habit-tracker">
                ${this.createDayTrackers(habit)}
            </div>
            <div class="progress-bar">
                <div class="progress-indicator" style="width: ${habit.progress}%"></div>
            </div>
        `;

        this.attachHabitEventListeners(habitItem, habit);
        return habitItem;
    }

    createDayTrackers(habit) {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return days.map((day, index) => `
            <div 
                class="day-tracker ${habit.days[index] ? 'completed' : ''}" 
                data-day="${index}"
            >
                ${day}
            </div>
        `).join('');
    }

    attachHabitEventListeners(habitElement, habit) {
        // Day tracker click events
        habitElement.querySelectorAll('.day-tracker').forEach((dayElement, index) => {
            dayElement.addEventListener('click', () => {
                habit.days[index] = !habit.days[index];
                this.updateHabitProgress(habit);
                this.saveHabits();
                this.renderHabits();
            });
        });

        // Delete habit event
        const deleteBtn = habitElement.querySelector('.delete-habit');
        deleteBtn.addEventListener('click', () => {
            this.habits = this.habits.filter(h => h.id !== habit.id);
            this.saveHabits();
            this.renderHabits();
        });
    }

    updateHabitProgress(habit) {
        habit.progress = (habit.days.filter(Boolean).length / habit.days.length) * 100;
    }

    saveHabits() {
        localStorage.setItem('habits', JSON.stringify(this.habits));
    }
}

// Initialize the Habit Tracker when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new HabitTracker();
});