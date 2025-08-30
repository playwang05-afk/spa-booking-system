import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, MapPin, CheckCircle, Star, Leaf } from 'lucide-react';

const SpaBookingSystem = () => {
  const [currentStep, setCurrentStep] = useState('service');
  const [bookingData, setBookingData] = useState({
    service: '',
    therapist: '',
    date: '',
    time: '',
    duration: 0,
    price: 0,
    customer: {
      name: '',
      phone: '',
      email: '',
      notes: ''
    }
  });

  const [bookings, setBookings] = useState([]);

  // 服務項目
  const services = [
    {
      id: 'aromatherapy_60',
      name: '經典多特瑞芳療按摩',
      duration: 60,
      price: 3200,
      description: '使用doTERRA純天然精油，深度放鬆身心',
      essential_oils: ['薰衣草', '檸檬', '薄荷']
    },
    {
      id: 'hot_stone_90',
      name: '多特瑞熱石精油按摩',
      duration: 90,
      price: 4200,
      description: '結合溫熱火山石與多特瑞頂級精油',
      essential_oils: ['乳香', '檀香', '天竺葵']
    },
    {
      id: 'deep_tissue_75',
      name: '多特瑞深層舒緩按摩',
      duration: 75,
      price: 3600,
      description: '運動後肌肉舒緩，使用多特瑞專業複方',
      essential_oils: ['冬青', '薄荷', '絲柏']
    },
    {
      id: 'prenatal_60',
      name: '多特瑞孕婦舒緩按摩',
      duration: 60,
      price: 3400,
      description: '專為孕期媽媽調配的溫和精油護理',
      essential_oils: ['薰衣草', '橙花', '羅馬洋甘菊']
    },
    {
      id: 'facial_spa_90',
      name: '多特瑞精油美顏護理',
      duration: 90,
      price: 4800,
      description: '臉部深層清潔與多特瑞精油滋養',
      essential_oils: ['乳香', '薰衣草', '茶樹']
    },
    {
      id: 'couple_massage_120',
      name: '多特瑞雙人芳療體驗',
      duration: 120,
      price: 7600,
      description: '情侶專屬浪漫時光，享受多特瑞頂級精油',
      essential_oils: ['依蘭', '佛手柑', '玫瑰']
    }
  ];

  // 按摩師資訊
  const therapists = [
    {
      id: 'therapist_1',
      name: '林美惠',
      specialties: ['芳療按摩', '熱石按摩'],
      experience: '8年經驗',
      rating: 4.9,
      avatar: '👩‍⚕️'
    },
    {
      id: 'therapist_2',
      name: '陳雅婷',
      specialties: ['深層按摩', '孕婦按摩'],
      experience: '6年經驗',
      rating: 4.8,
      avatar: '👩‍⚕️'
    },
    {
      id: 'therapist_3',
      name: '王淑芬',
      specialties: ['美顏護理', '雙人按摩'],
      experience: '10年經驗',
      rating: 5.0,
      avatar: '👩‍⚕️'
    }
  ];

  // 可預約時段
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  // 獲取未來7天日期
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  // 檢查時段是否可預約
  const isTimeSlotAvailable = (date, time, therapist) => {
    return !bookings.some(booking => 
      booking.date === date && 
      booking.time === time && 
      booking.therapist === therapist
    );
  };

  // 處理服務選擇
  const handleServiceSelect = (service) => {
    setBookingData(prev => ({
      ...prev,
      service: service.id,
      duration: service.duration,
      price: service.price
    }));
  };

  // 處理預約提交
  const handleBookingSubmit = () => {
    const newBooking = {
      id: Date.now(),
      ...bookingData,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    
    setBookings(prev => [...prev, newBooking]);
    setCurrentStep('confirmation');
  };

  // 重新開始預約
  const startNewBooking = () => {
    setCurrentStep('service');
    setBookingData({
      service: '',
      therapist: '',
      date: '',
      time: '',
      duration: 0,
      price: 0,
      customer: {
        name: '',
        phone: '',
        email: '',
        notes: ''
      }
    });
  };

  // 渲染步驟指示器
  const renderStepIndicator = () => {
    const steps = [
      { key: 'service', label: '選擇服務', icon: Leaf },
      { key: 'therapist', label: '選擇按摩師', icon: User },
      { key: 'datetime', label: '選擇時間', icon: Calendar },
      { key: 'customer', label: '客戶資訊', icon: Phone },
      { key: 'confirmation', label: '預約確認', icon: CheckCircle }
    ];

    return (
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.key === currentStep;
            const isCompleted = steps.findIndex(s => s.key === currentStep) > index;
            
            return (
              <div key={step.key} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2
                  ${isActive ? 'bg-purple-600 border-purple-600 text-white' : 
                    isCompleted ? 'bg-purple-100 border-purple-600 text-purple-600' : 
                    'bg-gray-100 border-gray-300 text-gray-400'}
                `}>
                  <Icon size={20} />
                </div>
                <span className={`ml-2 text-sm ${isActive ? 'text-purple-600 font-semibold' : 'text-gray-500'}`}>
                  {step.label}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 ml-4 ${isCompleted ? 'bg-purple-600' : 'bg-gray-300'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 渲染服務選擇
  const renderServiceSelection = () => (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">選擇您的療程服務</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => (
          <div key={service.id} className={`
            border rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg
            ${bookingData.service === service.id ? 'border-purple-500 bg-purple-50 shadow-md' : 'border-gray-200 hover:border-purple-300'}
          `}
          onClick={() => handleServiceSelect(service)}>
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-lg text-gray-800">{service.name}</h3>
              <span className="text-purple-600 font-bold text-lg">NT${service.price}</span>
            </div>
            <p className="text-gray-600 text-sm mb-3">{service.description}</p>
            <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
              <span className="flex items-center">
                <Clock size={16} className="mr-1" />
                {service.duration} 分鐘
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {service.essential_oils.map(oil => (
                <span key={oil} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                  {oil}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <button 
          onClick={() => setCurrentStep('therapist')}
          disabled={!bookingData.service}
          className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
        >
          下一步：選擇按摩師
        </button>
      </div>
    </div>
  );

  // 渲染按摩師選擇
  const renderTherapistSelection = () => (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">選擇您的專業按摩師</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {therapists.map(therapist => (
          <div key={therapist.id} className={`
            border rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg
            ${bookingData.therapist === therapist.id ? 'border-green-500 bg-green-50 shadow-md' : 'border-gray-200 hover:border-green-300'}
          `}
          onClick={() => setBookingData(prev => ({ ...prev, therapist: therapist.id }))}>
            <div className="text-center">
              <div className="text-4xl mb-3">{therapist.avatar}</div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">{therapist.name}</h3>
              <div className="flex items-center justify-center mb-2">
                <Star className="text-yellow-400 fill-current" size={16} />
                <span className="ml-1 text-sm text-gray-600">{therapist.rating}</span>
              </div>
              <p className="text-sm text-gray-500 mb-3">{therapist.experience}</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {therapist.specialties.map(specialty => (
                  <span key={specialty} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-8 space-x-4">
        <button 
          onClick={() => setCurrentStep('service')}
          className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
        >
          上一步
        </button>
        <button 
          onClick={() => setCurrentStep('datetime')}
          disabled={!bookingData.therapist}
          className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
        >
          下一步：選擇時間
        </button>
      </div>
    </div>
  );

  // 渲染日期時間選擇
  const renderDateTimeSelection = () => (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">選擇預約日期與時間</h2>
      
      {/* 日期選擇 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">選擇日期</h3>
        <div className="grid grid-cols-7 gap-3">
          {getAvailableDates().map(date => {
            const dateObj = new Date(date);
            const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
            const isToday = date === new Date().toISOString().split('T')[0];
            
            return (
              <div key={date} className={`
                border rounded-lg p-3 cursor-pointer text-center transition-all duration-200
                ${bookingData.date === date ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}
                ${isToday ? 'ring-2 ring-blue-200' : ''}
              `}
              onClick={() => setBookingData(prev => ({ ...prev, date, time: '' }))}>
                <div className="text-sm text-gray-500">週{dayNames[dateObj.getDay()]}</div>
                <div className="font-semibold">{dateObj.getDate()}</div>
                <div className="text-xs text-gray-400">{dateObj.getMonth() + 1}月</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 時間選擇 */}
      {bookingData.date && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">選擇時間</h3>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
            {timeSlots.map(time => {
              const isAvailable = isTimeSlotAvailable(bookingData.date, time, bookingData.therapist);
              
              return (
                <button key={time} 
                  onClick={() => setBookingData(prev => ({ ...prev, time }))}
                  disabled={!isAvailable}
                  className={`
                    p-3 rounded-lg border font-semibold transition-all duration-200
                    ${!isAvailable ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
                      bookingData.time === time ? 'border-purple-500 bg-purple-600 text-white' :
                      'border-gray-200 hover:border-purple-300 hover:bg-purple-50'}
                  `}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex justify-center space-x-4">
        <button 
          onClick={() => setCurrentStep('therapist')}
          className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
        >
          上一步
        </button>
        <button 
          onClick={() => setCurrentStep('customer')}
          disabled={!bookingData.date || !bookingData.time}
          className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
        >
          下一步：填寫資訊
        </button>
      </div>
    </div>
  );

  // 渲染客戶資訊表單
  const renderCustomerForm = () => (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">填寫客戶資訊</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">姓名 *</label>
          <input
            type="text"
            value={bookingData.customer.name}
            onChange={(e) => setBookingData(prev => ({
              ...prev,
              customer: { ...prev.customer, name: e.target.value }
            }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="請輸入您的姓名"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">電話 *</label>
          <input
            type="tel"
            value={bookingData.customer.phone}
            onChange={(e) => setBookingData(prev => ({
              ...prev,
              customer: { ...prev.customer, phone: e.target.value }
            }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="請輸入您的手機號碼"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={bookingData.customer.email}
            onChange={(e) => setBookingData(prev => ({
              ...prev,
              customer: { ...prev.customer, email: e.target.value }
            }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="請輸入您的Email（選填）"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">特殊需求或備註</label>
          <textarea
            value={bookingData.customer.notes}
            onChange={(e) => setBookingData(prev => ({
              ...prev,
              customer: { ...prev.customer, notes: e.target.value }
            }))}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="如有特殊需求或想要告知我們的事項，請在此說明..."
          />
        </div>
      </div>

      <div className="flex justify-center space-x-4 mt-8">
        <button 
          onClick={() => setCurrentStep('datetime')}
          className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
        >
          上一步
        </button>
        <button 
          onClick={handleBookingSubmit}
          disabled={!bookingData.customer.name || !bookingData.customer.phone}
          className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
        >
          確認預約
        </button>
      </div>
    </div>
  );

  // 渲染預約確認
  const renderConfirmation = () => {
    const selectedService = services.find(s => s.id === bookingData.service);
    const selectedTherapist = therapists.find(t => t.id === bookingData.therapist);
    
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-8 mb-6">
          <CheckCircle className="text-purple-600 mx-auto mb-4" size={64} />
          <h2 className="text-3xl font-bold text-purple-800 mb-2">預約成功！</h2>
          <p className="text-purple-700">您的預約已確認，我們期待為您提供最優質的多特瑞精油服務。</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 text-left">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">預約詳細資訊</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">服務項目：</span>
              <span className="font-semibold">{selectedService?.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">按摩師：</span>
              <span className="font-semibold">{selectedTherapist?.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">預約日期：</span>
              <span className="font-semibold">{new Date(bookingData.date).toLocaleDateString('zh-TW')}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">預約時間：</span>
              <span className="font-semibold">{bookingData.time}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">療程時長：</span>
              <span className="font-semibold">{bookingData.duration} 分鐘</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">客戶姓名：</span>
              <span className="font-semibold">{bookingData.customer.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">聯絡電話：</span>
              <span className="font-semibold">{bookingData.customer.phone}</span>
            </div>
            <div className="flex justify-between py-3 text-lg">
              <span className="text-gray-800 font-semibold">總費用：</span>
              <span className="text-purple-600 font-bold">NT$ {bookingData.price.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            📱 我們將在預約時間前1小時以簡訊提醒您<br/>
            📍 地址：台中市西屯區文心路二段201號<br/>
            📞 如需更改或取消預約，請提前24小時來電：04-2345-6789
          </p>
        </div>

        <button 
          onClick={startNewBooking}
          className="mt-6 bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
        >
          再次預約
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-lavender-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Leaf className="text-purple-600 mr-3" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">紫薰精油SPA</h1>
                <p className="text-sm text-gray-600">doTERRA多特瑞精油 • 專業芳療按摩</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin size={16} className="mr-1" />
              <span>台中市西屯區</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentStep !== 'confirmation' && renderStepIndicator()}
        
        {currentStep === 'service' && renderServiceSelection()}
        {currentStep === 'therapist' && renderTherapistSelection()}
        {currentStep === 'datetime' && renderDateTimeSelection()}
        {currentStep === 'customer' && renderCustomerForm()}
        {currentStep === 'confirmation' && renderConfirmation()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">聯絡資訊</h3>
              <div className="space-y-2 text-sm">
                <p className="flex items-center"><Phone size={16} className="mr-2" /> 04-2345-6789</p>
                <p className="flex items-center"><Mail size={16} className="mr-2" /> info@greenspa.com</p>
                <p className="flex items-center"><MapPin size={16} className="mr-2" /> 台中市西屯區文心路二段201號</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">營業時間</h3>
              <div className="text-sm space-y-1">
                <p>週一至週日：09:00 - 21:00</p>
                <p>國定假日正常營業</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">注意事項</h3>
              <div className="text-sm space-y-1">
                <p>• 請提前10分鐘到達</p>
                <p>• 取消預約請提前24小時</p>
                <p>• 孕婦請告知懷孕週數</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SpaBookingSystem;