import { useState } from "react";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    buy: "",
    sell: "",
    stock: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbzJwrjuJ8QEaFj4ofnLQpe5O0hM3mTYL2BCVNxGewqKom-cFK2QyoOZP1xNfCdtza8n/exec",
        {
          method: "POST",
          body: JSON.stringify(formData),
          headers: { "Content-Type": "application/json" },
        }
      );

      const result = await res.json();
      setResponse(result.message);
    } catch (error) {
      setResponse("خطا در ارسال اطلاعات");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow space-y-4"
    >
      <h2 className="text-xl font-bold text-center">افزودن کالا</h2>

      {["name", "type", "buy", "sell", "stock", "description"].map((field) => (
        <input
          key={field}
          name={field}
          type="text"
          placeholder={field}
          value={formData[field as keyof typeof formData]}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      ))}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
      >
        {loading ? "در حال ارسال..." : "ثبت کالا"}
      </button>

      {response && (
        <div className="text-center mt-2 text-green-700 font-medium">{response}</div>
      )}
    </form>
  );
};

export default AddProduct;
