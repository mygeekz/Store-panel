import React, { useState } from 'react';
import { FaMobileAlt, FaMemory, FaPalette, FaPercentage, FaUserTie, FaUser, FaMoneyBillWave, FaSave, FaTimes, FaCalendarAlt } from 'react-icons/fa';
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/layouts/mobile.css";
import "react-multi-date-picker/styles/colors/purple.css";

// URL وب اپلیکیشن Google Apps Script خود را اینجا قرار دهید
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxjgcyO-P46Ur4rbLsSHKHYN4EQzpjAGT7VINRZiIRCSmLwPpLLzCrne7cQUTkQThOa/exec"; // URL صحیح را وارد کنید

interface AddMobileFormProps {
  onClose?: () => void;
}

const AddMobileForm: React.FC<AddMobileFormProps> = ({ onClose }) => {
  
  const getTodayPersian = () => new DateObject({ calendar: persian, locale: persian_fa });

  const [formFields, setFormFields] = useState({
    model: '', ram: '', storage: '', color: '', imei: '',
    battery: '', buyer: '', seller: '', sellPrice: '', buyPrice: '',
  });

  const [purchaseDate, setPurchaseDate] = useState<DateObject | null>(getTodayPersian());
  const [saleDate, setSaleDate] = useState<DateObject | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'info' | 'error'; text: string } | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormFields(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    const purchaseDateString = purchaseDate ? purchaseDate.format("YYYY/MM/DD") : "";
    const saleDateString = saleDate ? saleDate.format("YYYY/MM/DD") : "";

    if (!formFields.model || !formFields.seller || !formFields.buyPrice || !purchaseDateString) {
        setSubmitMessage({ type: 'error', text: 'لطفاً فیلدهای ستاره‌دار را کامل پر کنید.' });
        setIsSubmitting(false);
        return;
    }

    const payload = {
      action: 'registerMobileDeal',
      ...formFields,
      purchaseDate: purchaseDateString,
      saleDate: saleDateString,
    };

    console.log('Sending payload to GAS (with no-cors):', JSON.stringify(payload));

    try {
      // استفاده از mode: 'no-cors'
      // هشدار: در این حالت نمی‌توانیم پاسخ سرور را بخوانیم
      await fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors', // ✅ حالت no-cors فعال شد
        // در حالت no-cors، هدر Content-Type ممکن است نادیده گرفته شود.
        // اما بدنه همچنان ارسال می‌شود و GAS معمولاً می‌تواند رشته JSON را در e.postData.contents بخواند.
        headers: {
           'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      // چون نمی‌توانیم موفقیت را تأیید کنیم، یک پیام اطلاعاتی نمایش می‌دهیم
      console.log('Request sent with no-cors. Server-side execution needs to be verified manually.');
      setSubmitMessage({ type: 'info', text: 'درخواست ارسال شد. لطفاً گوگل شیت را برای اطمینان از ثبت بررسی کنید.' });
      
      // ریست کردن فرم با فرض ارسال موفق
      setFormFields({
          model: '', ram: '', storage: '', color: '', imei: '',
          battery: '', buyer: '', seller: '', sellPrice: '', buyPrice: '',
      });
      setPurchaseDate(getTodayPersian());
      setSaleDate(null);

    } catch (error) { // این catch فقط خطاهای شبکه بسیار شدید را مدیریت می‌کند
      console.error('Fetch Error with no-cors:', error);
      setSubmitMessage({ type: 'error', text: 'خطا در ارسال اولیه درخواست. اتصال شبکه خود را بررسی کنید.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const inputContainerClass = "flex items-center gap-2 border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-purple-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const datePickerInputRenderClass = "w-full p-0 border-none outline-none flex-grow bg-transparent text-sm cursor-pointer";

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg space-y-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-purple-700">ثبت معامله گوشی</h2>
        {onClose && (
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        )}
      </div>

      {submitMessage && (
        <div className={`p-3 mb-4 rounded-md text-center text-sm ${
          submitMessage.type === 'info' ? 'bg-blue-100 text-blue-700' :
          submitMessage.type === 'error' ? 'bg-red-100 text-red-700' : ''
        }`}>
          {submitMessage.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        {/* Model */}
        <div>
          <label htmlFor="model" className={labelClass}>مدل گوشی <span className="text-red-500">*</span></label>
          <div className={inputContainerClass}>
            <FaMobileAlt className="text-gray-400 ml-2" />
            <input type="text" id="model" name="model" value={formFields.model} onChange={handleTextChange} placeholder="مثال: iPhone 13 Pro" className="flex-grow outline-none bg-transparent" required />
          </div>
        </div>

        {/* Purchase Date (Jalali) */}
        <div>
          <label htmlFor="purchaseDate" className={labelClass}>تاریخ خرید ما <span className="text-red-500">*</span></label>
          <div className={inputContainerClass + " cursor-pointer"}>
            <DatePicker
              id="purchaseDate"
              value={purchaseDate}
              onChange={setPurchaseDate}
              calendar={persian}
              locale={persian_fa}
              calendarPosition="bottom-right"
              containerClassName="w-full"
              format="YYYY/MM/DD"
              arrow={false}
              render={(value, openCalendar) => (
                <div className="flex items-center w-full" onClick={openCalendar}>
                    <FaCalendarAlt className="text-gray-400 ml-2" />
                    <input type="text" readOnly value={value} placeholder="تاریخ خرید را انتخاب کنید" className={datePickerInputRenderClass} />
                </div>
              )}
            />
          </div>
        </div>
        
        {/* Other fields */}
        {/* Seller */}
        <div>
          <label htmlFor="seller" className={labelClass}>فروشنده به ما <span className="text-red-500">*</span></label>
          <div className={inputContainerClass}>
            <FaUser className="text-gray-400 ml-2" />
            <input type="text" id="seller" name="seller" value={formFields.seller} onChange={handleTextChange} placeholder="نام فروشنده به ما" className="flex-grow outline-none bg-transparent" required />
          </div>
        </div>

        {/* Buy Price */}
        <div>
          <label htmlFor="buyPrice" className={labelClass}>قیمت خرید ما (تومان) <span className="text-red-500">*</span></label>
          <div className={inputContainerClass}>
            <FaMoneyBillWave className="text-gray-400 ml-2" />
            <input type="number" id="buyPrice" name="buyPrice" value={formFields.buyPrice} onChange={handleTextChange} placeholder="قیمت خرید از فروشنده" className="flex-grow outline-none bg-transparent" required />
          </div>
        </div>

        {/* RAM */}
        <div>
          <label htmlFor="ram" className={labelClass}>رم</label>
          <div className={inputContainerClass}>
            <FaMemory className="text-gray-400 ml-2" />
            <select id="ram" name="ram" value={formFields.ram} onChange={handleTextChange} className="flex-grow outline-none bg-transparent">
              <option value="">انتخاب کنید...</option>
              <option value="2GB">2GB</option><option value="3GB">3GB</option><option value="4GB">4GB</option>
              <option value="6GB">6GB</option><option value="8GB">8GB</option><option value="12GB">12GB</option>
              <option value="16GB">16GB</option>
            </select>
          </div>
        </div>

        {/* Storage */}
        <div>
          <label htmlFor="storage" className={labelClass}>حافظه داخلی</label>
          <div className={inputContainerClass}>
            <FaMemory className="text-gray-400 ml-2" />
            <select id="storage" name="storage" value={formFields.storage} onChange={handleTextChange} className="flex-grow outline-none bg-transparent">
              <option value="">انتخاب کنید...</option>
              <option value="16GB">16GB</option><option value="32GB">32GB</option><option value="64GB">64GB</option>
              <option value="128GB">128GB</option><option value="256GB">256GB</option><option value="512GB">512GB</option>
              <option value="1TB">1TB</option>
            </select>
          </div>
        </div>
        
        {/* Color */}
        <div>
          <label htmlFor="color" className={labelClass}>رنگ گوشی <span className="text-red-500">*</span></label>
          <div className={inputContainerClass}>
            <FaPalette className="text-gray-400 ml-2" />
            <input type="text" id="color" name="color" value={formFields.color} onChange={handleTextChange} placeholder="مثال: آبی" className="flex-grow outline-none bg-transparent" required />
          </div>
        </div>

        {/* Sale Date (Jalali) */}
        <div>
          <label htmlFor="saleDate" className={labelClass}>تاریخ فروش ما (اختیاری)</label>
           <div className={inputContainerClass + " cursor-pointer"}>
            <DatePicker
              id="saleDate"
              value={saleDate}
              onChange={setSaleDate}
              calendar={persian}
              locale={persian_fa}
              calendarPosition="bottom-right"
              containerClassName="w-full"
              format="YYYY/MM/DD"
              arrow={false}
               render={(value, openCalendar) => (
                <div className="flex items-center w-full" onClick={openCalendar}>
                    <FaCalendarAlt className="text-gray-400 ml-2" />
                    <input type="text" readOnly value={value} placeholder="تاریخ فروش را انتخاب کنید" className={datePickerInputRenderClass} />
                </div>
              )}
            />
          </div>
        </div>

        {/* Buyer */}
        <div>
          <label htmlFor="buyer" className={labelClass}>خریدار از ما</label>
          <div className={inputContainerClass}>
            <FaUserTie className="text-gray-400 ml-2" />
            <input type="text" id="buyer" name="buyer" value={formFields.buyer} onChange={handleTextChange} placeholder="نام خریدار از ما (اختیاری)" className="flex-grow outline-none bg-transparent" />
          </div>
        </div>

        {/* Sell Price */}
        <div>
          <label htmlFor="sellPrice" className={labelClass}>قیمت فروش ما (تومان)</label>
          <div className={inputContainerClass}>
            <FaMoneyBillWave className="text-gray-400 ml-2" />
            <input type="number" id="sellPrice" name="sellPrice" value={formFields.sellPrice} onChange={handleTextChange} placeholder="قیمت فروش به خریدار (اختیاری)" className="flex-grow outline-none bg-transparent" />
          </div>
        </div>
        
        {/* IMEI */}
        <div>
          <label htmlFor="imei" className={labelClass}>شماره IMEI</label>
          <div className={inputContainerClass}>
            <FaMobileAlt className="text-gray-400 ml-2" />
            <input type="text" id="imei" name="imei" value={formFields.imei} onChange={handleTextChange} placeholder="IMEI را وارد کنید" className="flex-grow outline-none bg-transparent" />
          </div>
        </div>

        {/* Battery */}
        <div>
          <label htmlFor="battery" className={labelClass}>سلامت باتری</label>
          <div className={inputContainerClass}>
            <FaPercentage className="text-gray-400 ml-2" />
            <input type="text" id="battery" name="battery" value={formFields.battery} onChange={handleTextChange} placeholder="مثال: 90%" className="flex-grow outline-none bg-transparent" />
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <button
          type="submit"
          className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          disabled={isSubmitting}
        >
          <FaSave />
          {isSubmitting ? 'در حال ارسال...' : 'ثبت معامله گوشی'}
        </button>
      </div>
    </form>
  );
};

export default AddMobileForm;
