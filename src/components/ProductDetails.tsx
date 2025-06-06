// ProductDetails.tsx - فرم ثبت فروش و نمایش فاکتور
import React, { useState } from "react";

type Props = {
  product: any;
};

const ProductDetails: React.FC<Props> = ({ product }) => {
  const [count, setCount] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [customer, setCustomer] = useState("");

  const total = count * product["قیمت فروش"] - discount;

  const handleSubmit = () => {
    // اتصال به API برای ثبت فروش اینجا اضافه می‌شود
    alert("فروش ثبت شد (فعلاً آزمایشی)");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">فروش محصول</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-1">
          <p className="text-sm text-gray-500">نام محصول</p>
          <p className="font-bold text-gray-800">{product["نام کالا"]}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-gray-500">نوع</p>
          <p className="font-bold text-gray-800">{product["نوع کالا"]}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-gray-500">موجودی</p>
          <p className="font-bold text-blue-600">{product["موجودی"]} عدد</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-gray-500">قیمت خرید</p>
          <p className="font-bold text-gray-800">{Number(product["قیمت خرید"]).toLocaleString()} تومان</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-gray-500">قیمت فروش</p>
          <p className="font-bold text-green-600">{Number(product["قیمت فروش"]).toLocaleString()} تومان</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تعداد</label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full py-2 px-3 border-none rounded-lg bg-gray-50 shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تخفیف (تومان)</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="w-full py-2 px-3 border-none rounded-lg bg-gray-50 shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">نام مشتری</label>
          <input
            type="text"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            className="w-full py-2 px-3 border-none rounded-lg bg-gray-50 shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 whitespace-nowrap cursor-pointer"
        >
          ثبت فروش
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-bold mb-2">فاکتور فروش</h3>
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4">نام محصول</th>
              <th className="py-2 px-4">تعداد</th>
              <th className="py-2 px-4">قیمت واحد</th>
              <th className="py-2 px-4">تخفیف</th>
              <th className="py-2 px-4">قیمت کل</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4">{product["نام کالا"]}</td>
              <td className="py-2 px-4">{count}</td>
              <td className="py-2 px-4">{Number(product["قیمت فروش"]).toLocaleString()} تومان</td>
              <td className="py-2 px-4">{discount.toLocaleString()} تومان</td>
              <td className="py-2 px-4 font-bold">{total.toLocaleString()} تومان</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductDetails;
