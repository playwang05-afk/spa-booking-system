// src/components/BookingForm.jsx
import React, { useState, useEffect } from 'react';
import './BookingForm.css';

const BookingForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    service: '',
    therapist: '',
    bookingDate: '',
    bookingTime: '',
    specialRequests: '',
  });

  // 服務項目資料
  const services = [
    {
      id: 'doterra-massage',
      name: '經典多特瑞芳療按摩',
      icon: '🌿',
      duration: 90,
      price: 2800,
      description: '使用純天然多特瑞精油，深層放鬆身心'
    },
    {
      id: 'deep-tissue',
      name: '深層組織按摩', 
      icon: '💪',
      duration: 60,
      price: 2200,
      description: '針對深層肌肉緊張，有效舒緩疼痛'
    },
    {
      id: 'relaxing-oil',
      name: '放鬆精油按摩',
      icon: '🌸',
      duration: 75,
      price: 2500,
      description: '溫和精油按摩，適合日常放鬆'
    },
    {
      id: 'hot-stone',
      name: '熱石按摩',
      icon: '🔥',
      duration: 90,
      price: 3200,
      description: '結合溫熱石療，深度放鬆肌肉'
    },
    {
      id: 'prenatal',
      name: '孕婦專用按摩',
      icon: '🤱',
      duration: 60,
      price: 2400,
      description: '專為孕媽咪設計的安全按摩療程'
    },
    {
      id: 'swedish',
      name: '瑞典式按摩',
      icon: '❄️',
      duration: 60,
      price: 2000,
      description: '經典瑞典式手法，促進血液循環'
    }
  ];

  // 按摩師資料
  const therapists = [
    { id: 'lin', name: '林美玉', specialty: '資深芳療師', experience: 8 },
    { id: 'chen', name: '陳雅文', specialty: '深層按摩專家', experience: 6 },
    { id: 'chang', name: '張慧娟', specialty: '孕婦按摩專家', experience: 5 }
  ];

  // 可預約時間
  const timeSlots = [
    '09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00', '19:30'
  ];

  // 設定最小日期為今天
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
      dateInput.min = today;
    }
  }, []);

  // 處理表單輸入
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 處理服務選擇
  const handleServiceSelect = (serviceName) => {
    setFormData(prev => ({
      ...prev,
      service: serviceName
    }));
  };

  // 驗證當前步驟
  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.customerName.trim() && formData.customerPhone.trim();
      case 2:
        return formData.service && formData.therapist;
      case 3:
        return formData.bookingDate && formData.bookingTime;
      default:
        return true;
    }
  };

  // 下一步
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    } else {
      showMessage('請填寫所有必填欄位', 'error');
    }
  };

  // 上一步
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // 顯示訊息
  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  // 提交預約
  const submitBooking = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      showMessage('請填寫所有必填欄位', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      // 檢查 Firebase 是否可用
      if (!window.db) {
        throw new Error('Firebase 連接失敗，請重新整理頁面');
      }

      // 準備提交的資料
      const bookingData = {
        ...formData,
        status: '已預約',
        paymentStatus: '待付款',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      console.log('📤 提交預約資料:', bookingData);

      // 提交到 Firebase Firestore
      const docRef = await window.db.collection('bookings').add(bookingData);
      
      console.log('✅ 預約成功！文件ID:', docRef.id);

      // 同時儲存客戶資料
      try {
        await window.db.collection('customers').add({
          name: formData.customerName,
          phone: formData.customerPhone,
          email: formData.customerEmail,
          lastBooking: firebase.firestore.FieldValue.serverTimestamp(),
          totalBookings: 1
        });
      } catch (customerError) {
        console.warn('客戶資料儲存失敗（不影響預約）:', customerError);
      }

      // 顯示成功訊息
      showMessage(
        `🎉 預約成功！\n預約編號：${docRef.id}\n我們會盡快與您聯繫確認預約詳情。`,
        'success'
      );

      // 移到確認步驟
      setCurrentStep(4);

      // 3秒後重置表單
      setTimeout(() => {
        setFormData({
          customerName: '',
          customerPhone: '',
          customerEmail: '',
          service: '',
          therapist: '',
          bookingDate: '',
          bookingTime: '',
          specialRequests: '',
        });
        setCurrentStep(1);
      }, 5000);

    } catch (error) {
      console.error('❌ 預約提交失敗:', error);
      showMessage('預約失敗：' + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // 重新開始預約
  const startNewBooking = () => {
    setFormData({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      service: '',
      therapist: '',
      bookingDate: '',
      bookingTime: '',
      specialRequests: '',
    });
    setCurrentStep(1);
    setMessage('');
  };

  return (
    <div className="booking-container">
      {/* 進度指示器 */}
      <div className="progress-indicator">
        <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">個人資訊</div>
        </div>
        <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">選擇服務</div>
        </div>
        <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">預約時間</div>
        </div>
        <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
          <div className="step-number">4</div>
          <div className="step-label">確認預約</div>
        </div>
      </div>

      {/* 訊息顯示 */}
      {message && (
        <div className={`message ${messageType}`}>
          {message.split('\n').map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      )}

      <form onSubmit={submitBooking} className="booking-form">
        {/* 步驟 1: 個人資訊 */}
        {currentStep === 1 && (
          <div className="form-step">
            <h2>🧑‍💼 個人資訊</h2>
            
            <div className="form-group">
              <label htmlFor="customerName">姓名 *</label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder="請輸入您的姓名"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="customerPhone">聯絡電話 *</label>
              <input
                type="tel"
                id="customerPhone"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleInputChange}
                placeholder="0912-345-678"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="customerEmail">電子郵件 (選填)</label>
              <input
                type="email"
                id="customerEmail"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={nextStep} className="btn-primary">
                下一步 →
              </button>
            </div>
          </div>
        )}

        {/* 步驟 2: 選擇服務 */}
        {currentStep === 2 && (
          <div className="form-step">
            <h2>💆‍♀️ 選擇服務</h2>
            
            <div className="services-grid">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`service-card ${formData.service === service.name ? 'selected' : ''}`}
                  onClick={() => handleServiceSelect(service.name)}
                >
                  <div className="service-icon">{service.icon}</div>
                  <h3>{service.name}</h3>
                  <p className="service-description">{service.description}</p>
                  <div className="service-details">
                    <span className="duration">⏱️ {service.duration} 分鐘</span>
                    <span className="price">💰 NT$ {service.price}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="form-group">
              <label htmlFor="therapist">選擇按摩師 *</label>
              <select
                id="therapist"
                name="therapist"
                value={formData.therapist}
                onChange={handleInputChange}
                required
              >
                <option value="">請選擇按摩師</option>
                {therapists.map((therapist) => (
                  <option key={therapist.id} value={therapist.name}>
                    {therapist.name} - {therapist.specialty} ({therapist.experience}年經驗)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button type="button" onClick={prevStep} className="btn-secondary">
                ← 上一步
              </button>
              <button type="button" onClick={nextStep} className="btn-primary">
                下一步 →
              </button>
            </div>
          </div>
        )}

        {/* 步驟 3: 預約時間 */}
        {currentStep === 3 && (
          <div className="form-step">
            <h2>📅 預約時間</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bookingDate">預約日期 *</label>
                <input
                  type="date"
                  id="bookingDate"
                  name="bookingDate"
                  value={formData.bookingDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="bookingTime">預約時間 *</label>
                <select
                  id="bookingTime"
                  name="bookingTime"
                  value={formData.bookingTime}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">請選擇時間</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="specialRequests">特殊需求/備註</label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                rows="4"
                placeholder="如有任何特殊需求或過敏症狀，請在此說明..."
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={prevStep} className="btn-secondary">
                ← 上一步
              </button>
              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? '提交中...' : '確認預約 ✨'}
              </button>
            </div>
          </div>
        )}

        {/* 步驟 4: 確認頁面 */}
        {currentStep === 4 && (
          <div className="form-step">
            <div className="success-message">
              <div className="success-icon">🎉</div>
              <h2>預約成功！</h2>
              <p>感謝您的預約，我們會盡快與您聯繫確認詳情。</p>
              
              <div className="booking-summary">
                <h3>預約資訊摘要</h3>
                <div className="summary-item">
                  <strong>客戶姓名：</strong> {formData.customerName}
                </div>
                <div className="summary-item">
                  <strong>聯絡電話：</strong> {formData.customerPhone}
                </div>
                <div className="summary-item">
                  <strong>服務項目：</strong> {formData.service}
                </div>
                <div className="summary-item">
                  <strong>按摩師：</strong> {formData.therapist}
                </div>
                <div className="summary-item">
                  <strong>預約時間：</strong> {formData.bookingDate} {formData.bookingTime}
                </div>
              </div>

              <button 
                type="button" 
                onClick={startNewBooking} 
                className="btn-primary"
              >
                預約其他服務
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default BookingForm;