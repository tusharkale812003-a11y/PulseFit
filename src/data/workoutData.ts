import { Exercise, WorkoutRoutine, WorkoutCategory } from '../types/workout';

export const MASTER_EXERCISES: Record<string, Exercise> = {
  jumping_jacks: {
    id: 'jumping_jacks',
    name: 'Jumping Jacks',
    category: 'cardio',
    durationSeconds: 30,
    repsText: '30 sec',
    targetMuscles: ['Cardio', 'Full Body', 'Legs'],
    instructions: [
      'Stand upright with feet together and arms at your sides.',
      'Jump feet outward while raising arms above your head.',
      'Quickly jump back to starting position and repeat with steady rhythm.'
    ],
    proTips: 'Land lightly on the balls of your feet to protect your knees and ankles.',
    animationType: 'jumping_jacks',
    caloriesPerMinute: 9
  },
  pushups: {
    id: 'pushups',
    name: 'Standard Push-ups',
    category: 'pushpull',
    durationSeconds: 35,
    repsText: '12-15 reps',
    targetMuscles: ['Chest', 'Arms', 'Shoulders', 'Core'],
    instructions: [
      'Place palms slightly wider than shoulder-width, body in rigid straight plank.',
      'Lower chest towards floor until elbows bend to 90 degrees.',
      'Push forcefully back up to start without locking elbows.'
    ],
    proTips: 'Keep your core braced tight; don\'t let your lower back sag or hips hike.',
    animationType: 'pushups',
    caloriesPerMinute: 8
  },
  plank: {
    id: 'plank',
    name: 'Elbow Plank',
    category: 'abs',
    durationSeconds: 40,
    repsText: '40 sec hold',
    targetMuscles: ['Abs', 'Core', 'Shoulders'],
    instructions: [
      'Rest on forearms with elbows beneath shoulders and legs extended back.',
      'Engage glutes and core to keep body in a level line from head to heels.',
      'Breathe steadily while maintaining abdominal tension.'
    ],
    proTips: 'Focus on pulling your belly button toward your spine; never hold your breath.',
    animationType: 'plank',
    caloriesPerMinute: 5
  },
  squats: {
    id: 'squats',
    name: 'Bodyweight Squats',
    category: 'lowerbody',
    durationSeconds: 35,
    repsText: '15 reps',
    targetMuscles: ['Legs', 'Glutes', 'Core'],
    instructions: [
      'Stand feet shoulder-width apart, toes turned slightly outward.',
      'Hinge at hips and bend knees, lowering thighs parallel to floor.',
      'Drive through heels to stand upright, squeezing glutes at the top.'
    ],
    proTips: 'Keep chest tall and make sure knees track in line with toes, not caving inward.',
    animationType: 'squats',
    caloriesPerMinute: 8
  },
  crunches: {
    id: 'crunches',
    name: 'Abdominal Crunches',
    category: 'abs',
    durationSeconds: 30,
    repsText: '20 reps',
    targetMuscles: ['Abs', 'Core'],
    instructions: [
      'Lie flat with knees bent and feet flat on the floor.',
      'Fingertips gently touching temples (don\'t pull on neck).',
      'Contract abdominals to lift shoulder blades 2-3 inches off the ground, then lower.'
    ],
    proTips: 'Exhale as you contract upward, inhale as you slowly return down.',
    animationType: 'crunches',
    caloriesPerMinute: 6
  },
  lunges: {
    id: 'lunges',
    name: 'Alternating Lunges',
    category: 'lowerbody',
    durationSeconds: 35,
    repsText: '16 reps (8/side)',
    targetMuscles: ['Legs', 'Glutes', 'Core'],
    instructions: [
      'Step forward with right foot, lowering hips until both knees bend to 90 degrees.',
      'Keep front knee directly above front ankle; back knee hovers just above ground.',
      'Push off front foot back to starting position and repeat with left leg.'
    ],
    proTips: 'Maintain an upright torso; don\'t lean your chest over your forward thigh.',
    animationType: 'lunges',
    caloriesPerMinute: 8
  },
  mountain_climbers: {
    id: 'mountain_climbers',
    name: 'Mountain Climbers',
    category: 'cardio',
    durationSeconds: 30,
    repsText: '30 sec speed',
    targetMuscles: ['Cardio', 'Abs', 'Shoulders', 'Legs'],
    instructions: [
      'Start in high push-up plank position with hands under shoulders.',
      'Drive right knee rapidly toward chest, tap, and kick back.',
      'Instantly drive left knee forward, alternating legs in a running motion.'
    ],
    proTips: 'Keep hips low and shoulders stacked directly over your wrists.',
    animationType: 'mountain_climbers',
    caloriesPerMinute: 10
  },
  high_knees: {
    id: 'high_knees',
    name: 'High Knee Sprints',
    category: 'cardio',
    durationSeconds: 30,
    repsText: '30 sec sprint',
    targetMuscles: ['Cardio', 'Legs', 'Abs'],
    instructions: [
      'Run in place while driving knees up as close to hip height as possible.',
      'Pump arms rhythmically in coordination with legs.',
      'Maintain an athletic forward lean and land gently on balls of feet.'
    ],
    proTips: 'Stay fast and light; pump your arms aggressively to drive more power.',
    animationType: 'high_knees',
    caloriesPerMinute: 11
  },
  bicycle_crunches: {
    id: 'bicycle_crunches',
    name: 'Bicycle Crunches',
    category: 'abs',
    durationSeconds: 35,
    repsText: '24 reps',
    targetMuscles: ['Abs', 'Core'],
    instructions: [
      'Lie on back with hands behind head, knees lifted at 90 degrees.',
      'Pedal right elbow toward left knee while extending right leg straight.',
      'Alternate sides smoothly with deliberate rotation through the ribcage.'
    ],
    proTips: 'Slow and controlled beats fast and sloppy; focus on rotational core squeeze.',
    animationType: 'bicycle_crunches',
    caloriesPerMinute: 7
  },
  russian_twists: {
    id: 'russian_twists',
    name: 'Russian Twists',
    category: 'abs',
    durationSeconds: 35,
    repsText: '20 twists',
    targetMuscles: ['Abs', 'Core'],
    instructions: [
      'Sit on floor, lean torso back at a 45-degree angle, lift feet slightly off floor.',
      'Clasp hands in front of chest and rotate torso smoothly from side to side.',
      'Touch knuckles near the floor beside your hip with each rotation.'
    ],
    proTips: 'Rotate from the ribs, not just swinging your arms.',
    animationType: 'russian_twists',
    caloriesPerMinute: 7
  },
  leg_raises: {
    id: 'leg_raises',
    name: 'Lying Leg Raises',
    category: 'abs',
    durationSeconds: 35,
    repsText: '15 reps',
    targetMuscles: ['Abs', 'Core'],
    instructions: [
      'Lie flat on your back, hands tucked under hips for lower back support.',
      'Keep legs straight and raise them until perpendicular to the floor.',
      'Slowly lower legs until hovering 2 inches above ground without arching back.'
    ],
    proTips: 'Press your lower back firmly into the floor throughout the entire movement.',
    animationType: 'leg_raises',
    caloriesPerMinute: 6
  },
  burpees: {
    id: 'burpees',
    name: 'Full Burpees',
    category: 'cardio',
    durationSeconds: 35,
    repsText: '10-12 reps',
    targetMuscles: ['Full Body', 'Cardio', 'Chest', 'Legs'],
    instructions: [
      'From standing, drop into a squat and place hands on floor.',
      'Kick feet back into a plank, quickly perform a push-up.',
      'Hop feet back up to hands and explosively jump straight upward with arms high.'
    ],
    proTips: 'Find a smooth pace you can sustain; don\'t burn out in the first 10 seconds.',
    animationType: 'burpees',
    caloriesPerMinute: 12
  },
  tricep_dips: {
    id: 'tricep_dips',
    name: 'Chair / Floor Tricep Dips',
    category: 'pushpull',
    durationSeconds: 30,
    repsText: '15 reps',
    targetMuscles: ['Arms', 'Chest', 'Shoulders'],
    instructions: [
      'Sit with hands gripping edge of a stable chair or floor behind hips.',
      'Slide hips off edge with legs bent in front, lowering body by bending elbows.',
      'Press through palms to straighten arms and lift back to top.'
    ],
    proTips: 'Keep your elbows pointing straight back rather than flaring out wide.',
    animationType: 'tricep_dips',
    caloriesPerMinute: 7
  },
  superman: {
    id: 'superman',
    name: 'Superman Holds',
    category: 'pushpull',
    durationSeconds: 30,
    repsText: '30 sec holds',
    targetMuscles: ['Back', 'Glutes', 'Core'],
    instructions: [
      'Lie face down on floor with arms and legs extended straight.',
      'Simultaneously raise arms, chest, and thighs off the floor.',
      'Hold the arched contraction for 2 seconds, lower slowly, and repeat.'
    ],
    proTips: 'Keep neck neutral by gazing slightly down, not craning backward.',
    animationType: 'superman',
    caloriesPerMinute: 6
  },
  glute_bridges: {
    id: 'glute_bridges',
    name: 'Glute Bridges',
    category: 'lowerbody',
    durationSeconds: 35,
    repsText: '18 reps',
    targetMuscles: ['Glutes', 'Legs', 'Core'],
    instructions: [
      'Lie on back with knees bent and feet flat, hip-width apart.',
      'Drive through heels to elevate hips until hips, knees, and shoulders form a line.',
      'Squeeze glutes hard at the apex for 1-2 seconds, then lower under control.'
    ],
    proTips: 'Don\'t over-arch your lumbar spine; hinge purely through the hips and glutes.',
    animationType: 'glute_bridges',
    caloriesPerMinute: 6
  },
  wall_sit: {
    id: 'wall_sit',
    name: 'Isometric Wall Sit',
    category: 'lowerbody',
    durationSeconds: 40,
    repsText: '40 sec hold',
    targetMuscles: ['Legs', 'Glutes', 'Core'],
    instructions: [
      'Lean back flat against a sturdy wall and slide down until thighs are parallel to floor.',
      'Ensure knees are bent at 90 degrees directly above ankles.',
      'Hold position with hands resting at sides or on chest, breathing smoothly.'
    ],
    proTips: 'Resist resting hands on thighs; distribute body weight evenly through heels.',
    animationType: 'wall_sit',
    caloriesPerMinute: 6
  }
};

export const HERO_BANNER_IMAGE = '/src/assets/images/hero_workout_banner_1793895260531.jpg';

export const BUILTIN_ROUTINES: WorkoutRoutine[] = [
  {
    id: 'routine-abs-core',
    title: 'Abs & Core Shredder',
    subtitle: 'Sculpt your midsection & build bulletproof trunk stability',
    category: 'abs',
    level: 'Beginner',
    estimatedDurationMin: 8,
    estimatedCalories: 65,
    defaultRestSeconds: 15,
    imageUrl: '/src/assets/images/category_abs_core_1793895261367.jpg',
    exercises: [
      MASTER_EXERCISES.crunches,
      MASTER_EXERCISES.plank,
      MASTER_EXERCISES.bicycle_crunches,
      MASTER_EXERCISES.russian_twists,
      MASTER_EXERCISES.leg_raises,
      MASTER_EXERCISES.mountain_climbers
    ]
  },
  {
    id: 'routine-full-body',
    title: 'Full Body Inferno',
    subtitle: 'Compound movements targeting every major muscle group',
    category: 'fullbody',
    level: 'Intermediate',
    estimatedDurationMin: 12,
    estimatedCalories: 110,
    defaultRestSeconds: 20,
    imageUrl: '/src/assets/images/hero_workout_banner_1793895260531.jpg',
    exercises: [
      MASTER_EXERCISES.jumping_jacks,
      MASTER_EXERCISES.squats,
      MASTER_EXERCISES.pushups,
      MASTER_EXERCISES.lunges,
      MASTER_EXERCISES.plank,
      MASTER_EXERCISES.burpees,
      MASTER_EXERCISES.glute_bridges,
      MASTER_EXERCISES.high_knees
    ]
  },
  {
    id: 'routine-cardio-hiit',
    title: 'Cardio HIIT Sweat',
    subtitle: 'Maximum calorie burn & cardiovascular stamina sprint',
    category: 'cardio',
    level: 'Advanced',
    estimatedDurationMin: 10,
    estimatedCalories: 125,
    defaultRestSeconds: 15,
    imageUrl: '/src/assets/images/category_fullbody_hiit_1793895261888.jpg',
    exercises: [
      MASTER_EXERCISES.jumping_jacks,
      MASTER_EXERCISES.mountain_climbers,
      MASTER_EXERCISES.high_knees,
      MASTER_EXERCISES.burpees,
      MASTER_EXERCISES.squats,
      MASTER_EXERCISES.jumping_jacks,
      MASTER_EXERCISES.mountain_climbers
    ]
  },
  {
    id: 'routine-push-pull',
    title: 'Push & Pull Bodyweight',
    subtitle: 'Upper body power, arm definition & posture reinforcement',
    category: 'pushpull',
    level: 'Intermediate',
    estimatedDurationMin: 11,
    estimatedCalories: 85,
    defaultRestSeconds: 20,
    imageUrl: '/src/assets/images/category_pushpull_calisthenics_1793895262530.jpg',
    exercises: [
      MASTER_EXERCISES.pushups,
      MASTER_EXERCISES.superman,
      MASTER_EXERCISES.tricep_dips,
      MASTER_EXERCISES.pushups,
      MASTER_EXERCISES.superman,
      MASTER_EXERCISES.tricep_dips,
      MASTER_EXERCISES.plank
    ]
  },
  {
    id: 'routine-lower-body',
    title: 'Lower Body & Glute Sculpt',
    subtitle: 'Strengthen quads, hamstrings, calves and firm glutes',
    category: 'lowerbody',
    level: 'Beginner',
    estimatedDurationMin: 10,
    estimatedCalories: 90,
    defaultRestSeconds: 20,
    imageUrl: '/src/assets/images/category_lowerbody_squats_1793895262517.jpg',
    exercises: [
      MASTER_EXERCISES.squats,
      MASTER_EXERCISES.lunges,
      MASTER_EXERCISES.glute_bridges,
      MASTER_EXERCISES.wall_sit,
      MASTER_EXERCISES.squats,
      MASTER_EXERCISES.lunges
    ]
  },
  {
    id: 'routine-quick-7min',
    title: 'Scientific 7-Minute Quick Burn',
    subtitle: 'High intensity circuit for busy days & fast metabolism boost',
    category: 'fullbody',
    level: 'Beginner',
    estimatedDurationMin: 7,
    estimatedCalories: 75,
    defaultRestSeconds: 15,
    imageUrl: '/src/assets/images/hero_workout_banner_1793895260531.jpg',
    exercises: [
      MASTER_EXERCISES.jumping_jacks,
      MASTER_EXERCISES.wall_sit,
      MASTER_EXERCISES.pushups,
      MASTER_EXERCISES.crunches,
      MASTER_EXERCISES.squats,
      MASTER_EXERCISES.tricep_dips,
      MASTER_EXERCISES.plank,
      MASTER_EXERCISES.high_knees,
      MASTER_EXERCISES.lunges,
      MASTER_EXERCISES.pushups
    ]
  }
];

export const CATEGORY_INFO: Record<WorkoutCategory, { label: string; icon: string; description: string; color: string; bgClass: string; imageUrl: string }> = {
  abs: {
    label: 'Abs & Core',
    icon: 'Shield',
    description: 'Target upper & lower abs, obliques, and deep stabilizing core',
    color: 'text-amber-500',
    bgClass: 'from-amber-500/20 to-orange-500/10',
    imageUrl: '/src/assets/images/category_abs_core_1793895261367.jpg'
  },
  fullbody: {
    label: 'Full Body',
    icon: 'Zap',
    description: 'Total-body kinetic conditioning for total strength and tone',
    color: 'text-orange-500',
    bgClass: 'from-orange-500/20 to-red-500/10',
    imageUrl: '/src/assets/images/hero_workout_banner_1793895260531.jpg'
  },
  cardio: {
    label: 'Cardio HIIT',
    icon: 'Flame',
    description: 'Elevate heart rate, melt fat, and build athletic endurance',
    color: 'text-rose-500',
    bgClass: 'from-rose-500/20 to-pink-500/10',
    imageUrl: '/src/assets/images/category_fullbody_hiit_1793895261888.jpg'
  },
  pushpull: {
    label: 'Push & Pull',
    icon: 'Dumbbell',
    description: 'Calisthenics strength targeting chest, back, arms, and deltoids',
    color: 'text-cyan-500',
    bgClass: 'from-cyan-500/20 to-blue-500/10',
    imageUrl: '/src/assets/images/category_pushpull_calisthenics_1793895262530.jpg'
  },
  lowerbody: {
    label: 'Lower Body',
    icon: 'Activity',
    description: 'Power up quads, hamstrings, glute activation, and calves',
    color: 'text-emerald-500',
    bgClass: 'from-emerald-500/20 to-teal-500/10',
    imageUrl: '/src/assets/images/category_lowerbody_squats_1793895262517.jpg'
  }
};
