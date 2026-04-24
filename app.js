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

// --- 3. HELPER FUNCTION: GET STATS (LAST & MAX) ---
// Scans history to find the most recent weight and the highest weight ever lifted
function getPerformanceStats(exerciseName, setIndex) {
    const history = JSON.parse(localStorage.getItem('gainsHistory')) || [];
    
    let lastPerf = null;
    let maxWeight = 0;

    // Loop backward through history to find the newest entry first
    for (let i = history.length - 1; i >= 0; i--) {
        const entry = history[i];
        
        if (entry.exercises && entry.exercises[exerciseName] && entry.exercises[exerciseName][setIndex]) {
            const weightVal = parseFloat(entry.exercises[exerciseName][setIndex].weight);
            
            // Make sure it's a valid number
            if (!isNaN(weightVal)) {
                // If we haven't found the "Last time" yet, this first one we hit is it
                if (!lastPerf) {
                    lastPerf = { weight: weightVal, date: entry.date };
                }
                
                // Compare every valid weight to find the absolute maximum
                if (weightVal > maxWeight) {
                    maxWeight = weightVal;
                }
            }
        }
    }
    
    return { last: lastPerf, max: maxWeight };
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
      
      // Get our Last Time and Max stats
      const stats = getPerformanceStats(exercise.name, i);
      let statsHTML = '<div class="stats-row">';
      
      if (stats.last) {
          statsHTML += `<span class="stat-badge">Last time: ${stats.last.weight} lbs</span>`;
      }
      if (stats.max > 0) {
          statsHTML += `<span class="stat-badge max-badge">Max: ${stats.max} lbs</span>`;
      }
      statsHTML += '</div>';

      setRow.innerHTML = `
          <div class="set-label-container">
              <label>Set ${i + 1}</label>
              ${statsHTML}
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

    const dateStr = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const workoutRecord = {
        id: Date.now(),
        date: dateStr,
        workoutKey: currentWorkoutKey,
        exercises: {}
    };

    const weightInputs = document.querySelectorAll('.weight-input');
    const repsInputs = document.querySelectorAll('.reps-input');

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

    const history = JSON.parse(localStorage.getItem('gainsHistory')) || [];
    history.push(workoutRecord);
    localStorage.setItem('gainsHistory', JSON.stringify(history));

    // Reload the screen to instantly show the updated Max and Last Time stats!
    renderWorkout(currentWorkoutKey);
    
    // Smooth scrolling to top to show success
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Temporarily change button text for visual feedback
    const originalText = saveBtn.innerText;
    saveBtn.innerText = "✓ Saved Successfully";
    saveBtn.style.background = "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)";
    
    setTimeout(() => {
        saveBtn.innerText = originalText;
        saveBtn.style.background = "linear-gradient(135deg, #ff5722 0%, #e64a19 100%)";
    }, 2000);
});
