"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";

export async function createFeedback(
  params: CreateFeedbackParams & {
    role?: string;
    techstack?: string;
    type?: string;
  }
) {
  console.log("📥 createFeedback called");

  const { interviewId, userId, transcript, feedbackId, role, techstack, type } =
    params;

  console.log("🧾 Interview details:", {
    interviewId,
    userId,
    transcriptLength: transcript.length,
    feedbackId,
  });

  if (!transcript || transcript.length === 0) {
    console.warn("⚠️ No transcript provided. Skipping feedback generation.");
    return { success: false };
  }

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    console.log(
      "🔥 Formatted transcript sample:",
      formattedTranscript.slice(0, 300)
    );

    console.log("🔥 Calling Gemini to generate feedback object");
    const { object } = await generateObject({
      model: google("gemini-2.5-flash", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
      `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    console.log("✅ Gemini returned object:", object);

    const feedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    console.log("📝 Final feedback object:", feedback);

    let feedbackRef;
    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
      console.log("📌 Updating existing feedback:", feedbackRef.id);
    } else {
      feedbackRef = db.collection("feedback").doc();
      console.log("📌 Creating new feedback:", feedbackRef.id);
    }

    await feedbackRef.set(feedback);
    console.log("✅ Feedback saved successfully to Firebase:", feedbackRef.id);

    // ✅ Also update interview doc with role, techstack, type, finalized
    const interviewRef = db.collection("interviews").doc(interviewId);
    const interviewDoc = await interviewRef.get();
    const existingData = interviewDoc.data();

    await interviewRef.update({
      finalized: true,
      role: role || existingData?.role || "Not specified",
      techstack: techstack
        ? techstack.split(",").map((t) => t.trim())
        : existingData?.techstack || [],
      type: type || existingData?.type || "General",
      feedback: {
        totalScore: object.totalScore,
        categoryScores: object.categoryScores,
        strengths: object.strengths,
        areasForImprovement: object.areasForImprovement,
        finalAssessment: object.finalAssessment,
        createdAt: new Date().toISOString(),
      },
    });

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error: any) {
    console.error("❌ Error saving feedback:", error?.message || error);
    return { success: false };
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const interview = await db.collection("interviews").doc(id).get();

  return interview.data() as Interview | null;
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const querySnapshot = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (querySnapshot.empty) return null;

  const feedbackDoc = querySnapshot.docs[0];
  return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  const interviews = await db
    .collection("interviews")
    .orderBy("createdAt", "desc")
    .where("finalized", "==", true)
    .where("userId", "!=", userId)
    .limit(limit)
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  const interviews = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}
