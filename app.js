// app.js

// --- 1. WORKOUT TEMPLATES ---
const workoutTemplates = {
  A: {
    title: "Workout A: Push & Drive",
    exercises: [
      { name: "Incline Smith Press (30°)", sets: 3, reps: "8–10" },
      { name: "Dips (Leaning Forward)", sets: 3, reps: "10–12" },
      { name: "DB Shoulder Press (Seated)", sets: 3, reps: "8–10" },
      { name: "Goblet Squats (Heavy DB)", sets: 3, reps: "10–12" },
      { name: "Cable Overhead Tricep Ext.", sets: 3, reps: "12–15", notes: "Drop Set" },
      { name: "Cable Woodchoppers", sets: 3, reps: "12 per side", notes: "Rotational power" }
    ]
  },
  B: {
    title: "Workout B: Postural Pull",
    exercises: [
      { name: "Weighted Pull-Ups", sets: 3, reps: "8–10" },
      { name: "Seated Cable Row (Wide Bar)", sets: 3, reps: "10–12" },
      { name: "Lat Pulldown (V-Grip)", sets: 3, reps: "10–12" },
      { name: "Single-Leg RDL (Dumbbell)", sets: 3, reps: "10–12 per leg" },
      { name: "Incline DB Curls", sets: 3, reps: "10–12", notes: "Drop Set" },
      { name: "Behind-the-Back Barbell Shrugs", sets: 3, reps: "12–15", notes: "Grip stability/traps" }
    ]
  },
  C: {
    title: "Workout C: Structural Stability",
    exercises: [
      { name: "Cable Lateral Raises", sets: 3, reps: "12–15" },
      { name: "Face Pulls (Rope)", sets: 3, reps: "15–20" },
      { name: "Hammer Curls (Rope)", sets: 3, reps: "10–12" },
      { name: "Bulgarian Split Squats", sets: 3, reps: "8–12 per leg" },
      { name: "Pec Flys (Machine/Cable)", sets: 3, reps: "12–15", notes: "Drop Set" },
      { name: "Pallof Press", sets: 3, reps: "12 per side", notes: "Core stability" }
    ]
  }
};

// --- 2. DOM ELEMENTS ---
const workoutSelect = document.getElementById('workout-plan');
const workoutDisplay = document.getElementById('workout-display');
const saveBtn = document.getElementById('save-btn');

// --- 3. HELPER FUNCTION: GET PAST DATA ---
// Searches local storage for the most recent log of a specific exercise & set
function getLastPerformance(exerciseName, setIndex) {
    const history = JSON.parse(localStorage.getItem('gainsHistory')) || [];
    
    // Loop backwards to find the most recent entry
    for (let i = history.length - 1; i >= 0; i--) {
        const entry = history[i];
        if (entry.exercises && entry.exercises[exerciseName] && entry.exercises[exerciseName][setIndex]) {
            const weight = entry.exercises[exerciseName][setIndex].weight;
            if (weight) { // Only return if they actually logged a weight
                return { weight: weight, date: entry.date };
            }
        }
    }
    return null;
}

// --- 4. CORE FUNCTIONS ---
function renderWorkout(workoutKey) {
  workoutDisplay.innerHTML = '';

  if (!workoutKey) {
    saveBtn.style.display = 'none';
    return;
  }

  const workout = workoutTemplates[workoutKey];
  
  workout.exercises.forEach((exercise, index) => {
    const card = document.createElement('div');
    card.classList.add('exercise-card');
    
    const header = document.createElement('div');
    header.classList.add('exercise-header');
    header.innerHTML = `
        <h3>${index + 1}. ${exercise.name}</h3>
        ${exercise.notes ? `<span class="exercise-notes">${exercise.notes}</span>` : ''}
    `;
    card.appendChild(header);

    for (let i = 0; i < exercise.sets; i++) {
      const setRow = document.createElement('div');
      setRow.classList.add('set-row');
      
      // Look up past data for this specific set
      const lastPerf = getLastPerformance(exercise.name, i);
      let lastPerfHTML = '';
      if (lastPerf) {
          // If data exists, create the mini text underneath the label
          lastPerfHTML = `<div class="last-perf">Prev: ${lastPerf.weight} lbs (${lastPerf.date})</div>`;
      }

      setRow.innerHTML = `
          <div class="set-label-container">
              <label>Set ${i + 1}</label>
              ${lastPerfHTML}
          </div>
          <div class="set-inputs">
              <input type="number" placeholder="Lbs" class="weight-input" data-exercise="${exercise.name}" data-set="${i}">
              <input type="text" value="${exercise.reps}" class="reps-input" data-exercise="${exercise.name}" data-set="${i}">
          </div>
      `;
      card.appendChild(setRow);
    }
    
    workoutDisplay.appendChild(card);
  });

  saveBtn.style.display = 'block';
}

// --- 5. EVENT LISTENERS ---
workoutSelect.addEventListener('change', (e) => {
  renderWorkout(e.target.value);
});

// The Save Logic
saveBtn.addEventListener('click', () => {
    const currentWorkoutKey = workoutSelect.value;
    if (!currentWorkoutKey) return;

    // Create a new record with today's date
    const dateStr = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const workoutRecord = {
        id: Date.now(),
        date: dateStr,
        workoutKey: currentWorkoutKey,
        exercises: {}
    };

    // Grab all input fields on the screen
    const weightInputs = document.querySelectorAll('.weight-input');
    const repsInputs = document.querySelectorAll('.reps-input');

    // Loop through inputs and pack them into our record object
    weightInputs.forEach((wInput, index) => {
        const exName = wInput.getAttribute('data-exercise');
        const setIdx = wInput.getAttribute('data-set');
        const rInput = repsInputs[index];

        if (!workoutRecord.exercises[exName]) {
            workoutRecord.exercises[exName] = [];
        }

        workoutRecord.exercises[exName][setIdx] = {
            weight: wInput.value,
            reps: rInput.value
        };
    });

    // Save it to the browser's local storage
    const history = JSON.parse(localStorage.getItem('gainsHistory')) || [];
    history.push(workoutRecord);
    localStorage.setItem('gainsHistory', JSON.stringify(history));

    // Give feedback and refresh the UI to show the new "Prev" weights!
    alert("Workout Saved! Great push today.");
    renderWorkout(currentWorkoutKey);
});
