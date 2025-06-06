import React, { useState, useEffect } from 'react';

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzJwrjuJ8QEaFj4ofnLQpe5O0hM3mTYL2BCVNxGewqKom-cFK2QyoOZP1xNfCdtza8n/exec";

type Product = {
  "کد کالا"?: string;
  "نام کالا"?: string;
  "نوع کالا"?: string;
  "قیمت خرید"?: number;
  "قیمت فروش"?: number;
  "موجودی"?: number;
  "توضیحات"?: string;
};

const SearchPanel: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);

  useEffect(() => {
    fetch(`${WEB_APP_URL}?mode=search`)
      .then(res => res.json())
      .then(data => {
        console.log("محصولات دریافت‌شده:", data);
        setProducts(data);
      })
      .catch(err => console.error("خطا در دریافت محصولات:", err));
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleSearch = () => {
    const q = query.trim().toLowerCase();
    const result = products.filter(
      p =>
        (p["نام کالا"] && p["نام کالا"].toLowerCase().includes(q)) ||
        (p["نوع کالا"] && p["نوع کالا"].toLowerCase().includes(q)) ||
        (p["کد کالا"] && p["کد کالا"].toLowerCase().includes(q))
    );
    setFiltered(result);
    setSelected(null);
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="جستجوی نام یا نوع یا کد کالا"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          className="border p-2 rounded w-full"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">
          جستجو
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {filtered.map((p, i) => (
          <div
            key={i}
            className="p-2 border rounded hover:bg-gray-100 cursor-pointer"
            onClick={() => setSelected(p)}
          >
            {p["نام کالا"]} ({p["کد کالا"]})
          </div>
        ))}
      </div>

      {selected && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <h3 className="font-bold text-lg mb-2">{selected["نام کالا"]}</h3>
          <p>کد کالا: {selected["کد کالا"]}</p>
          <p>نوع: {selected["نوع کالا"]}</p>
          <p>قیمت خرید: {selected["قیمت خرید"]?.toLocaleString()}</p>
          <p>قیمت فروش: {selected["قیمت فروش"]?.toLocaleString()}</p>
          <p>موجودی: {selected["موجودی"]}</p>
          <p>توضیحات: {selected["توضیحات"]}</p>
        </div>
      )}
    </div>
  );
};

export default SearchPanel;
