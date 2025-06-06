// AssetSummary.tsx - نمایش مقدار دارایی انبار
import React, { useEffect, useState } from "react";

const AssetSummary = () => {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://script.google.com/macros/s/AKfycbxX0lbGHYrYSQbnh7oageDF9WEXgaoDte-qX-Xv-8wtkxLdaNf5k_7OVQFK5qJQB6pJ/exec?mode=asset")
      .then((res) => res.json())
      .then((data) => setTotal(data.total));
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">مقدار دارایی انبار:</h2>
        <p className="text-xl font-bold text-green-600">
          {total !== null ? total.toLocaleString() + " تومان" : "در حال بارگذاری..."}
        </p>
      </div>
    </div>
  );
};

export default AssetSummary;
