"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ReportPage() {
  const { stockCode } = useParams();
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: `请分析股票${stockCode}的投资价值`,
              },
            ],
          }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No reader available");
        }

        // 用于解码文本
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // 解码并添加新的文本
          const text = decoder.decode(value);
          setReport((prev) => prev + text);
        }
      } catch (error) {
        console.error("Error fetching report:", error);
        setReport("获取报告时发生错误，请稍后重试。");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [stockCode]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">{stockCode} 股票研报</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="whitespace-pre-wrap">{report}</div>
        )}
      </div>
    </div>
  );
}
