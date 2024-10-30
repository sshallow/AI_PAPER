"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface StockResult {
  code: string;
  name: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<StockResult[]>([]);
  const router = useRouter();

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    // TODO: 实现模糊搜索逻辑
    // 这里需要调用您的股票搜索 API
    const mockResults = [
      { code: "600309", name: "万华化学" },
      { code: "600308", name: "华泰股份" },
    ].filter(
      (stock) => stock.code.includes(query) || stock.name.includes(query)
    );
    setSearchResults(mockResults);
  };

  const handleStockSelect = (stockCode: string) => {
    router.push(`/report/${stockCode}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-xl space-y-4">
        <h1 className="text-2xl font-bold text-center mb-8">
          股票智能研报系统
        </h1>

        <Input
          type="search"
          placeholder="请输入股票代码或名称..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full"
        />

        {searchResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg">
            {searchResults.map((stock: any) => (
              <div
                key={stock.code}
                className="p-4 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleStockSelect(stock.code)}
              >
                <span className="font-medium">{stock.code}</span>
                <span className="ml-4 text-gray-600">{stock.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
