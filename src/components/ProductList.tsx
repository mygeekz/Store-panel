// ProductList.tsx - لیست نتایج جستجو به صورت کارت
import React from "react";

type Props = {
  products: any[];
  onSelect: (product: any) => void;
};

const ProductList: React.FC<Props> = ({ products, onSelect }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">نتایج جستجو</h2>
      {products.length > 0 ? (
        <div className="space-y-3">
          {products.map((product, index) => (
            <div
              key={index}
              onClick={() => onSelect(product)}
              className="p-3 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-800">{product["نام کالا"]}</h3>
                <span className="text-sm text-gray-500">{product["کد کالا"]}</span>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span>
                  موجودی: <span className="font-bold text-blue-600">{product["موجودی"]}</span>
                </span>
                <span>
                  قیمت فروش: <span className="font-bold text-green-600">{Number(product["قیمت فروش"]).toLocaleString()} تومان</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">محصولی یافت نشد</p>
      )}
    </div>
  );
};

export default ProductList;
