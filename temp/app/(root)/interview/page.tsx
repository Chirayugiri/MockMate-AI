import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { db } from "@/firebase/admin";

const Page = async () => {
  const user = await getCurrentUser();

  // 🔥 Create a new empty/default interview document
  const interviewRef = db.collection("interviews").doc();
  const interviewId = interviewRef.id;

  await interviewRef.set({
    userId: user?.id,
    role: "N/A",
    techstack: [],
    questions: [],
    type: "generate",
    createdAt: new Date().toISOString(),
    finalized: false,
  });

  return (
    <>
      <h3>Interview generation</h3>

      <Agent
        userName={user?.name!}
        userId={user?.id ?? ""}
        interviewId={interviewId}
        type="generate"
      />
    </>
  );
};

export default Page;
