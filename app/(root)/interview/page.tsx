"use client";
import InterviewForm from "@/components/InterviewForm";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { useEffect, useState } from "react";

export default function InterviewPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");

  // get user ID on load
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      if (user?.id) setUserId(user.id);
    };
    fetchUser();
  }, []);

  const handleFormSubmit = async (formData: {
    role: string;
    level: string;
    techstack: string;
    type: string;
    amount: number;
  }) => {
    try {
      const res = await fetch("/api/vapi/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userid: userId }),
      });

      const data = await res.json();
      if (data?.interviewId) {
        router.push(`/interview/${data.interviewId}`);
      } else {
        alert("Something went wrong");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Error creating interview.");
    }
  };

  return (
    <main className="p-8 max-w-xl mx-auto w-full">
      <InterviewForm onSubmit={handleFormSubmit} />
    </main>
  );
}
