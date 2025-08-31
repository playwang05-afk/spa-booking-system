// src/App.jsx
import React, { useState, useEffect } from 'react';
import BookingForm from './components/BookingForm';
import './App.css';

function App() {
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [firebaseStatus, setFirebaseStatus] = useState('connecting');

  useEffect(() => {
    // 檢查 Firebase 連接狀態
    const checkFirebaseConnection = async () => {
      try {
        if (window.db) {
          // 測試 Firestore 連接
          await window.db.collection('services').limit(1).get();
          setFirebaseStatus('connected');
          setIsFirebaseReady(true);
          console.log('✅ Firebase 連接成功');
        } else {
          throw new Error('Firebase 未初始化');
        }
      } catch (error) {
        console.error('❌ Firebase 連接失敗:', error);
        setFirebaseStatus('error');
        setIsFirebaseReady(false);
      }
    };

    // 延遲檢查，確保 Firebase 已完全載入
    const timer = setTimeout(checkFirebaseConnection, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // 初始化服務資料
  const initializeServices = async () => {
    if (!window.db) return;

    try {
      const servicesData = [
        {
          name: '經典多特瑞芳療按摩',
          description: '使用純天然多特瑞精油，深層放鬆身心',
          duration: 90,
          price: 2800,
          isActive: true,
          category: 'aromatherapy'
        },
        {
          name: '深層組織按摩',
          description: '針對深層肌肉緊張，有效舒緩疼痛',
          duration: 60,
          price: 2200,
          isActive: true,
          category: 'therapeutic'
        },
        {
          name: '放鬆精油按摩',
          description: '溫和精油按摩，適合日常放鬆',
          duration: 75,
          price: 2500,
          isActive: true,
          category: 'relaxation'
        },
        {
          name: '熱石按摩',
          description: '結合溫熱石療，深度放鬆肌肉',
          duration: 90,
          price: 3200,
          isActive: true,
          category: 'specialty'
        },
        {
          name: '孕婦專用按摩',
          description: '專為孕媽咪設計的安全按摩療程',
          duration: 60,
          price: 2400,
          isActive: true,
          category: 'prenatal'
        },
        {
          name: '瑞典式按摩',
          description: '經典瑞典式手法，促進血液循環',
          duration: 60,
          price: 2000,
          isActive: true,
          category: 'classic'
        }
      ];

      // 檢查服務是否已存在
      const servicesSnapshot = await window.db.collection('services').get();
      
      if (servicesSnapshot.empty) {
        console.log('🚀 初始化服務資料...');
        
        for (const service of servicesData) {
          await window.db.collection('services').add({
            ...service,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        }
        
        console.log('✅ 服務資料初始化完成');
      } else {
        console.log('📋 服務資料已存在，跳過初始化');
      }

      // 初始化按摩師資料
      const therapistsData = [
        {
          name: '林美玉',
          specialty: '資深芳療師',
          experience: 8,
          isAvailable: true,
          workingHours: {
            monday: ['09:00', '20:00'],
            tuesday: ['09:00', '20:00'],
            wednesday: ['09:00', '20:00'],
            thursday: ['09:00', '20:00'],
            friday: ['09:00', '20:00'],
            saturday: ['10:00', '18:00'],
            sunday: ['10:00', '18:00']
          }
        },
        {
          name: '陳雅文',
          specialty: '深層按摩專家',
          experience: 6,
          isAvailable: true,
          workingHours: {
            monday: ['09:00', '20:00'],
            tuesday: ['09:00', '20:00'],
            wednesday: ['09:00', '20:00'],
            thursday: ['09:00', '20:00'],
            friday: ['09:00', '20:00'],
            saturday: ['10:00', '18:00'],
            sunday: ['10:00', '18:00']
          }
        },
        {
          name: '張慧娟',
          specialty: '孕婦按摩專家',
          experience: 5,
          isAvailable: true,
          workingHours: {
            monday: ['09:00', '20:00'],
            tuesday: ['09:00', '20:00'],
            wednesday: ['09:00', '20:00'],
            thursday: ['09:00', '20:00'],
            friday: ['09:00', '20:00'],
            saturday: ['10:00', '18:00'],
            sunday: ['10:00', '18:00']
          }
        }
      ];

      const therapistsSnapshot = await window.db.collection('therapists').get();
      
      if (therapistsSnapshot.empty) {
        console.log('🚀 初始化按摩師資料...');
        
        for (const therapist of therapistsData) {
          await window.db.collection('therapists').add({
            ...therapist,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        }
        
        console.log('✅ 按摩師資料初始化完成');
      } else {
        console.log('👥 按摩師資料已存在，跳過初始化');
      }

    } catch (error) {
      console.error('❌ 資料初始化失敗:', error);
    }
  };

  // 當 Firebase 連接成功時初始化資料
  useEffect(() => {
    if (isFirebaseReady) {
      initializeServices();
    }
  }, [isFirebaseReady]);

  const renderFirebaseStatus = () => {
    switch (firebaseStatus) {
      case 'connecting':
        return (
          <div className="firebase-status connecting">
            <div className="spinner"></div>
            <span>連接 Firebase 中...</span>
          </div>
        );
      case 'error':
        return (
          <div className="firebase-status error">
            <span>❌ Firebase 連接失敗，請重新整理頁面</span>
          </div>
        );
      case 'connected':
        return (
          <div className="firebase-status success">
            <span>✅ Firebase 連接成功</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      {/* 頁首 */}
      <header className="app-header">
        <div className="container">
          <div className="logo">
            <h1>🌸 紫薰精油 SPA</h1>
            <p>doTERRA 多特瑞專業芳療</p>
          </div>
          
          <nav className="main-nav">
            <button 
              className={`nav-btn ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => setCurrentPage('home')}
            >
              首頁
            </button>
            <button 
              className={`nav-btn ${currentPage === 'booking' ? 'active' : ''}`}
              onClick={() => setCurrentPage('booking')}
            >
              立即預約
            </button>
          </nav>
        </div>
      </header>

      {/* Firebase 狀態顯示 */}
      {renderFirebaseStatus()}

      {/* 主要內容 */}
      <main className="main-content">
        {currentPage === 'home' && (
          <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
              <div className="container">
                <div className="hero-content">
                  <h2>專業精油 SPA 體驗</h2>
                  <p>使用頂級 doTERRA 多特瑞精油，為您帶來身心靈的完美放鬆</p>
                  <button 
                    className="cta-button"
                    onClick={() => setCurrentPage('booking')}
                  >
                    🌸 立即預約
                  </button>
                </div>
              </div>
            </section>

            {/* 服務項目 */}
            <section className="services">
              <div className="container">
                <h2>我們的服務</h2>
                <div className="services-grid">
                  <div className="service-item">
                    <div className="service-icon">🌿</div>
                    <h3>經典多特瑞芳療按摩</h3>
                    <p>90分鐘 | NT$ 2,800</p>
                    <span>使用純天然多特瑞精油</span>
                  </div>
                  <div className="service-item">
                    <div className="service-icon">💪</div>
                    <h3>深層組織按摩</h3>
                    <p>60分鐘 | NT$ 2,200</p>
                    <span>舒緩深層肌肉緊張</span>
                  </div>
                  <div className="service-item">
                    <div className="service-icon">🌸</div>
                    <h3>放鬆精油按摩</h3>
                    <p>75分鐘 | NT$ 2,500</p>
                    <span>溫和放鬆療程</span>
                  </div>
                  <div className="service-item">
                    <div className="service-icon">🔥</div>
                    <h3>熱石按摩</h3>
                    <p>90分鐘 | NT$ 3,200</p>
                    <span>溫熱石療深度放鬆</span>
                  </div>
                  <div className="service-item">
                    <div className="service-icon">🤱</div>
                    <h3>孕婦專用按摩</h3>
                    <p>60分鐘 | NT$ 2,400</p>
                    <span>孕媽咪安全療程</span>
                  </div>
                  <div className="service-item">
                    <div className="service-icon">❄️</div>
                    <h3>瑞典式按摩</h3>
                    <p>60分鐘 | NT$ 2,000</p>
                    <span>經典瑞典式手法</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 專業團隊 */}
            <section className="team">
              <div className="container">
                <h2>專業按摩師團隊</h2>
                <div className="team-grid">
                  <div className="team-member">
                    <div className="member-avatar">👩‍⚕️</div>
                    <h3>林美玉</h3>
                    <p>資深芳療師</p>
                    <span>8年經驗</span>
                  </div>
                  <div className="team-member">
                    <div className="member-avatar">👩‍⚕️</div>
                    <h3>陳雅文</h3>
                    <p>深層按摩專家</p>
                    <span>6年經驗</span>
                  </div>
                  <div className="team-member">
                    <div className="member-avatar">👩‍⚕️</div>
                    <h3>張慧娟</h3>
                    <p>孕婦按摩專家</p>
                    <span>5年經驗</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {currentPage === 'booking' && (
          <div className="booking-page">
            <div className="container">
              <h2>線上預約服務</h2>
              {isFirebaseReady ? (
                <BookingForm />
              ) : (
                <div className="loading-message">
                  <div className="spinner"></div>
                  <p>正在載入預約系統...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* 頁尾 */}
      <footer className="app-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>🌸 紫薰精油 SPA</h3>
              <p>專業 doTERRA 精油按摩服務</p>
            </div>
            <div className="footer-section">
              <h4>聯絡資訊</h4>
              <p>📞 02-1234-5678</p>
              <p>📧 info@purplespa.com</p>
            </div>
            <div className="footer-section">
              <h4>營業時間</h4>
              <p>週一至週日 09:00 - 21:00</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 紫薰精油 SPA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;