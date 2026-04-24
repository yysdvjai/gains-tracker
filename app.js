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

// --- 2. DOM ELEMENTS & GLOBALS ---
const workoutSelect = document.getElementById('workout-plan');
const workoutDisplay = document.getElementById('workout-display');
const saveBtn = document.getElementById('save-btn');
let activeCharts = {}; // Keeps track of open graphs so we don't duplicate them

// --- 3. HELPER FUNCTIONS ---
function getPerformanceStats(exerciseName, setIndex) {
    const history = JSON.parse(localStorage.getItem('gainsHistory')) || [];
    let lastPerf = null;
    let maxPerf = { weight: 0, date: null };

    for (let i = history.length - 1; i >= 0; i--) {
        const entry = history[i];
        if (entry.exercises && entry.exercises[exerciseName] && entry.exercises[exerciseName][setIndex]) {
            const weightVal = parseFloat(entry.exercises[exerciseName][setIndex].weight);
            if (!isNaN(weightVal)) {
                if (!lastPerf) lastPerf = { weight: weightVal, date: entry.date };
                if (weightVal > maxPerf.weight) maxPerf = { weight: weightVal, date: entry.date };
            }
        }
    }
    return { last: lastPerf, max: maxPerf };
}

// Scans history and calculates the average weight lifted per month for a specific exercise
function getMonthlyAverages(exerciseName) {
    const history = JSON.parse(localStorage.getItem('gainsHistory')) || [];
    const monthlyData = {};

    history.forEach(entry => {
        if (entry.exercises && entry.exercises[exerciseName]) {
            const dateObj = new Date(entry.id); // We use the timestamp we saved
            const monthYear = dateObj.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
            
            let daySum = 0;
            let dayCount = 0;

            // Calculate the average weight lifted on this specific day
            entry.exercises[exerciseName].forEach(set => {
                if (set && set.weight && !isNaN(parseFloat(set.weight))) {
                    daySum += parseFloat(set.weight);
                    dayCount++;
                }
            });

            if (dayCount > 0) {
                const dayAvg = daySum / dayCount;
                if (!monthlyData[monthYear]) {
                    monthlyData[monthYear] = { sum: 0, count: 0, timestamp: dateObj.getTime() };
                }
                // Add day average to the month's total pool
                monthlyData[monthYear].sum += dayAvg;
                monthlyData[monthYear].count++;
            }
        }
    });

    // Sort by actual chronological order, not alphabetical
    const sortedMonths = Object.keys(monthlyData).sort((a, b) => monthlyData[a].timestamp - monthlyData[b].timestamp);
    const labels = [];
    const data = [];

    sortedMonths.forEach(month => {
        labels.push(month);
        data.push((monthlyData[month].sum / monthlyData[month].count).toFixed(1)); // Math: Average of the month
    });

    return { labels, data };
}

// Draws the actual Chart.js Graph
function drawChart(exerciseName, index) {
    const stats = getMonthlyAverages(exerciseName);

    if (stats.labels.length === 0) {
        alert("Not enough data to graph yet! Log at least one set of this exercise.");
        document.getElementById(`chart-container-${index}`).style.display = 'none';
        return;
    }

    const ctx = document.getElementById(`canvas-${index}`).getContext('2d');

    // Destroy old chart if it exists so they don't glitch over each other
    if (activeCharts[index]) activeCharts[index].destroy();

    // Create the sleek line chart
    activeCharts[index] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: stats.labels,
            datasets: [{
                label: 'Avg Weight (kg)',
                data: stats.data,
                backgroundColor: 'rgba(255, 87, 34, 0.2)', // Transparent orange fill
                borderColor: '#ff5722', // Solid orange line
                borderWidth: 3,
                pointBackgroundColor: '#fff',
                pointRadius: 4,
                fill: true,
                tension: 0.3 // Gives it a slight curve
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { grid: { color: '#333' } },
                x: { grid: { display: false } }
            },
            plugins: { legend: { display: false } } // Hides the top label to save space
        }
    });
}

// --- 4. CORE ENGINE ---
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
    
    // NEW: We updated the header to include the Chart button
    const header = document.createElement('div');
    header.classList.add('exercise-header');
    header.innerHTML = `
        <div class="exercise-title-group">
            <h3>${index + 1}. ${exercise.name}</h3>
            ${exercise.notes ? `<span class="exercise-notes">${exercise.notes}</span>` : ''}
        </div>
        <button class="performance-btn">📈 Chart</button>
    `;
    card.appendChild(header);

    // NEW: Hidden chart container
    const chartDiv = document.createElement('div');
    chartDiv.classList.add('chart-container');
    chartDiv.id = `chart-container-${index}`;
    chartDiv.style.display = 'none';
    chartDiv.innerHTML = `<canvas id="canvas-${index}"></canvas>`;
    card.appendChild(chartDiv);

    // Make the Chart button work
    const chartBtn = header.querySelector('.performance-btn');
    chartBtn.addEventListener('click', () => {
        const isHidden = chartDiv.style.display === 'none';
        if (isHidden) {
            chartDiv.style.display = 'block';
            drawChart(exercise.name, index);
        } else {
            chartDiv.style.display = 'none'; // Close it if clicked again
        }
    });

    for (let i = 0; i < exercise.sets; i++) {
      const setRow = document.createElement('div');
      setRow.classList.add('set-row');
      
      const stats = getPerformanceStats(exercise.name, i);
      let statsHTML = '<div class="stats-row">';
      if (stats.last) statsHTML += `<span class="stat-badge">Last time: ${stats.last.weight} kg (${stats.last.date})</span>`;
      if (stats.max && stats.max.weight > 0) statsHTML += `<span class="stat-badge max-badge">Max: ${stats.max.weight} kg (${stats.max.date})</span>`;
      statsHTML += '</div>';

      setRow.innerHTML = `
          <div class="set-label-container">
              <label>Set ${i + 1}</label>
              ${statsHTML}
          </div>
          <div class="set-inputs">
              <input type="number" placeholder="kg" class="weight-input" data-exercise="${exercise.name}" data-set="${i}">
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

    renderWorkout(currentWorkoutKey);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const originalText = saveBtn.innerText;
    saveBtn.innerText = "✓ Saved Successfully";
    saveBtn.style.background = "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)";
    setTimeout(() => {
        saveBtn.innerText = originalText;
        saveBtn.style.background = "linear-gradient(135deg, #ff5722 0%, #e64a19 100%)";
    }, 2000);
});
