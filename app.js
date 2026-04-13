// app.js
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

console.log("Workout templates loaded and ready for gains.");
