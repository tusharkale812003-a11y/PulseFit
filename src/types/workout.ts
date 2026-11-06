export type MuscleGroup = 
  | 'Abs' 
  | 'Core' 
  | 'Chest' 
  | 'Back' 
  | 'Arms' 
  | 'Shoulders' 
  | 'Legs' 
  | 'Glutes' 
  | 'Full Body' 
  | 'Cardio';

export type WorkoutCategory = 
  | 'abs' 
  | 'fullbody' 
  | 'cardio' 
  | 'pushpull' 
  | 'lowerbody';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type AnimationType = 
  | 'jumping_jacks'
  | 'plank'
  | 'pushups'
  | 'squats'
  | 'crunches'
  | 'lunges'
  | 'burpees'
  | 'mountain_climbers'
  | 'high_knees'
  | 'leg_raises'
  | 'tricep_dips'
  | 'bicycle_crunches'
  | 'glute_bridges'
  | 'superman'
  | 'wall_sit'
  | 'russian_twists';

export interface Exercise {
  id: string;
  name: string;
  category: WorkoutCategory;
  durationSeconds: number; // in seconds
  repsText?: string; // e.g. "15 Reps" or "30s"
  targetMuscles: MuscleGroup[];
  instructions: string[];
  proTips: string;
  animationType: AnimationType;
  caloriesPerMinute: number;
  videoUrl?: string; // path to 4-sec video/gif loop (e.g., /videos/squats.mp4 or squats.gif)
  thumbnailUrl?: string; // path to 3D exercise image thumbnail
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  subtitle: string;
  category: WorkoutCategory;
  level: DifficultyLevel;
  estimatedDurationMin: number;
  estimatedCalories: number;
  exercises: Exercise[];
  defaultRestSeconds: number;
  imageUrl?: string;
  isCustom?: boolean;
}

export interface WorkoutLog {
  id: string;
  date: string; // ISO string
  routineId: string;
  routineTitle: string;
  category: WorkoutCategory;
  durationSeconds: number;
  caloriesBurned: number;
  exercisesCompleted: number;
  totalExercises: number;
}

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalWorkouts: number;
  totalMinutes: number;
  totalCalories: number;
  lastWorkoutDate: string | null; // YYYY-MM-DD
  completedDates: string[]; // ['2026-11-01', '2026-11-02', ...]
}

export interface UserSettings {
  soundBeeps: boolean;
  voiceGuidance: boolean;
  prepDurationSeconds: number; // 3, 5, or 10s
  defaultRestSeconds: number; // 15, 30, or 45s
  theme: 'dark' | 'light';
}
