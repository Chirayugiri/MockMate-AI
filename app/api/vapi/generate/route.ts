import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { getCurrentUser } from "@/lib/actions/auth.action";

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid } = await request.json();

  try {
    const { text: questions } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        At the end, output ONLY a valid JSON object with this structure (no explanation, no extra text, no markdown, no code block):
        {
          "role": "...",
          "level": "...",
          "techstack": "...",
          "type": "...",
          "amount": "...",
          "questions": ["Question 1", "Question 2", ...]
        }
        Do NOT say "Here is the JSON", do NOT add any extra words, do NOT use markdown or code blocks. Only output the JSON object as your last message.
      `,
    });

    const interviewId = uuidv4();
    const parsed = JSON.parse(questions);

    await db.collection("interviews").doc(interviewId).set({
      ...parsed,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ interviewId }), { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}