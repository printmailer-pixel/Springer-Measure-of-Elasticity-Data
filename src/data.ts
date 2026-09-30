import { ScoringTier } from './types';

export const SPRINGER_STATEMENT = 
  "The Springer Measure of Elasticity gives you a snapshot of your current elasticity—how well your nervous system is adapting to the demands you’re carrying. Answer based on how you’ve actually been functioning lately.";

export const SPRINGER_QUESTIONS = [
  "I can take deep, slow breaths with ease.",
  "I've noticed that I get irritated more easily than I used to.",
  "After my adrenaline spikes, it doesn't take long for me to get myself calm again.",
  "I carry a heavy weight of stress that makes my body feel dragged down.",
  "I sleep well and wake up feeling rested.",
  "I frequently have tension headaches or muscle tightness due to work pressures.",
  "I can fully focus on and enjoy time with loved ones when I'm off from work.",
  "My body often feels tense, tight, or on edge.",
  "I can handle crises without becoming overly stressed.",
  "I feel disconnected from others or I would rather avoid social interactions.",
  "I can maintain clear, composed communication, even during heated conflict.",
  "When my phone rings, my first thought is often \"did something go wrong?\""
];

// Option builder based on question index (1-indexed odd vs even):
// Odd items (1, 3, 5, 7, 9, 11 - index 0, 2, 4, 6, 8, 10):
// Almost always (1), Often (2), Sometimes (3), Occasionally (4), Almost never (5)
// Even items (2, 4, 6, 8, 10, 12 - index 1, 3, 5, 7, 9, 11):
// Almost always (5), Often (4), Sometimes (3), Occasionally (2), Almost never (1)
export const getSpringerOptions = (index: number) => {
  if (index % 2 === 0) {
    return [
      { label: 'Almost always', value: 1 },
      { label: 'Often', value: 2 },
      { label: 'Sometimes', value: 3 },
      { label: 'Occasionally', value: 4 },
      { label: 'Almost never', value: 5 }
    ];
  } else {
    return [
      { label: 'Almost always', value: 5 },
      { label: 'Often', value: 4 },
      { label: 'Sometimes', value: 3 },
      { label: 'Occasionally', value: 2 },
      { label: 'Almost never', value: 1 }
    ];
  }
};

export const SCORING_TIERS: ScoringTier[] = [
  {
    min: 12,
    max: 24,
    label: "12–24",
    category: "Well regulated",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-800",
    accentBorder: "border-emerald-500",
    bgLight: "bg-emerald-50/70",
    description:
      "Your nervous system is in good shape - with evidence of the level of elasticity that sustains optimal performance. Consider re-assessing yourself if you notice changes, or on a yearly basis. As long as nothing changes, no intervention is needed."
  },
  {
    min: 25,
    max: 36,
    label: "25–36",
    category: "Mildly dysregulated",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-800",
    accentBorder: "border-amber-500",
    bgLight: "bg-amber-50/70",
    description:
      "You’re noticing some level of dysregulation, but overall your system is sufficiently elastic to meet the demands of your lifestyle. You may be able to maintain this level of elasticity with coping strategies like mindfulness practices, a regular physical fitness regimen, peer support, and occasional check-ins with a good Doc."
  },
  {
    min: 37,
    max: 48,
    label: "37–48",
    category: "Moderately dysregulated",
    badgeBg: "bg-orange-100",
    badgeText: "text-orange-800",
    accentBorder: "border-orange-500",
    bgLight: "bg-orange-50/70",
    description:
      "Your natural resilience may be a blind spot. You may still be operational but you have lost much of the elasticity needed to maintain peak performance; this level of nervous system strain is likely impacting your physical, mental and relational health. Timely intervention and targeted support are recommended."
  },
  {
    min: 49,
    max: 60,
    label: "49–60",
    category: "Severely dysregulated",
    badgeBg: "bg-rose-100",
    badgeText: "text-rose-800",
    accentBorder: "border-rose-600",
    bgLight: "bg-rose-50/70",
    description:
      "Your nervous system is chronically overactivated, your system is no longer elastic and your body is in a constant state of overload. You are at high risk for negative physical health (cardiac/stroke), mental health and negative relationship outcomes. Immediate intervention and support are recommended as a high priority. With the right support, you can heal."
  }
];

export const getTierForScore = (score: number): ScoringTier => {
  const found = SCORING_TIERS.find(t => score >= t.min && score <= t.max);
  return found || SCORING_TIERS[0];
};

export const RESOURCES = [
  {
    title: "988 Suicide & Crisis Lifeline",
    url: "https://988lifeline.org",
    description: "Free, confidential 24/7 support for anyone in distress or crisis. Call or text 988."
  },
  {
    title: "Veterans Crisis Line",
    url: "https://www.veteranscrisisline.net",
    description: "Dial 988, then press 1. Confidential support for veterans, service members, and their families."
  },
  {
    title: "Fortitude Recovery (Palo Alto)",
    url: "https://www.fortituderecovery.com/",
    description: "A specialized recovery program for first responders and veterans addressing trauma, PTSD symptoms, substance use, and related mental health challenges. Offers confidential, trauma-informed care."
  },
  {
    title: "ResponderStrong",
    url: "https://responderstrong.org",
    description: "Mental health resources, clinical directories, and crisis intervention tools built by and for emergency responders."
  },
  {
    title: "First Responder Project",
    url: "https://firstresponderproject.org",
    description: "Education, support, and resources to strengthen mental resilience in first responders."
  }
];
