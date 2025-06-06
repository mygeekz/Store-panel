import React, { useState } from 'react';
import { FaMobileAlt, FaMemory, FaPalette, FaPercentage, FaUserTie, FaUser, FaMoneyBillWave, FaSave, FaTimes, FaCalendarAlt } from 'react-icons/fa';
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
// استایل‌ها را بر اساس نیاز خود انتخاب کنید
import "react-multi-date-picker/styles/layouts/mobile.css"; // یا یک استایل دیگر
import "react-multi-date-picker/styles/colors/purple.css"; // تم رنگی اختیاری

// URL وب اپلیکیشن Google Apps Script خود را اینجا قرار دهید
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxjgcyO-P46Ur4rbLsSHKHYN4EQzpjAGT7VINRZiIRCSmLwPpLLzCrne7cQUTkQThOa/exec"; // URL صحیح را وارد کنید

interface AddMobileFormProps {
  onClose?: () => void;
}

const AddMobileForm: React.FC<AddMobileFormProps> = ({ onClose }) => {
  
  const getTodayPersian = () => new DateObject({ calendar: persian, locale: persian_fa });

  // State برای فیلدهای متنی فرم
  const [formFields, setFormFields] = useState({
    model: '', ram: '', storage: '', color: '', imei: '',
    battery: '', buyer: '', seller: '', sellPrice: '', buyPrice: '',
  });

  // State مجزا برای DatePickerها
  const [purchaseDate, setPurchaseDate] = useState<DateObject | null>(getTodayPersian());
  const [saleDate, setSaleDate] = useState<DateObject | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'info' | 'error' | 'success'; text: string } | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormFields(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    // دریافت رشته تاریخ شمسی با فرمت "YYYY/MM/DD"
    const purchaseDateString = purchaseDate ? purchaseDate.format("YYYY/MM/DD") : "";
    const saleDateString = saleDate ? saleDate.format("YYYY/MM/DD") : "";

    if (!formFields.model || !formFields.ram || !formFields.storage || !formFields.color || !formFields.imei || !formFields.seller || !formFields.buyPrice || !purchaseDateString) {
        setSubmitMessage({ type: 'error', text: 'لطفاً تمام فیلدهای ستاره‌دار از جمله تاریخ خرید را پر کنید.' });
        setIsSubmitting(false);
        return;
    }

    const payload = {
      action: 'registerMobileDeal',
      ...formFields, // ارسال سایر فیلدهای فرم
      buyPrice: formFields.buyPrice ? Number(formFields.buyPrice) : 0,
      sellPrice: formFields.sellPrice ? Number(formFields.sellPrice) : 0,
      purchaseDate: purchaseDateString, // ارسال رشته تاریخ شمسی
      saleDate: saleDateString,         // ارسال رشته تاریخ شمسی
      // recordTimestamp دیگر از کلاینت ارسال نمی‌شود، سرور آن را ایجاد می‌کند
    };

    console.log('داده ارسالی به Google Apps Script (حاوی رشته تاریخ شمسی):', JSON.stringify(payload));

    try {
      // برای ارسال JSON و خواندن پاسخ JSON، باید از mode: 'cors' استفاده شود
      // و سرور Google Apps Script باید به درستی برای CORS پیکربندی شده باشد (با تابع doOptions و تنظیمات Deploy صحیح)
      const response = await fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'cors', 
        headers: {
           'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (response.ok) {
        const responseData = await response.json(); // انتظار پاسخ JSON از سرور
        if (responseData.success) {
            setSubmitMessage({ type: 'success', text: responseData.message || 'معامله گوشی با موفقیت ثبت شد.' });
            // ریست کردن فرم
            setFormFields({
                model: '', ram: '', storage: '', color: '', imei: '',
                battery: '', buyer: '', seller: '', sellPrice: '', buyPrice: '',
            });
            setPurchaseDate(getTodayPersian());
            setSaleDate(null);
        } else {
            setSubmitMessage({ type: 'error', text: responseData.message || 'سرور یک خطا برگرداند.' });
        }
      } else {
        // اگر response.ok نباشد (مثلاً خطای 4xx یا 5xx یا مشکل CORS حل نشده باشد)
        const errorText = await response.text(); // سعی کنید متن خطا را بخوانید
        console.error("HTTP Error:", response.status, errorText);
        setSubmitMessage({ type: 'error', text: `خطا در ارتباط با سرور: ${response.status}. ${errorText}. لطفاً تنظیمات CORS و Deploy اسکریپت را بررسی کنید.` });
      }

    } catch (error) { // این catch برای خطاهای شبکه یا اگر fetch به طور کامل شکست بخورد است
      console.error('خطا در ارسال (Fetch Error):', error);
      setSubmitMessage({ type: 'error', text: 'خطا در ارسال درخواست. کنسول و اتصال شبکه را بررسی کنید. مطمئن شوید مشکل CORS حل شده است.' });
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
          submitMessage.type === 'success' ? 'bg-green-100 text-green-700' :
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

        {/* Purchase Date (Persian/Jalali) */}
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
              placeholder="تاریخ خرید را انتخاب کنید"
              format="YYYY/MM/DD" // فرمت نمایش و دریافت تاریخ شمسی
              arrow={false}
              render={(value, openCalendar, onChange) => ( // اضافه کردن onChange به render
                <div className="flex items-center w-full" onClick={openCalendar}>
                    <FaCalendarAlt className="text-gray-400 ml-2" />
                    <input 
                        type="text" 
                        readOnly 
                        value={value} // مقدار فرمت شده تاریخ از DatePicker
                        placeholder="تاریخ خرید" 
                        className={datePickerInputRenderClass}
                        // onChange={(e) => onChange(e.target.value)} // اگر می‌خواهید تایپ دستی را هم مدیریت کنید
                    />
                </div>
              )}
            />
          </div>
        </div>
        
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
          <label htmlFor="ram" className={labelClass}>رم <span className="text-red-500">*</span></label>
          <div className={inputContainerClass}>
            <FaMemory className="text-gray-400 ml-2" />
            <select id="ram" name="ram" value={formFields.ram} onChange={handleTextChange} className="flex-grow outline-none bg-transparent" required>
              <option value="">انتخاب کنید...</option>
              <option value="2GB">2GB</option><option value="3GB">3GB</option><option value="4GB">4GB</option>
              <option value="6GB">6GB</option><option value="8GB">8GB</option><option value="12GB">12GB</option>
              <option value="16GB">16GB</option>
            </select>
          </div>
        </div>

        {/* Storage */}
        <div>
          <label htmlFor="storage" className={labelClass}>حافظه داخلی <span className="text-red-500">*</span></label>
          <div className={inputContainerClass}>
            <FaMemory className="text-gray-400 ml-2" />
            <select id="storage" name="storage" value={formFields.storage} onChange={handleTextChange} className="flex-grow outline-none bg-transparent" required>
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

        {/* Sale Date (Persian/Jalali) */}
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
              placeholder="تاریخ فروش را انتخاب کنید"
              format="YYYY/MM/DD" // فرمت نمایش و دریافت تاریخ شمسی
              arrow={false}
               render={(value, openCalendar, onChange) => ( // اضافه کردن onChange به render
                <div className="flex items-center w-full" onClick={openCalendar}>
                    <FaCalendarAlt className="text-gray-400 ml-2" />
                    <input 
                        type="text" 
                        readOnly 
                        value={value} 
                        placeholder="تاریخ فروش" 
                        className={datePickerInputRenderClass}
                        // onChange={(e) => onChange(e.target.value)} // اگر می‌خواهید تایپ دستی را هم مدیریت کنید
                    />
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
          <label htmlFor="imei" className={labelClass}>شماره IMEI <span className="text-red-500">*</span></label>
          <div className={inputContainerClass}>
            <FaMobileAlt className="text-gray-400 ml-2" />
            <input type="text" id="imei" name="imei" value={formFields.imei} onChange={handleTextChange} placeholder="IMEI را وارد کنید" className="flex-grow outline-none bg-transparent" required />
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
