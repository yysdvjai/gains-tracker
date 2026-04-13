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

// --- 3. EVENT LISTENERS ---
// Listen for when you pick a workout from the dropdown
workoutSelect.addEventListener('change', (e) => {
  const selectedWorkout = e.target.value;
  renderWorkout(selectedWorkout);
});

// Listen for the save button click (Placeholder for now)
saveBtn.addEventListener('click', () => {
    alert("Boom! Workout finished. (In the next step, we will connect this to a database to save your numbers).");
});

// --- 4. CORE FUNCTIONS ---
function renderWorkout(workoutKey) {
  // Clear the display area first
  workoutDisplay.innerHTML = '';

  // If you select the default "-- Select Workout --", hide the save button and stop
  if (!workoutKey) {
    saveBtn.style.display = 'none';
    return;
  }

  // Get the correct workout data
  const workout = workoutTemplates[workoutKey];
  
  // Loop through each exercise and build the HTML cards
  workout.exercises.forEach((exercise, index) => {
    
    // Create the main card container
    const card = document.createElement('div');
    card.classList.add('exercise-card');
    
    // Create the header (Exercise name and notes)
    const header = document.createElement('div');
    header.classList.add('exercise-header');
    header.innerHTML = `
        <h3>${index + 1}. ${exercise.name}</h3>
        ${exercise.notes ? `<span class="exercise-notes">${exercise.notes}</span>` : ''}
    `;
    card.appendChild(header);

    // Generate the rows for the sets
    for (let i = 1; i <= exercise.sets; i++) {
      const setRow = document.createElement('div');
      setRow.classList.add('set-row');
      
      // Notice how we use the template's 'reps' as the default value in the input box, 
      // allowing you to overwrite it if you under/overperform.
      setRow.innerHTML = `
          <label>Set ${i}</label>
          <div class="set-inputs">
              <input type="number" placeholder="Weight" class="weight-input">
              <input type="text" value="${exercise.reps}" class="reps-input">
          </div>
      `;
      card.appendChild(setRow);
    }
    
    // Add the finished card to the screen
    workoutDisplay.appendChild(card);
  });

  // Show the save button now that the workout is loaded
  saveBtn.style.display = 'block';
}
