"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import axios from "axios";
import { TranslateResponse } from "@/types/types";

const MonacoEditor = dynamic(() => import("react-monaco-editor"), {
  ssr: false,
});

const languageOptions = [
  { label: "Python", value: "python" },
  { label: "JavaScript", value: "javascript" },
  { label: "Java", value: "java" },
  { label: "C++", value: "cpp" },
];

const Editor = () => {
  const [code, setCode] = useState<string>("# Write Python code here...");
  const [language, setLanguage] = useState<string>("python");

  const handleLanguageChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLang = e.target.value;
    if (newLang === language) return;

    const response = await axios.post<TranslateResponse>("/api/translate", {
      code,
      sourceLang: language,
      targetLang: newLang,
    });

    setCode(response.data.translatedCode);
    setLanguage(newLang);
  };

  return (
    <div className="w-full space-y-4">
      <select
        className="p-2 bg-white text-black rounded"
        value={language}
        onChange={handleLanguageChange}
      >
        {languageOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <div className="h-[600px] border border-gray-700 rounded overflow-hidden">
        <MonacoEditor
          height="100%"
          language={language}
          value={code}
          theme="vs-dark"
          onChange={(val) => setCode(val || "")}
          options={{ automaticLayout: true }}
        />
      </div>
    </div>
  );
};

export default Editor;
