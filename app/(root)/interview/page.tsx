import { redirect } from "next/navigation";
import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { db } from "@/firebase/admin"; // Assuming admin SDK here
import { v4 as uuidv4 } from "uuid"; // Generate unique ID

const Page = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const interviewId = uuidv4(); // or use: db.collection('interviews').doc().id;

  // Pre-create the interview doc in Firestore if required
  await db.collection("interviews").doc(interviewId).set({
    userId: user.id,
    role: "N/A",
    type: "generate",
    createdAt: new Date().toISOString(),
    finalized: false,
    techstack: [],
    questions: [],
  });

  return (
    <>
      <h3>Interview generation</h3>

      <Agent
        userName={user.name}
        userId={user.id}
        interviewId={interviewId} 
        type="generate"
      />
    </>
  );
};

export default Page;
