
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { KanbanCard } from "../types/kanban";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Updated to use technology categories instead of stages
export const KANBAN_CATEGORIES: { id: string; name: string }[] = [
  { id: "Text to Speech", name: "Text to Speech" },
  { id: "Speech to Text", name: "Speech to Text" },
  { id: "LLMs", name: "LLMs" },
  { id: "Voice Assistants", name: "Voice Assistants" },
  { id: "Other", name: "Other" },
];

export const TECH_TAGS = [
  "STT",
  "TTS",
  "Multilingual",
  "Emotion",
  "GPU-required",
  "Open-source",
  "Commercial",
  "Real-time",
  "Batch",
  "On-premise",
  "Cloud",
];

export const getTagColor = (tag: string): string => {
  const tagColors: Record<string, string> = {
    "STT": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    "TTS": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    "Multilingual": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "Emotion": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    "GPU-required": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    "Open-source": "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
    "Commercial": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    "Real-time": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    "Batch": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    "On-premise": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
    "Cloud": "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300",
  };
  
  return tagColors[tag] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
};

export const getCategoryColor = (category: string): string => {
  const categoryColors: Record<string, string> = {
    "Text to Speech": "bg-purple-50 dark:bg-purple-950",
    "Speech to Text": "bg-blue-50 dark:bg-blue-950",
    "LLMs": "bg-green-50 dark:bg-green-950",
    "Voice Assistants": "bg-amber-50 dark:bg-amber-950",
    "Other": "bg-gray-50 dark:bg-gray-900",
  };
  
  return categoryColors[category] || "bg-gray-50 dark:bg-gray-900";
};

export const getSampleData = (): KanbanCard[] => [
  {
    id: generateId(),
    name: "OpenAI Whisper",
    description: "State-of-the-art speech recognition model with multilingual capabilities",
    tags: ["STT", "Multilingual", "GPU-required", "Open-source"],
    category: "Speech to Text",
    notes: "Excellent accuracy but requires significant GPU resources for real-time processing",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: "ESPnet",
    description: "End-to-End Speech Processing Toolkit with various models",
    tags: ["STT", "TTS", "Open-source", "Batch"],
    category: "Speech to Text",
    notes: "Documentation is complex, working on setting up the environment",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: "ElevenLabs",
    description: "High-quality, realistic voice synthesis with emotion control",
    tags: ["TTS", "Emotion", "Commercial", "Cloud"],
    category: "Text to Speech",
    notes: "Pricing is a concern for large-scale usage",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: "Mozilla DeepSpeech",
    description: "Open-source speech-to-text engine using TensorFlow",
    tags: ["STT", "Open-source", "On-premise"],
    category: "Speech to Text",
    notes: "Performance issues with non-English languages",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: "Coqui TTS",
    description: "Deep learning toolkit for Text-to-Speech with multiple voices",
    tags: ["TTS", "Open-source", "GPU-required"],
    category: "Text to Speech",
    notes: "Good quality for an open-source solution, but requires fine-tuning",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: "GPT-4",
    description: "Large language model with advanced reasoning capabilities",
    tags: ["Open-source", "GPU-required", "Cloud"],
    category: "LLMs",
    notes: "Excellent for text generation and understanding",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: "Amazon Alexa",
    description: "Voice assistant platform with custom skill development",
    tags: ["Commercial", "Cloud", "Real-time"],
    category: "Voice Assistants",
    notes: "Good ecosystem but requires AWS integration",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
