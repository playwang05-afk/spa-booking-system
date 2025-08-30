import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, MapPin, CheckCircle, Star, Leaf } from 'lucide-react';

const App = () => {
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

  // ...existing code from spa_booking_system.tsx...

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

  // ...existing code from spa_booking_system.tsx...
  // 其餘內容（如 timeSlots、getAvailableDates、isTimeSlotAvailable、各 render function、return ...）
  // 請參考 spa_booking_system.tsx 內容完整搬移
};

export default App;