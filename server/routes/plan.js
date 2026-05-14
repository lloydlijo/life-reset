const router = require('express').Router();

const WEEKS = [
  {
    week: 1, days: '1–7', title: 'FOUNDATION',
    tagline: 'Just show up. That\'s the only rule this week.',
    targets: { sleep: '7 hours, in bed by 11pm', water: '6 glasses (1.5L)', exercise: '15 minutes', meditation: '5 minutes', screen: '3 hours max', cold: '15 seconds' },
    workout: {
      strengthDays: 'Mon / Wed / Fri',
      cardioType: 'Walk 20 min',
      cardioDays: 'Tue / Thu / Sat',
      exercises: [
        { name: 'Bodyweight Squats', sets: 3, reps: '8', rest: '45s', how: 'Stand feet shoulder-width. Lower until thighs parallel to floor. Keep chest up, knees over toes. Push through heels to stand.', why: 'Builds legs, glutes, burns most calories.' },
        { name: 'Knee Push-Ups', sets: 3, reps: '6', rest: '45s', how: 'Hands shoulder-width on floor, knees down. Lower chest to 2cm from floor. Push back up. Keep core tight.', why: 'Builds chest, shoulders, triceps. Beginner safe.' },
        { name: 'Glute Bridge', sets: 3, reps: '10', rest: '45s', how: 'Lie on back, knees bent, feet flat. Push hips up until body is straight. Squeeze glutes at top for 1 second. Lower slowly.', why: 'Activates glutes, fixes lower back, easy on joints.' },
        { name: 'Dead Bug', sets: 2, reps: '6 per side', rest: '45s', how: 'Lie on back, arms straight up, knees at 90°. Slowly lower opposite arm + leg toward floor. Return and switch.', why: 'Core stability. Protects your back during all exercise.' }
      ]
    },
    meditation: { duration: '5 min', method: 'Box Breathing: Inhale 4s → Hold 4s → Exhale 4s → Hold 4s. Repeat for 5 minutes.', when: 'Morning, right after waking up. Before your phone.' },
    cold: '15 seconds cold at the END of your normal shower. Count to 15 out loud. Get out.',
    tip: 'Fill a 1.5L bottle at the start of each day. Empty it before 7pm.'
  },
  {
    week: 2, days: '8–14', title: 'SETTLING IN',
    tagline: 'The habit is starting to form. Don\'t break the chain.',
    targets: { sleep: '7 hours, same routine', water: '7 glasses (1.75L)', exercise: '20 minutes', meditation: '7 minutes', screen: '2.5 hours max', cold: '20 seconds' },
    workout: {
      strengthDays: 'Mon / Wed / Fri',
      cardioType: 'Walk 25 min',
      cardioDays: 'Tue / Thu / Sat',
      exercises: [
        { name: 'Bodyweight Squats', sets: 3, reps: '10', rest: '45s', how: 'Same as Week 1 but 2 extra reps per set.', why: 'Progressive overload — the core principle of getting stronger.' },
        { name: 'Knee Push-Ups', sets: 3, reps: '8', rest: '45s', how: 'Same as Week 1.', why: 'Building baseline pressing strength.' },
        { name: 'Glute Bridge', sets: 3, reps: '12', rest: '45s', how: 'Same as Week 1.', why: 'Strengthening posterior chain.' },
        { name: 'Dead Bug', sets: 3, reps: '8 per side', rest: '45s', how: 'Same as Week 1.', why: 'Core stability.' },
        { name: 'Dumbbell Deadlift (light)', sets: 2, reps: '8', rest: '60s', how: 'Stand feet hip-width, dumbbells in front of thighs. Hinge at hips, push them back, lower weights down shins keeping back flat. Drive hips forward to stand.', why: 'Builds entire posterior chain. Foundation of all strength training.' }
      ]
    },
    meditation: { duration: '7 min', method: '4 min Box Breathing + 3 min Body Scan: slowly scan head to toe, notice tension, just observe.', when: 'Morning before phone.' },
    cold: '20 seconds. Same method as Week 1. Notice how it\'s already getting easier.',
    tip: 'Walk days are now 25 min. Keep phone away on walks.'
  },
  {
    week: 3, days: '15–21', title: 'BUILDING',
    tagline: 'You\'ve done 2 weeks. Most people quit by now. Not you.',
    targets: { sleep: '7.5 hours, in bed by 10:45pm', water: '8 glasses (2L)', exercise: '25 minutes', meditation: '10 minutes', screen: '2 hours max', cold: '30 seconds' },
    workout: {
      strengthDays: 'Mon / Wed / Fri',
      cardioType: 'Run/Walk intervals 25 min',
      cardioDays: 'Tue / Thu',
      exercises: [
        { name: 'Goblet Squat w/ Dumbbell', sets: 3, reps: '10', rest: '60s', how: 'Hold one dumbbell vertically at chest. Squat deep, elbows track inside knees. Chest stays upright. Push through heels.', why: 'More challenging than bodyweight, works core too.' },
        { name: 'Full Push-Ups', sets: 3, reps: '6+', rest: '60s', how: 'Toes on floor now. Hands just wider than shoulder-width. Full range of motion. If can\'t do 6, do max then finish on knees.', why: 'Real pushing strength. The progression from knee push-ups.' },
        { name: 'Dumbbell Romanian Deadlift', sets: 3, reps: '10', rest: '60s', how: 'Same as Week 2 but slightly heavier if able. Hip hinge, flat back.', why: 'Building hamstrings and posterior chain.' },
        { name: 'Resistance Band Row', sets: 3, reps: '12', rest: '60s', how: 'Anchor band at waist height. Hold ends, step back. Pull band to hips, squeezing shoulder blades together. Slow release.', why: 'Back strength and posture. Counteracts all the sitting.' },
        { name: 'Plank Hold', sets: 3, reps: '20 seconds', rest: '45s', how: 'Forearms on floor, toes on floor. Straight line head to heels. Don\'t let hips drop or rise. Breathe normally.', why: 'Core endurance — foundational for all movement.' }
      ],
      cardioNote: 'Run 1 min / Walk 2 min. Repeat 5×. Too easy? Run 1.5/Walk 1.5.'
    },
    meditation: { duration: '10 min', method: 'Min 1–5: Box Breathing. Min 6–8: Body Scan. Min 9–10: Set ONE intention — "What is the one thing I want to do well today?"', when: 'Morning before phone.' },
    cold: '30 seconds. Full cold. The anxiety is already less — that IS the adaptation.',
    tip: 'Saturday: 30 min outdoor walk, leisure, no phone. Sunday: complete rest.'
  },
  {
    week: 4, days: '22–28', title: 'TESTING YOU',
    tagline: 'Week 4 is where most people plateau. We go through it.',
    targets: { sleep: '7.5 hours, in bed by 10:30pm', water: '8 glasses (2L)', exercise: '30 minutes', meditation: '10 minutes', screen: '1.5 hours max', cold: '45 seconds' },
    workout: {
      strengthDays: 'Mon / Wed / Fri (Supersets)',
      cardioType: 'Run/Walk intervals 30 min',
      cardioDays: 'Tue / Thu',
      exercises: [
        { name: 'SUPERSET 1 — Goblet Squat + Push-Up', sets: 3, reps: '12 + max reps', rest: '60s after both', how: 'Do Goblet Squat (12 reps) immediately into Push-Ups (max, aim 8+). No rest between. Rest 60s. Repeat 3×.', why: 'Supersets burn more fat, save time, increase intensity.' },
        { name: 'SUPERSET 2 — RDL + Band Row', sets: 3, reps: '12 + 15', rest: '60s after both', how: 'Dumbbell RDL (12) immediately into Band Row (15). No rest between. Rest 60s. Repeat 3×.', why: 'Posterior chain superset — maximum efficiency.' },
        { name: 'SUPERSET 3 — Plank + Dead Bug', sets: 2, reps: '30s + 10 per side', rest: '45s after both', how: 'Plank (30s) into Dead Bug (10 per side). Rest 45s. Repeat 2×.', why: 'Core finisher.' },
        { name: 'FINISHER — No Rest Circuit', sets: 1, reps: '10 each', rest: 'None', how: '10 Jumping Jacks → 10 Bodyweight Squats → 10 Mountain Climbers. Mountain Climbers: push-up position, drive knees alternately to chest fast.', why: 'Metabolic finisher — keeps heart rate elevated, burns more fat.' }
      ],
      cardioNote: 'Run 1.5 min / Walk 1.5 min. ~7 rounds. Goal: run more than you walk by end of week.'
    },
    meditation: { duration: '10 min', method: 'Box Breathing + Body Scan + Intention + GRATITUDE: last 2 min think of 3 specific things you\'re grateful for today (specific, not generic).', when: 'Morning.' },
    cold: '45 seconds. You\'re nearly a minute. This is real mental training now.',
    tip: 'Supersets are new this week. Don\'t rest between the two exercises — only after both.'
  },
  {
    week: 5, days: '29–35', title: 'STRENGTHENING',
    tagline: 'You are not the same person you were on Day 1.',
    targets: { sleep: '8 hours, in bed by 10:30pm', water: '9 glasses (2.25L)', exercise: '35 minutes', meditation: '12 minutes', screen: '1.5 hours max', cold: '60 seconds (1 full minute)' },
    workout: {
      strengthDays: 'Mon/Wed Upper Body, Tue/Fri Lower Body',
      cardioType: 'Run 2 min / Walk 1 min × 10',
      cardioDays: 'Thu',
      exercises: [
        { name: 'Push-Up Progression', sets: 4, reps: '8', rest: '60s', how: 'Try feet-elevated push-ups (feet on chair) if regular are too easy.', why: 'Increasing difficulty to match your new strength.' },
        { name: 'Dumbbell Shoulder Press', sets: 3, reps: '10', rest: '60s', how: 'Dumbbells at shoulder height, palms forward. Press up until arms almost lock. Lower slowly (3 seconds down).', why: 'Shoulder strength, posture, upper body aesthetics.' },
        { name: 'Resistance Band Row', sets: 4, reps: '12', rest: '60s', how: 'Same as before. More sets for more back volume.', why: 'Back is often underdeveloped. This corrects that.' },
        { name: 'Dumbbell Bicep Curl', sets: 3, reps: '10', rest: '60s', how: 'Stand, dumbbells at sides, palms forward. Curl to shoulders without swinging. Lower slowly (3 seconds). Elbows pinned to sides.', why: 'Arm aesthetics and grip strength.' },
        { name: 'Tricep Dips (chair)', sets: 3, reps: '8', rest: '60s', how: 'Hands on edge of sturdy chair, legs extended. Lower body by bending elbows to 90°. Push back up. Back close to chair.', why: 'Triceps are 2/3 of arm size. Often neglected.' },
        { name: 'Goblet Squat', sets: 4, reps: '12', rest: '60s', how: 'Same as before. Now 4 sets for lower body day.', why: 'Main lower body compound movement.' },
        { name: 'Reverse Lunge', sets: 3, reps: '10 per leg', rest: '60s', how: 'Stand with dumbbells. Step one foot back, lower back knee toward floor. Return to stand. Alternate legs. Front shin vertical.', why: 'Unilateral movement — fixes strength imbalances between legs.' },
        { name: 'Calf Raises', sets: 3, reps: '20', rest: '45s', how: 'Stand on edge of step or flat floor. Rise onto balls of feet. Hold 1 second at top. Lower slowly. Hold dumbbells for extra weight.', why: 'Often skipped, always visible.' }
      ]
    },
    meditation: { duration: '12 min', method: 'Box Breathing + Body Scan + Intention + Gratitude + VISUALISATION: last 3 min picture yourself on Day 66. What do you look like? How do you feel? Make it vivid.', when: 'Morning.' },
    cold: '60 seconds. One full minute. You couldn\'t imagine this on Day 1.',
    tip: 'Upper/Lower split means more focus on each muscle group. Rest between sessions matters now.'
  },
  {
    week: 6, days: '36–42', title: 'MOMENTUM',
    tagline: 'Halfway. You\'ve built something real. Now we use it.',
    targets: { sleep: '8 hours, in bed by 10:15pm', water: '9 glasses', exercise: '40 minutes', meditation: '12 minutes', screen: '1 hour max', cold: '90 seconds' },
    workout: {
      strengthDays: 'Upper/Lower split continues',
      cardioType: 'Run 2.5 min / Walk 1 min, 20 min running total',
      cardioDays: 'Thu',
      exercises: [
        { name: 'Diamond Push-Ups', sets: 3, reps: '6', rest: '60s', how: 'Hands form diamond shape under chest. Lower and press. Replaces standard push-ups this week.', why: 'Targets triceps heavily. Much harder than regular push-up.' },
        { name: 'Dumbbell Chest Press (floor)', sets: 3, reps: '10', rest: '60s', how: 'Lie on floor. Dumbbells at chest, elbows at 45°. Press up, don\'t fully lock. Lower slowly.', why: 'Bench press equivalent at home. Chest strength and size.' },
        { name: 'Jump Squats', sets: 2, reps: '8', rest: '60s', how: 'Squat down, then explode up and jump. Land softly bending knees immediately. No weights.', why: 'Explosive power, burns more calories.' },
        { name: 'Bulgarian Split Squat', sets: 3, reps: '8 per leg', rest: '90s', how: 'Back foot elevated on chair. Front foot forward. Lower back knee toward floor. Push through front heel. Hold dumbbells at sides.', why: 'Hardest single-leg exercise. Builds serious lower body strength.' }
      ]
    },
    meditation: { duration: '12 min', method: 'Full practice: Box Breathing + Body Scan + Intention + Gratitude + Visualisation.', when: 'Morning.' },
    cold: '90 seconds. NEW CHALLENGE: 15s cold BEFORE warm water, then normal shower, then 90s cold at end.',
    tip: 'Starting cold first is a different mental challenge. The discomfort without the "warm reward" coming.'
  },
  {
    week: 7, days: '43–49', title: 'PUSH PHASE',
    tagline: 'This is where real change compounds. Push harder.',
    targets: { sleep: '8 hours — protect this fiercely', water: '10 glasses (2.5L)', exercise: '45 minutes', meditation: '15 minutes', screen: '1 hour max', cold: '2 minutes' },
    workout: {
      strengthDays: 'Mon/Thu Upper, Tue/Fri Lower + HIIT',
      cardioType: 'Run 30 min continuous target',
      cardioDays: 'Sat',
      exercises: [
        { name: 'Dumbbell Lateral Raise', sets: 3, reps: '12', rest: '45s', how: 'Stand, dumbbells at sides. Lift arms out to sides to shoulder height (T shape). Lower slowly. Use light weight.', why: 'Caps the shoulders — biggest visual impact on upper body.' },
        { name: 'HIIT Finisher (Friday)', sets: 2, reps: '40s on / 20s off', rest: 'Between rounds', how: 'Circuit: Burpees → Mountain Climbers → Jump Squats → Push-Ups. Each 40s, rest 20s. Repeat circuit twice.', why: 'Maximum calorie burn, improves cardiovascular fitness rapidly.' },
        { name: 'Burpee', sets: 0, reps: 'In HIIT', rest: '', how: 'Stand → squat down → place hands on floor → step back to plank → push-up (optional) → step feet back to hands → jump up with arms overhead.', why: 'Full body, maximum effort movement.' }
      ]
    },
    meditation: { duration: '15 min', method: 'FULL: Min 1–5 Box Breathing | Min 6–8 Body Scan | Min 9–10 Intention | Min 11–12 Gratitude | Min 13–15 Visualisation. This is what high performers do every morning.', when: 'Morning. Protect this time like a workout.' },
    cold: '2 minutes. You are now in territory most people never reach.',
    tip: '4 training days this week. Wednesday is rest or light walk. Prioritize sleep.'
  },
  {
    week: 8, days: '50–56', title: 'PEAK EFFORT',
    tagline: 'Last hard week. Everything you have.',
    targets: { sleep: '8 hours — non-negotiable', water: '10 glasses', exercise: '45–50 minutes', meditation: '15 minutes', screen: '45 min max', cold: '2 minutes 30 seconds' },
    workout: {
      strengthDays: '4-day split continues. Increase all weights one step.',
      cardioType: 'Run 35 min continuous',
      cardioDays: 'Sat',
      exercises: [
        { name: 'RDL into Upright Row (complex)', sets: 3, reps: '8', rest: '90s', how: 'RDL as normal → at top, pull dumbbells up to chin in upright row → lower. One fluid movement.', why: 'Compound movement: back, glutes, traps, shoulders in one. Maximum efficiency.' },
        { name: 'Resistance Band Pull-Apart', sets: 3, reps: '20', rest: '45s', how: 'Hold band at shoulder height, arms straight. Pull ends apart until band touches chest. Squeeze. Return slowly.', why: 'Rear delts and posture. Corrects rounded shoulders.' }
      ]
    },
    meditation: { duration: '15 min', method: 'Full 15-minute practice. You know it now. Own it.', when: 'Morning.' },
    cold: '2 min 30 sec. You are doing things most humans never attempt.',
    tip: 'Increase weights by one step this week. If using 5kg → move to 7.5kg. Form first, always.'
  },
  {
    week: 9, days: '57–66', title: 'FINAL STRETCH',
    tagline: 'You\'re not finishing. You\'re becoming.',
    targets: { sleep: '8 hours', water: '10 glasses', exercise: '40 minutes (taper)', meditation: '15 minutes', screen: '45 min max', cold: '3 minutes full cold' },
    workout: {
      strengthDays: 'Your split, reduced intensity (deload)',
      cardioType: 'Comfortable run, no pressure on pace',
      cardioDays: 'Sat',
      exercises: [
        { name: 'Full Split — Deload Week', sets: 0, reps: '', rest: '', how: 'Keep your split but drop weight by 10–15%. Same reps. Focus entirely on form and feeling the muscles work.', why: 'Your body adapts during rest, not during work. Gains solidify this week.' },
        { name: 'DAY 66 TEST', sets: 1, reps: 'Max', rest: '', how: 'How many full push-ups in a row? How long can you plank? Can you run 30+ min without stopping? Compare to Day 1.', why: 'Measure who you\'ve become.' }
      ]
    },
    meditation: { duration: '15 min', method: 'Full practice. On Day 66: spend visualisation time on Day 67 and beyond. Who are you now?', when: 'Morning.' },
    cold: '3 minutes. Day 66: take a full cold shower from start to end. Not because you have to. Because you can.',
    tip: 'Deload is not weakness — it\'s science. Your muscles grow during recovery.'
  }
];

router.get('/weeks', (req, res) => {
  res.json(WEEKS.map(w => ({
    week: w.week, days: w.days, title: w.title, tagline: w.tagline, targets: w.targets
  })));
});

router.get('/weeks/:week', (req, res) => {
  const w = WEEKS.find(x => x.week === parseInt(req.params.week));
  if (!w) return res.status(404).json({ error: 'Week not found' });
  res.json(w);
});

const MILESTONES = [
  { day: 7, text: 'Slightly more energy in mornings. Sleep is noticeably better.' },
  { day: 14, text: 'Screen time reduction = 1–2 extra hours daily. More mental space, less anxiety.' },
  { day: 21, text: 'Exercise habit is automatic. Body is changing — fat shifting, muscle waking up.' },
  { day: 30, text: 'Real strength gains visible. Push-ups feel easy. Running is improving fast.' },
  { day: 45, text: 'Body composition clearly changed. Clothes fit differently. Sleep is deep and consistent.' },
  { day: 60, text: 'You are a different person. Discipline is a personality trait now, not an effort.' },
  { day: 66, text: 'You finish something most people never start.' }
];

router.get('/milestones', (req, res) => {
  res.json(MILESTONES);
});

module.exports = router;
