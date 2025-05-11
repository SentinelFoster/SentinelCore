// This file provides AI-generated responses for the application
// In a real application, these would come from an actual AI service

type AIResponse = {
  [key: number]: string;
};

// Pre-defined AI responses for posts
const postResponses: AIResponse = {
  1: "This dance tutorial has excellent form and technique. The combination of classical and modern moves makes it accessible for beginners while still challenging for intermediate dancers.",
  2: "This is a wonderful example of community engagement. Research shows that communal activities like this increase neighborhood safety by 28% and resident satisfaction by 42%.",
  3: "Your creativity shines through in this video! The composition and lighting create a professional aesthetic that's quite impressive. Have you considered turning this skill into a workshop?",
  4: "The educational content in this post is well-researched and presented in an accessible way. Consider adding some interactive elements in your next educational post for increased engagement.",
  5: "Your storytelling technique has improved significantly! The narrative arc creates emotional investment, and viewers are responding with 37% higher engagement than your previous content.",
  6: "The health information shared here is accurate and presented responsibly. Factual wellness content like this helps combat misinformation online.",
  7: "This sustainability initiative could create meaningful impact. Similar community projects have reduced local waste by up to 35% in comparable neighborhoods.",
  8: "Your artistic expression resonates with authentic emotion. This kind of vulnerability in content tends to build stronger community connections and follower loyalty.",
  9: "The technical expertise demonstrated in this project is impressive. Have you considered creating a step-by-step tutorial series? Your audience shows high interest in learning these skills.",
  10: "This travel content showcases cultural respect and environmental awareness. Responsible travel content like this encourages more sustainable tourism practices."
};

// AI responses for video feedback
const videoFeedback: AIResponse = {
  1: "The dance choreography shows excellent spatial awareness and rhythm. The lighting enhances the visual appeal by 40% compared to indoor recordings.",
  2: "This community cleanup initiative demonstrates effective organization and coordination. Similar projects typically inspire 3-5 additional volunteer activities in the same community.",
  3: "The cinematography techniques you've used create professional-quality visuals. The color grading particularly enhances mood and viewer retention.",
  4: "Educational content presented with these visual aids typically increases information retention by 65% compared to text-only content.",
  5: "Your storytelling through visual narrative shows significant development. Emotional engagement metrics for this content are 28% above platform average.",
  6: "The health demonstration incorporates scientifically-backed information with accessible presentation. Consider adding captions for accessibility.",
  7: "Environmental initiatives documented like this typically generate 42% more community support than text-based announcements.",
  8: "The artistic expression in this video connects with viewers on multiple emotional levels. Your authentic approach resonates particularly well with the 25-34 demographic.",
  9: "Technical demonstrations with this level of clarity typically generate 3x the follower growth of more casual content. Your expertise is showcased effectively.",
  10: "Your travel documentation balances entertainment with educational content, a combination that typically increases share rates by 37%."
};

/**
 * Get an AI comment for a specific post
 * 
 * @param postId - The ID of the post
 * @returns An AI-generated comment
 */
export function getAIComment(postId: number): string {
  // Use modulo to cycle through responses if the postId is larger than our set
  const responseId = postId % Object.keys(postResponses).length || 1;
  return postResponses[responseId] || "This content demonstrates quality and engagement potential. Consider exploring similar themes in future posts for audience growth.";
}

/**
 * Get AI feedback for a video
 * 
 * @param videoId - The ID of the video
 * @returns AI-generated feedback for the video
 */
export function getAIVideoFeedback(videoId: number): string {
  // Use modulo to cycle through feedback if the videoId is larger than our set
  const feedbackId = videoId % Object.keys(videoFeedback).length || 1;
  return videoFeedback[feedbackId] || "This video shows potential for engagement. The visual composition and pacing align well with current platform trends.";
}

/**
 * Get a personalized AI message for a user
 * 
 * @param userId - The ID of the user
 * @returns A personalized AI message
 */
export function getAIPersonalizedMessage(userId: number): string {
  const messages = [
    "I've analyzed your latest content and have some suggestions to increase engagement based on current trends.",
    "Your recent posts are performing well! I've identified patterns in your highest-performing content to help guide your strategy.",
    "Based on your audience demographics, I have recommendations for optimal posting times to maximize reach.",
    "I've noticed your video content outperforms your static posts by 28%. Would you like content ideas to leverage this trend?",
    "Your community engagement is increasing! Comments on your posts are up 15% this week compared to last month."
  ];
  
  return messages[userId % messages.length];
}
