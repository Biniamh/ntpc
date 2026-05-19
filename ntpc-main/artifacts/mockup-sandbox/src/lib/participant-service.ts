import { api } from "./api-client";

interface BadgeGenerationResponse {
  success: boolean;
  badgeHtml?: string;
  error?: string;
}

export const participantService = {
  /**
   * Generate a badge for a participant by calling the backend API
   */
  async generateBadge(participantId: number): Promise<BadgeGenerationResponse> {
    try {
      // Call the backend API to generate badge
      const response = await api.post(`/ey-participants/${participantId}/generate-badge`);
      
      const result = await response.json();
      
      if (response.ok) {
        return {
          success: true,
          badgeHtml: result as string // The backend returns HTML string directly
        };
      } else {
        return {
          success: false,
          error: result.error || "Failed to generate badge"
        };
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to generate badge. Please try again."
      };
    }
  }
};