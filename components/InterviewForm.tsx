import { useState } from "react";

type FormData = {
  role: string;
  level: string;
  techstack: string;
  type: string;
  amount: number;
};

type Props = {
  onSubmit: (data: FormData) => Promise<void>; // ensure async
};

export default function InterviewForm({ onSubmit }: Props) {
  const [formData, setFormData] = useState<FormData>({
    role: "",
    level: "",
    techstack: "",
    type: "",
    amount: 5,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "amount" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-full bg-[#111] border border-neutral-800 rounded-2xl p-10 shadow-lg flex flex-col gap-6"
      >
        <h2 className="text-white text-2xl font-semibold text-center">
          🎯 Start an Interview
        </h2>

        <input
          name="role"
          placeholder="Role (e.g., Frontend Developer)"
          value={formData.role}
          onChange={handleChange}
          required
          className="bg-[#1a1a1a] text-white border border-neutral-700 rounded-lg px-4 py-3 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="level"
          placeholder="Level (e.g., Entry level)"
          value={formData.level}
          onChange={handleChange}
          required
          className="bg-[#1a1a1a] text-white border border-neutral-700 rounded-lg px-4 py-3 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="techstack"
          placeholder="Tech Stack (e.g., React, Node.js)"
          value={formData.techstack}
          onChange={handleChange}
          required
          className="bg-[#1a1a1a] text-white border border-neutral-700 rounded-lg px-4 py-3 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="bg-[#1a1a1a] text-white border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Interview Type</option>
          <option value="Technical">Technical</option>
          <option value="Behavioral">Behavioral</option>
          <option value="Mixed">Mixed</option>
        </select>

        <input
          name="amount"
          type="number"
          min="1"
          max="20"
          placeholder="Number of Questions"
          value={formData.amount}
          onChange={handleChange}
          required
          className="bg-[#1a1a1a] text-white border border-neutral-700 rounded-lg px-4 py-3 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white font-medium py-3 rounded-xl shadow-md"
          style={{ cursor: "pointer" }}
        >
          🚀 Start Interview
        </button>
      </form>

      {/* {loading && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="h-16 w-16 border-4 border-[#2e2e2e] border-t-[#4cc9f0] rounded-full animate-spin shadow-[0_0_20px_#4cc9f0]" />
          <p className="mt-6 text-sm text-[#cfcfcf] tracking-wide font-medium animate-pulse">
            Generating Interview...
          </p>
        </div>
      )} */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-[#0d0d0d]/90 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="h-12 w-12 border-4 border-neutral-700 border-t-blue-500 rounded-full animate-spin" />
          <p className="mt-4 text-sm text-neutral-300 tracking-wide font-medium">
            Generating Interview...
          </p>
        </div>
      )}
    </>
  );
}
