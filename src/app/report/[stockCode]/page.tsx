"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReportPage() {
  const { stockCode } = useParams();
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/chat", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [
              { role: "user", content: `请帮我分析 ${stockCode} 这支股票` }
            ]
          })
        });

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const text = decoder.decode(value);
            const lines = text.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  if (data.content) {
                    setReport(prev => prev + data.content);
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [stockCode]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">{stockCode} 股票研报</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        {loading && report === "" ? (
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
