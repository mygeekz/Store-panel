// App.tsx - نسخه نهایی با فرم واقعی افزودن محصول و جستجوی اصلاح‌شده

import React, { useState, useEffect } from "react";
import AddProductForm from "./components/AddProductForm";
import AddMobileForm from "./components/AddMobileForm";

const App: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [showMobileForm, setShowMobileForm] = useState(false);
  const [assetValue, setAssetValue] = useState<number | null>(null);

  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzJwrjuJ8QEaFj4ofnLQpe5O0hM3mTYL2BCVNxGewqKom-cFK2QyoOZP1xNfCdtza8n/exec";

  useEffect(() => {
-    fetch(WEB_APP_URL)
+    // Fetch inventory products
+    fetch(`${WEB_APP_URL}?mode=search`)
      .then((res) => res.json())
      .then((data) => Array.isArray(data) ? setProducts(data.reverse()) : setProducts([]));

    // Fetch asset value (this part is likely working fine)
    fetch(`${WEB_APP_URL}?mode=asset`)
      .then((res) => res.json())
      .then((d) => setAssetValue(d.total));
  }, [showAddProductForm]); // Re-fetch when showAddProductForm changes

  const filteredProducts = products.filter((product) => {
    // Ensure product is an object and has the properties before calling toLowerCase
    const name = product && product["نام کالا"] ? String(product["نام کالا"]).toLowerCase() : "";
    const code = product && product["کد کالا"] ? String(product["کد کالا"]).toLowerCase() : "";
    return name.includes(searchTerm.toLowerCase()) || code.includes(searchTerm.toLowerCase());
  });

  const handleSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Optionally, you could trigger a new search/filter action here if needed,
      // but current filtering is live with searchTerm changes.
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Vazir',sans-serif] text-right" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-md py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800">فروشگاه قطعات کوروش</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Search & Actions */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="جستجو بر اساس نام یا کد محصول..."
              className="w-full py-3 px-4 pr-10 border-none rounded-lg shadow-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKey}
            />
            <i className="fas fa-search absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"></i>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button onClick={() => {
              setSelectedProduct(null);
              setShowAddProductForm(true);
              setShowMobileForm(false);
            }}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg shadow-md flex items-center gap-2">
              <i className="fas fa-plus"></i>
              <span>افزودن کالا</span>
            </button>

            <button onClick={() => {
              setSelectedProduct(null);
              setShowAddProductForm(false);
              setShowMobileForm(true);
            }}
              className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg shadow-md flex items-center gap-2">
              <i className="fas fa-mobile-alt"></i>
              <span>ثبت معامله گوشی</span>
            </button>
          </div>
        </div>

        {/* Asset Summary */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">مقدار دارایی انبار:</h2>
            <p className="text-xl font-bold text-green-600">
              {typeof assetValue === 'number' ? `${assetValue.toLocaleString()} تومان` : 'در حال بارگذاری...'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product List */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">نتایج جستجو</h2>
            {filteredProducts.length > 0 ? (
              <div className="space-y-3">
                {filteredProducts.map((product, index) => (
                  <div key={index} onClick={() => {
                    setSelectedProduct(product);
                    setShowAddProductForm(false);
                    setShowMobileForm(false);
                  }}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-gray-800">{product["نام کالا"]}</h3>
                      <span className="text-sm text-gray-500">{product["کد کالا"]}</span>
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                      <span>موجودی: <span className="font-bold text-blue-600">{product["موجودی"]}</span></span>
                      <span>قیمت فروش: <span className="font-bold text-green-600">{Number(product["قیمت فروش"]).toLocaleString()} تومان</span></span>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-gray-500 text-center py-4">محصولی یافت نشد</p>}
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-2">
            {selectedProduct && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">فروش محصول</h2>
                <p className="mb-2 text-gray-700 font-medium">نام: {selectedProduct["نام کالا"]}</p>
                <p className="mb-2 text-gray-700">نوع: {selectedProduct["نوع کالا"]} | موجودی: {selectedProduct["موجودی"]}</p>
                <p className="text-green-600 font-bold">قیمت: {Number(selectedProduct["قیمت فروش"]).toLocaleString()} تومان</p>
              </div>
            )}

            {showAddProductForm && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <AddProductForm />
              </div>
            )}

            {showMobileForm && (
              <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-600">
                <AddMobileForm />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;