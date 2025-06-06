import React, { useState, useEffect } from "react";

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzJwrjuJ8QEaFj4ofnLQpe5O0hM3mTYL2BCVNxGewqKom-cFK2QyoOZP1xNfCdtza8n/exec"; // لینک نهایی Web App شما

const AddProductForm = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [buy, setBuy] = useState("");
  const [sell, setSell] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [types, setTypes] = useState<string[]>([]);

  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    // دریافت لیست نوع کالا از شیت
    fetch(`${WEB_APP_URL}?mode=types`)
      .then((res) => res.json())
      .then((data) => setTypes(data))
      .catch((err) => console.error("Error fetching types:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    const payload = {
      name,
      type,
      buy,
      sell,
      stock,
      description,
    };

    try {
      await fetch(WEB_APP_URL, {
        method: "POST",
        mode: "no-cors", // مهم برای جلوگیری از CORS error
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      alert("✅ محصول با موفقیت ارسال شد!");
      setName("");
      setType("");
      setBuy("");
      setSell("");
      setStock("");
      setDescription("");
    } catch (error) {
      console.error("❌ خطا در ارسال:", error);
      alert("❌ ارسال با خطا مواجه شد.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-6 shadow-lg rounded-xl space-y-4">
      <h2 className="text-xl font-bold text-gray-800 border-b pb-2">افزودن محصول جدید</h2>

      <input type="text" placeholder="نام کالا" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />

      <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
        <option value="">نوع کالا را انتخاب کنید</option>
        {types.map((t, i) => (
          <option key={i} value={t}>{t}</option>
        ))}
      </select>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="number" placeholder="قیمت خرید" value={buy} onChange={(e) => setBuy(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        <input type="number" placeholder="قیمت فروش" value={sell} onChange={(e) => setSell(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
      </div>

      <input type="number" placeholder="موجودی" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />

      <textarea placeholder="توضیحات" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24" />

      <button type="submit" disabled={isSending} className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg transition duration-200">
        {isSending ? "در حال ارسال..." : "افزودن محصول"}
      </button>
    </form>
  );
};

export default AddProductForm;
