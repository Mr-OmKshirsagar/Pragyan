import { apiClient } from "./apiClient";
import type { AIStatus, TelemetrySnapshot, RoadmapSummary } from "@/types/api";

export interface AssistantChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AssistantChatInput {
  message: string;
  careerId?: string;
  context?: {
    career?: string;
    roadmap?: string;
    goal?: string;
  };
  history?: AssistantChatMessage[];
}

export interface AssistantChatResponse {
  reply: string;
  provider?: string;
  fallbackUsed?: boolean;
}

export const aiService = {
  getStatus() {
    return apiClient.get<AIStatus>("/ai/status");
  },

  getTelemetry() {
    return apiClient.get<TelemetrySnapshot>("/ai/telemetry");
  },

  chat(input: AssistantChatInput) {
    return apiClient.post<AssistantChatResponse>("/ai/chat", input);
  },

  getRoadmapsForCareer(career: string) {
    return apiClient.get<RoadmapSummary[]>(`/ai/roadmaps/${encodeURIComponent(career)}`);
  },

  generatePersonalizedRoadmap(careerGoal: string, skillLevel: string) {
    return apiClient.post<RoadmapSummary[]>("/ai/personalized-roadmap", { careerGoal, skillLevel });
  },
};