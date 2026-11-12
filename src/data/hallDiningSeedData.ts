import {
  HallDiningOverview,
  DailyMealMenu,
  MealOnOffSetting,
  GuestMealRequest,
  MealRatingFeedback,
  DishSuggestion,
  DiningComplaint,
  BazarCostEntry,
  StudentDiningBilling,
  DiningAuditTrailEntry,
  SpecialMealEvent,
  MealToken,
  MonthlyAuditStatus
} from '../types/hallDining';

/**
 * SAFETY RULES:
 * - Demo data only. Two demo halls: "Hall A (Demo)" and "Hall B (Demo)".
 * - Never invent real hall names, provost names, phone numbers, prices or timings;
 *   mark every such value "[REPLACE WITH REAL CONTENT]" on screen and in code.
 * - Prices and charges are demo numbers. Payments are mock only.
 */

export const initialHallOverviews: Record<'hall-a' | 'hall-b', HallDiningOverview> = {
  'hall-a': {
    id: 'hall-a',
    name: 'Oporajita Hall',
    nameBn: 'অপরাজিতা হল',
    provostTitle: 'Provost, Oporajita Hall [REPLACE WITH REAL CONTENT]',
    contactPhone: '+880 1700-000000 [REPLACE WITH REAL CONTENT]',
    contactEmail: 'oporajita.dining@jstu.ac.bd [REPLACE WITH REAL CONTENT]',
    diningRooms: [
      {
        id: 'hall-a-room-1',
        roomNumber: 'Dining Hall 1',
        name: 'Dining Hall 1 (Ground Floor)',
        nameBn: 'ডাইনিং হল ১ (নিচতলা)',
        capacity: 220,
        status: 'Open',
        managerRole: 'Dining Manager (Duty)',
        mealTimes: {
          lunch: '12:30 PM - 2:30 PM [REPLACE WITH REAL CONTENT]',
          dinner: '7:30 PM - 9:30 PM [REPLACE WITH REAL CONTENT]'
        }
      },
      {
        id: 'hall-a-room-2',
        roomNumber: 'Dining Hall 2',
        name: 'Dining Hall 2 (First Floor)',
        nameBn: 'ডাইনিং হল ২ (দ্বিতল)',
        capacity: 180,
        status: 'Open',
        managerRole: 'Dining Manager (Duty)',
        mealTimes: {
          lunch: '12:30 PM - 2:30 PM [REPLACE WITH REAL CONTENT]',
          dinner: '7:30 PM - 9:30 PM [REPLACE WITH REAL CONTENT]'
        }
      }
    ],
    mealRates: {
      breakfastRate: 35,
      lunchRate: 60,
      dinnerRate: 55,
      monthlyEstimatedRate: 150
    },
    cutoffHour: 20, // 8:00 PM cutoff
    notices: [
      {
        id: 'notice-a-1',
        title: 'Weekly Feast Dinner on Thursday [REPLACE WITH REAL CONTENT]',
        titleBn: 'বৃহস্পতিবারের বিশেষ নৈশভোজ [REPLACE WITH REAL CONTENT]',
        date: '2026-11-08',
        category: 'menu',
        content: 'Special dinner scheduled for Thursday night featuring demo chicken biryani and firni. Please confirm meal-on before 8:00 PM Wednesday.',
        contentBn: 'বৃহস্পতিবার রাতে বিশেষ খাবার (চিকেন বিরিয়ানি ও ফিরনি) পরিবেশন করা হবে। বুধবার রাত ৮টার মধ্যে মিল অন নিশ্চিত করুন।'
      },
      {
        id: 'notice-a-2',
        title: 'Meal On/Off Cutoff Timing Reminder [REPLACE WITH REAL CONTENT]',
        titleBn: 'মিল অন/অফ কাট-অফ সময় স্মরণিকা [REPLACE WITH REAL CONTENT]',
        date: '2026-11-05',
        category: 'schedule',
        content: 'Dining manager reminds all residents that meal cancellations for next day must be submitted before 8:00 PM strictly to avoid food wastage.',
        contentBn: 'পরবর্তী দিনের মিল বাতিলের জন্য প্রতিদিন রাত ৮:০০ টার মধ্যে আবেদন সম্পন্ন করতে হবে।'
      }
    ],
    rules: [
      {
        id: 'rule-a-1',
        ruleEn: 'Meal on/off toggle for next day must be set before 8:00 PM cutoff time.',
        ruleBn: 'পরবর্তী দিনের মিল অন/অফ প্রতিদিন রাত ৮:০০ টার মধ্যে সম্পন্ন করতে হবে।'
      },
      {
        id: 'rule-a-2',
        ruleEn: 'Students must carry digital student ID / token while taking meals at the counter.',
        ruleBn: 'খাবার গ্রহণের সময় কাউন্টারে ডিজিটাল স্টুডেন্ট আইডি কার্ড প্রদর্শন বাধ্যতামূলক।'
      },
      {
        id: 'rule-a-3',
        ruleEn: 'Guest meals require manager approval at least 12 hours prior to meal service.',
        ruleBn: 'মেহমান মিলের জন্য কমপক্ষে ১২ ঘণ্টা পূর্বে আবেদন করে অনুমোদন নিতে হবে।'
      },
      {
        id: 'rule-a-4',
        ruleEn: 'Food wastage is strictly discouraged; dining staff records feedback regularly.',
        ruleBn: 'খাবারের অপচয় রোধে সহযোগিতা করুন; নিয়মিত মতামত জানাতে ডাইনিং পোর্টাল ব্যবহার করুন।'
      }
    ]
  },
  'hall-b': {
    id: 'hall-b',
    name: 'Bijoy 24 Hall',
    nameBn: 'বিজয় ২৪ হল',
    provostTitle: 'Provost, Bijoy 24 Hall [REPLACE WITH REAL CONTENT]',
    contactPhone: '+880 1800-000000 [REPLACE WITH REAL CONTENT]',
    contactEmail: 'bijoy24.dining@jstu.ac.bd [REPLACE WITH REAL CONTENT]',
    diningRooms: [
      {
        id: 'hall-b-room-1',
        roomNumber: 'Dining Hall 1',
        name: 'Dining Hall 1 (Main Hall)',
        nameBn: 'ডাইনিং হল ১ (প্রধান হল)',
        capacity: 250,
        status: 'Open',
        managerRole: 'Dining Manager (Duty)',
        mealTimes: {
          breakfast: '7:30 AM - 9:30 AM [REPLACE WITH REAL CONTENT]',
          lunch: '12:30 PM - 2:30 PM [REPLACE WITH REAL CONTENT]',
          dinner: '7:30 PM - 9:30 PM [REPLACE WITH REAL CONTENT]'
        }
      },
      {
        id: 'hall-b-room-2',
        roomNumber: 'Dining Hall 2',
        name: 'Dining Hall 2 (Extension Wing)',
        nameBn: 'ডাইনিং হল ২ (বর্ধিত উইং)',
        capacity: 150,
        status: 'Under maintenance',
        managerRole: 'Dining Manager (Duty)',
        mealTimes: {
          breakfast: '7:30 AM - 9:30 AM [REPLACE WITH REAL CONTENT]',
          lunch: '12:30 PM - 2:30 PM [REPLACE WITH REAL CONTENT]',
          dinner: '7:30 PM - 9:30 PM [REPLACE WITH REAL CONTENT]'
        }
      }
    ],
    mealRates: {
      breakfastRate: 35,
      lunchRate: 60,
      dinnerRate: 55,
      monthlyEstimatedRate: 150
    },
    cutoffHour: 20,
    notices: [
      {
        id: 'notice-b-1',
        title: 'Maintenance in Extension Wing Dining Hall [REPLACE WITH REAL CONTENT]',
        titleBn: 'বর্ধিত উইং ডাইনিং হলের সংস্কার কাজ [REPLACE WITH REAL CONTENT]',
        date: '2026-11-07',
        category: 'maintenance',
        content: 'Dining Hall 2 is currently under routine water purifier maintenance. All residents are requested to dine in Main Hall 1.',
        contentBn: 'ডাইনিং হল ২-এ ফিল্টার সংস্কার চলার কারণে সকল আবাসিক শিক্ষার্থীকে মূল হল ১-এ খাবার গ্রহণের অনুরোধ করা হচ্ছে।'
      }
    ],
    rules: [
      {
        id: 'rule-b-1',
        ruleEn: 'Meal on/off cutoff is 8:00 PM daily. Uncanceled meals will be charged to resident account.',
        ruleBn: 'প্রতিদিন রাত ৮:০০ টার মধ্যে মিল বন্ধ না করলে মিল চার্জ অন্তর্ভুক্ত হবে।'
      },
      {
        id: 'rule-b-2',
        ruleEn: 'Monthly mess bills must be cleared by 10th of every calendar month.',
        ruleBn: 'প্রতি মাসের ১০ তারিখের মধ্যে পূর্ববর্তী মাসের মেস বিল পরিশোধ সম্পন্ন করতে হবে।'
      }
    ]
  }
};

export const initialWeeklyMenus: DailyMealMenu[] = [
  // Hall A Menus
  {
    id: 'menu-hall-a-mon',
    hallId: 'hall-a',
    dayOfWeek: 'Monday',
    dayOfWeekBn: 'সোমবার',
    breakfast: {
      items: ['Paratha (2 pcs)', 'Lentil Dal', 'Boiled Egg', 'Milk Tea'],
      itemsBn: ['পরোটা (২টি)', 'মসুর ডাল', 'সিদ্ধ ডিম', 'দুধ চা'],
      calorieEst: '480 kcal [REPLACE WITH REAL CONTENT]',
      dishes: [
        { name: 'Paratha (2 pcs)', nameBn: 'পরোটা (২টি)', calories: '260 kcal [REPLACE WITH REAL CONTENT]', protein: '5g [REPLACE WITH REAL CONTENT]', allergens: ['gluten'] },
        { name: 'Lentil Dal', nameBn: 'মসুর ডাল', calories: '90 kcal [REPLACE WITH REAL CONTENT]', protein: '4g [REPLACE WITH REAL CONTENT]' },
        { name: 'Boiled Egg', nameBn: 'সিদ্ধ ডিম', calories: '75 kcal [REPLACE WITH REAL CONTENT]', protein: '6g [REPLACE WITH REAL CONTENT]', allergens: ['egg'] },
        { name: 'Milk Tea', nameBn: 'দুধ চা', calories: '55 kcal [REPLACE WITH REAL CONTENT]', protein: '1.5g [REPLACE WITH REAL CONTENT]', allergens: ['milk'] }
      ]
    },
    lunch: {
      items: ['Plain Rice (Fine Atash)', 'Rohu Fish Curry with Potato', 'Seasonal Mixed Vegetable', 'Thick Dal'],
      itemsBn: ['সাদা ভাত', 'রুই মাছের ঝোল আলুর সাথে', 'মৌসুমি সবজি', 'ঘন ডাল'],
      calorieEst: '720 kcal [REPLACE WITH REAL CONTENT]',
      dishes: [
        { name: 'Plain Rice (Fine Atash)', nameBn: 'সাদা ভাত', calories: '340 kcal [REPLACE WITH REAL CONTENT]', protein: '6g [REPLACE WITH REAL CONTENT]' },
        { name: 'Rohu Fish Curry with Potato', nameBn: 'রুই মাছের ঝোল আলুর সাথে', calories: '210 kcal [REPLACE WITH REAL CONTENT]', protein: '19g [REPLACE WITH REAL CONTENT]', allergens: ['fish'] },
        { name: 'Seasonal Mixed Vegetable', nameBn: 'মৌসুমি সবজি', calories: '80 kcal [REPLACE WITH REAL CONTENT]', protein: '2g [REPLACE WITH REAL CONTENT]' },
        { name: 'Thick Dal', nameBn: 'ঘন ডাল', calories: '90 kcal [REPLACE WITH REAL CONTENT]', protein: '5g [REPLACE WITH REAL CONTENT]' }
      ]
    },
    dinner: {
      items: ['Plain Rice', 'Broiler Chicken Curry with Gravy', 'Eggplant Fry (Begun Bhaja)', 'Lentil Dal'],
      itemsBn: ['সাদা ভাত', 'মুরগির মাংসের ঝোল', 'বেগুন ভাজা', 'মসুর ডাল'],
      calorieEst: '690 kcal [REPLACE WITH REAL CONTENT]',
      dishes: [
        { name: 'Plain Rice', nameBn: 'সাদা ভাত', calories: '340 kcal [REPLACE WITH REAL CONTENT]', protein: '6g [REPLACE WITH REAL CONTENT]' },
        { name: 'Broiler Chicken Curry with Gravy', nameBn: 'মুরগির মাংসের ঝোল', calories: '230 kcal [REPLACE WITH REAL CONTENT]', protein: '22g [REPLACE WITH REAL CONTENT]' },
        { name: 'Eggplant Fry (Begun Bhaja)', nameBn: 'বেগুন ভাজা', calories: '70 kcal [REPLACE WITH REAL CONTENT]', protein: '1g [REPLACE WITH REAL CONTENT]' },
        { name: 'Lentil Dal', nameBn: 'মসুর ডাল', calories: '50 kcal [REPLACE WITH REAL CONTENT]', protein: '3g [REPLACE WITH REAL CONTENT]' }
      ]
    },
    status: 'PUBLISHED',
    publishedAt: '2026-11-01T10:00:00Z',
    publishedBy: 'dining_manager',
    version: 1
  },
  {
    id: 'menu-hall-a-tue',
    hallId: 'hall-a',
    dayOfWeek: 'Tuesday',
    dayOfWeekBn: 'মঙ্গলবার',
    breakfast: {
      items: ['Khichuri (Moong & Rice)', 'Omelette', 'Pickle', 'Tea'],
      itemsBn: ['মুগ ডালের ভুনা খিচুড়ি', 'ডিম অমলেট', 'আচার', 'চা'],
      calorieEst: '510 kcal [REPLACE WITH REAL CONTENT]'
    },
    lunch: {
      items: ['Plain Rice', 'Egg Curry (2 halves)', 'Mashed Potato (Aloo Bhorta)', 'Lentil Dal', 'Lemon'],
      itemsBn: ['সাদা ভাত', 'ডিম ভুনা', 'আলু ভর্তা', 'পাতলা ডাল', 'লেবু'],
      calorieEst: '650 kcal [REPLACE WITH REAL CONTENT]'
    },
    dinner: {
      items: ['Plain Rice', 'Pangash / Tilapia Fish Bhuna', 'Cabbage Stir Fry', 'Dal'],
      itemsBn: ['সাদা ভাত', 'তেলাপিয়া মাছ ভুনা', 'বাঁধাকপি ভাজি', 'ডাল'],
      calorieEst: '680 kcal [REPLACE WITH REAL CONTENT]'
    },
    status: 'PUBLISHED',
    publishedAt: '2026-11-01T10:00:00Z',
    publishedBy: 'dining_manager',
    version: 1
  },
  {
    id: 'menu-hall-a-wed',
    hallId: 'hall-a',
    dayOfWeek: 'Wednesday',
    dayOfWeekBn: 'বুধবার',
    breakfast: {
      items: ['Ruti (3 pcs)', 'Mixed Vegetable Bhaji', 'Banana', 'Tea'],
      itemsBn: ['লাল আটার রুটি (৩টি)', 'সবজি ভাজি', 'কলা', 'চা'],
      calorieEst: '440 kcal [REPLACE WITH REAL CONTENT]'
    },
    lunch: {
      items: ['Plain Rice', 'Katla Fish with Cauliflower', 'Spinach (Palong Shak)', 'Dal'],
      itemsBn: ['সাদা ভাত', 'ফুলকপি দিয়ে কাতলা মাছ', 'পালং শাক ভাজি', 'ডাল'],
      calorieEst: '700 kcal [REPLACE WITH REAL CONTENT]'
    },
    dinner: {
      items: ['Plain Rice', 'Beef Bhuna with Potato (Halal)', 'Salad', 'Thick Dal'],
      itemsBn: ['সাদা ভাত', 'আলু দিয়ে গরুর মাংস ভুনা', 'সালাদ', 'ঘন ডাল'],
      calorieEst: '780 kcal [REPLACE WITH REAL CONTENT]'
    },
    status: 'PUBLISHED',
    publishedAt: '2026-11-01T10:00:00Z',
    publishedBy: 'dining_manager',
    version: 1
  },
  {
    id: 'menu-hall-a-thu',
    hallId: 'hall-a',
    dayOfWeek: 'Thursday',
    dayOfWeekBn: 'বৃহস্পতিবার',
    isSpecialMeal: true,
    specialMealTitle: 'Weekly Special Feast Night [REPLACE WITH REAL CONTENT]',
    specialMealTitleBn: 'সাপ্তাহিক বিশেষ ভোজ রজনী [REPLACE WITH REAL CONTENT]',
    breakfast: {
      items: ['Paratha (2 pcs)', 'Chana Dal', 'Boiled Egg', 'Tea'],
      itemsBn: ['পরোটা (২টি)', 'বুটের ডাল', 'সিদ্ধ ডিম', 'চা'],
      calorieEst: '490 kcal [REPLACE WITH REAL CONTENT]'
    },
    lunch: {
      items: ['Plain Rice', 'Chicken Curry with Green Papaya', 'Tomato Chutney', 'Lentil Dal'],
      itemsBn: ['সাদা ভাত', 'পেঁপে দিয়ে মুরগির মাংস', 'টমেটো চাটনি', 'মসুর ডাল'],
      calorieEst: '670 kcal [REPLACE WITH REAL CONTENT]'
    },
    dinner: {
      items: ['Fragrant Polao (Chinigura Rice)', 'Chicken Roast (Sonali)', 'Egg Korma', 'Cucumber Salad', 'Rice Firni'],
      itemsBn: ['চিনিগুঁড়া চালের পোলাও', 'সোনালি মুরগির রোস্ট', 'ডিমের কোরমা', 'শসা সালাদ', 'চালের ফিরনি'],
      calorieEst: '950 kcal [REPLACE WITH REAL CONTENT]'
    },
    status: 'PUBLISHED',
    publishedAt: '2026-11-01T10:00:00Z',
    publishedBy: 'dining_manager',
    version: 1
  },
  {
    id: 'menu-hall-a-fri',
    hallId: 'hall-a',
    dayOfWeek: 'Friday',
    dayOfWeekBn: 'শুক্রবার',
    breakfast: {
      items: ['Sujee Halwa', 'Paratha (2 pcs)', 'Boiled Egg', 'Tea'],
      itemsBn: ['সুজির হালুয়া', 'পরোটা (২টি)', 'সিদ্ধ ডিম', 'চা'],
      calorieEst: '530 kcal [REPLACE WITH REAL CONTENT]'
    },
    lunch: {
      items: ['Plain Rice', 'Mutton / Beef Curry', 'Dal with Green Mango', 'Salad'],
      itemsBn: ['সাদা ভাত', 'খাসি/গরুর মাংসের পাতলা ঝোল', 'টক ডাল', 'সালাদ'],
      calorieEst: '790 kcal [REPLACE WITH REAL CONTENT]'
    },
    dinner: {
      items: ['Plain Rice', 'Small Fish Charchari (Kachki / Mola)', 'Lentil Dal', 'Aloo Bharta'],
      itemsBn: ['সাদা ভাত', 'কাঁচকি মাছের চচ্চড়ি', 'মসুর ডাল', 'আলু ভর্তা'],
      calorieEst: '630 kcal [REPLACE WITH REAL CONTENT]'
    },
    status: 'PUBLISHED',
    publishedAt: '2026-11-01T10:00:00Z',
    publishedBy: 'dining_manager',
    version: 1
  },
  {
    id: 'menu-hall-a-sat',
    hallId: 'hall-a',
    dayOfWeek: 'Saturday',
    dayOfWeekBn: 'শনিবার',
    breakfast: {
      items: ['Ruti (3 pcs)', 'Dal Fry', 'Boiled Egg', 'Tea'],
      itemsBn: ['রুটি (৩টি)', 'ডাল ফ্রাই', 'সিদ্ধ ডিম', 'চা'],
      calorieEst: '460 kcal [REPLACE WITH REAL CONTENT]'
    },
    lunch: {
      items: ['Plain Rice', 'Pabda Fish Jhol with Tomato', 'Pumpkin Bhaji', 'Dal'],
      itemsBn: ['সাদা ভাত', 'টমেটো দিয়ে পাবদা মাছের ঝোল', 'মিষ্টি কুমড়া ভাজি', 'ডাল'],
      calorieEst: '690 kcal [REPLACE WITH REAL CONTENT]'
    },
    dinner: {
      items: ['Plain Rice', 'Chicken Khichuri / Bhuna', 'Omelette', 'Salad'],
      itemsBn: ['সাদা ভাত / খিচুড়ি', 'চিকেন ভুনা', 'ডিম ভাজা', 'সালাদ'],
      calorieEst: '710 kcal [REPLACE WITH REAL CONTENT]'
    },
    status: 'PUBLISHED',
    publishedAt: '2026-11-01T10:00:00Z',
    publishedBy: 'dining_manager',
    version: 1
  },
  {
    id: 'menu-hall-a-sun',
    hallId: 'hall-a',
    dayOfWeek: 'Sunday',
    dayOfWeekBn: 'রবিবার',
    breakfast: {
      items: ['Paratha (2 pcs)', 'Potato Cauliflower Curry', 'Tea'],
      itemsBn: ['পরোটা (২টি)', 'আলু ফুলকপির তরকারি', 'চা'],
      calorieEst: '450 kcal [REPLACE WITH REAL CONTENT]'
    },
    lunch: {
      items: ['Plain Rice', 'Rohu Fish Kalia', 'Lal Shak Bhaji', 'Thick Dal'],
      itemsBn: ['সাদা ভাত', 'রুই মাছের কালিয়া', 'লাল শাক ভাজি', 'ঘন ডাল'],
      calorieEst: '710 kcal [REPLACE WITH REAL CONTENT]'
    },
    dinner: {
      items: ['Plain Rice', 'Egg Curry with Potato', 'Seasonal Vegetable', 'Dal'],
      itemsBn: ['সাদা ভাত', 'আলু দিয়ে ডিমের ঝোল', 'মৌসুমি সবজি', 'ডাল'],
      calorieEst: '660 kcal [REPLACE WITH REAL CONTENT]'
    },
    status: 'PUBLISHED',
    publishedAt: '2026-11-01T10:00:00Z',
    publishedBy: 'dining_manager',
    version: 1
  },

  // Hall B Menus (Similar structured layout)
  {
    id: 'menu-hall-b-mon',
    hallId: 'hall-b',
    dayOfWeek: 'Monday',
    dayOfWeekBn: 'সোমবার',
    breakfast: {
      items: ['Paratha (2 pcs)', 'Chana Dal Bhuna', 'Boiled Egg', 'Milk Tea'],
      itemsBn: ['পরোটা (২টি)', 'বুটের ডাল ভুনা', 'সিদ্ধ ডিম', 'দুধ চা'],
      calorieEst: '470 kcal [REPLACE WITH REAL CONTENT]'
    },
    lunch: {
      items: ['Plain Rice', 'Tilapia Fish Bhuna with Tomato', 'Mixed Vegetable', 'Dal'],
      itemsBn: ['সাদা ভাত', 'টমেটো দিয়ে তেলাপিয়া ভুনা', 'মিশ্র সবজি', 'ডাল'],
      calorieEst: '710 kcal [REPLACE WITH REAL CONTENT]'
    },
    dinner: {
      items: ['Plain Rice', 'Chicken Curry with Potatoes', 'Aloo Bharta', 'Dal'],
      itemsBn: ['সাদা ভাত', 'আলু দিয়ে মুরগির মাংস', 'আলু ভর্তা', 'ডাল'],
      calorieEst: '680 kcal [REPLACE WITH REAL CONTENT]'
    },
    status: 'PUBLISHED',
    publishedAt: '2026-11-01T10:00:00Z',
    publishedBy: 'dining_manager',
    version: 1
  },
  {
    id: 'menu-hall-b-tue',
    hallId: 'hall-b',
    dayOfWeek: 'Tuesday',
    dayOfWeekBn: 'মঙ্গলবার',
    breakfast: {
      items: ['Khichuri', 'Egg Omelette', 'Pickle', 'Tea'],
      itemsBn: ['ভুনা খিচুড়ি', 'ডিম ভাজা', 'লেবুর আচার', 'চা'],
      calorieEst: '520 kcal [REPLACE WITH REAL CONTENT]'
    },
    lunch: {
      items: ['Plain Rice', 'Egg Curry (2 pcs)', 'Potol Bhaji', 'Thick Dal'],
      itemsBn: ['সাদা ভাত', 'ডিম ভুনা (২টি)', 'পটল ভাজি', 'ঘন ডাল'],
      calorieEst: '660 kcal [REPLACE WITH REAL CONTENT]'
    },
    dinner: {
      items: ['Plain Rice', 'Pangas Fish Gravy', 'Pumpkin Curry', 'Dal'],
      itemsBn: ['সাদা ভাত', 'পাঙ্গাশ মাছের ঝোল', 'মিষ্টি কুমড়ার তরকারি', 'ডাল'],
      calorieEst: '670 kcal [REPLACE WITH REAL CONTENT]'
    },
    status: 'PUBLISHED',
    publishedAt: '2026-11-01T10:00:00Z',
    publishedBy: 'dining_manager',
    version: 1
  },
  {
    id: 'menu-hall-b-wed',
    hallId: 'hall-b',
    dayOfWeek: 'Wednesday',
    dayOfWeekBn: 'বুধবার',
    breakfast: {
      items: ['Ruti (3 pcs)', 'Mixed Vegetable', 'Banana', 'Tea'],
      itemsBn: ['রুটি (৩টি)', 'সবজি', 'কলা', 'চা'],
      calorieEst: '440 kcal [REPLACE WITH REAL CONTENT]'
    },
    lunch: {
      items: ['Plain Rice', 'Rui Fish Jhol', 'Shaak Bhaji', 'Dal'],
      itemsBn: ['সাদা ভাত', 'রুই মাছের ঝোল', 'শাক ভাজি', 'ডাল'],
      calorieEst: '700 kcal [REPLACE WITH REAL CONTENT]'
    },
    dinner: {
      items: ['Plain Rice', 'Beef Curry with Potato', 'Salad', 'Thick Dal'],
      itemsBn: ['সাদা ভাত', 'গরুর মাংসের ঝোল', 'সালাদ', 'ঘন ডাল'],
      calorieEst: '790 kcal [REPLACE WITH REAL CONTENT]'
    },
    status: 'PUBLISHED',
    publishedAt: '2026-11-01T10:00:00Z',
    publishedBy: 'dining_manager',
    version: 1
  },
  {
    id: 'menu-hall-b-thu',
    hallId: 'hall-b',
    dayOfWeek: 'Thursday',
    dayOfWeekBn: 'বৃহস্পতিবার',
    isSpecialMeal: true,
    specialMealTitle: 'Weekly Special Polao Night [REPLACE WITH REAL CONTENT]',
    specialMealTitleBn: 'সাপ্তাহিক স্পেশাল পোলাও নাইট [REPLACE WITH REAL CONTENT]',
    breakfast: {
      items: ['Paratha (2 pcs)', 'Lentil Dal', 'Egg', 'Tea'],
      itemsBn: ['পরোটা (২টি)', 'ডাল', 'ডিম', 'চা'],
      calorieEst: '480 kcal [REPLACE WITH REAL CONTENT]'
    },
    lunch: {
      items: ['Plain Rice', 'Chicken Jhol', 'Tomato Bhorta', 'Dal'],
      itemsBn: ['সাদা ভাত', 'চিকেন ঝোল', 'টমেটো ভর্তা', 'ডাল'],
      calorieEst: '670 kcal [REPLACE WITH REAL CONTENT]'
    },
    dinner: {
      items: ['Chinigura Polao', 'Chicken Roast', 'Egg Korma', 'Salad', 'Firni'],
      itemsBn: ['চিনিগুঁড়া পোলাও', 'চিকেন রোস্ট', 'ডিম কোরমা', 'সালাদ', 'ফিরনি'],
      calorieEst: '940 kcal [REPLACE WITH REAL CONTENT]'
    },
    status: 'PUBLISHED',
    publishedAt: '2026-11-01T10:00:00Z',
    publishedBy: 'dining_manager',
    version: 1
  },
  {
    id: 'menu-hall-b-fri',
    hallId: 'hall-b',
    dayOfWeek: 'Friday',
    dayOfWeekBn: 'শুক্রবার',
    breakfast: {
      items: ['Semolina Halwa', 'Paratha', 'Egg', 'Tea'],
      itemsBn: ['সুজির হালুয়া', 'পরোটা', 'ডিম', 'চা'],
      calorieEst: '520 kcal [REPLACE WITH REAL CONTENT]'
    },
    lunch: {
      items: ['Plain Rice', 'Mutton Curry', 'Mango Dal', 'Salad'],
      itemsBn: ['সাদা ভাত', 'খাসির মাংস', 'টক ডাল', 'সালাদ'],
      calorieEst: '800 kcal [REPLACE WITH REAL CONTENT]'
    },
    dinner: {
      items: ['Plain Rice', 'Small Fish Charchari', 'Dal', 'Aloo Bharta'],
      itemsBn: ['সাদা ভাত', 'ছোট মাছ চচ্চড়ি', 'ডাল', 'আলু ভর্তা'],
      calorieEst: '640 kcal [REPLACE WITH REAL CONTENT]'
    },
    status: 'PUBLISHED',
    publishedAt: '2026-11-01T10:00:00Z',
    publishedBy: 'dining_manager',
    version: 1
  },
  {
    id: 'menu-hall-b-sat',
    hallId: 'hall-b',
    dayOfWeek: 'Saturday',
    dayOfWeekBn: 'শনিবার',
    breakfast: {
      items: ['Ruti (3 pcs)', 'Dal Fry', 'Egg', 'Tea'],
      itemsBn: ['রুটি (৩টি)', 'ডাল ফ্রাই', 'ডিম', 'চা'],
      calorieEst: '450 kcal [REPLACE WITH REAL CONTENT]'
    },
    lunch: {
      items: ['Plain Rice', 'Pabda Fish Curry', 'Lau Shak', 'Dal'],
      itemsBn: ['সাদা ভাত', 'পাবদা মাছের ঝোল', 'লাউ শাক', 'ডাল'],
      calorieEst: '680 kcal [REPLACE WITH REAL CONTENT]'
    },
    dinner: {
      items: ['Plain Rice', 'Chicken Bhuna', 'Omelette', 'Salad'],
      itemsBn: ['সাদা ভাত', 'চিকেন ভুনা', 'ডিম ভাজা', 'সালাদ'],
      calorieEst: '700 kcal [REPLACE WITH REAL CONTENT]'
    },
    status: 'PUBLISHED',
    publishedAt: '2026-11-01T10:00:00Z',
    publishedBy: 'dining_manager',
    version: 1
  },
  {
    id: 'menu-hall-b-sun',
    hallId: 'hall-b',
    dayOfWeek: 'Sunday',
    dayOfWeekBn: 'রবিবার',
    breakfast: {
      items: ['Paratha (2 pcs)', 'Aloo Gobi Curry', 'Tea'],
      itemsBn: ['পরোটা (২টি)', 'আলু ফুলকপি', 'চা'],
      calorieEst: '460 kcal [REPLACE WITH REAL CONTENT]'
    },
    lunch: {
      items: ['Plain Rice', 'Rohu Fish', 'Lal Shak', 'Dal'],
      itemsBn: ['সাদা ভাত', 'রুই মাছ', 'লাল শাক', 'ডাল'],
      calorieEst: '710 kcal [REPLACE WITH REAL CONTENT]'
    },
    dinner: {
      items: ['Plain Rice', 'Egg Curry', 'Vegetable', 'Dal'],
      itemsBn: ['সাদা ভাত', 'ডিম ভুনা', 'সবজি', 'ডাল'],
      calorieEst: '650 kcal [REPLACE WITH REAL CONTENT]'
    },
    status: 'PUBLISHED',
    publishedAt: '2026-11-01T10:00:00Z',
    publishedBy: 'dining_manager',
    version: 1
  }
];

export const initialMealOnOffSettings: MealOnOffSetting[] = [
  {
    id: 'onoff-demo-1',
    studentId: 'JSTU2026001',
    studentName: 'Tanvir Ahmed',
    hallId: 'hall-a',
    dateStr: '2026-11-10', // Tomorrow
    breakfast: true,
    lunch: true,
    dinner: true,
    updatedAt: '2026-11-09T18:30:00Z'
  },
  {
    id: 'onoff-demo-2',
    studentId: 'JSTU2026001',
    studentName: 'Tanvir Ahmed',
    hallId: 'hall-a',
    dateStr: '2026-11-11',
    breakfast: false,
    lunch: true,
    dinner: true,
    updatedAt: '2026-11-09T19:00:00Z'
  },
  {
    id: 'onoff-demo-3',
    studentId: 'JSTU2026001',
    studentName: 'Tanvir Ahmed',
    hallId: 'hall-a',
    dateStr: '2026-11-12',
    breakfast: true,
    lunch: true,
    dinner: true,
    updatedAt: '2026-11-09T19:00:00Z'
  }
];

export const initialGuestMealRequests: GuestMealRequest[] = [
  {
    id: 'gmeal-req-01',
    studentId: 'JSTU2026001',
    studentName: 'Tanvir Ahmed',
    hallId: 'hall-a',
    date: '2026-11-12',
    mealType: 'dinner',
    guestCount: 2,
    reason: 'Family visit from home town [REPLACE WITH REAL CONTENT]',
    status: 'APPROVED',
    requestedAt: '2026-11-08T15:20:00Z',
    reviewedAt: '2026-11-08T17:00:00Z',
    reviewedBy: 'dining_manager',
    reviewNotes: 'Approved for Guest Dining Hall 1'
  },
  {
    id: 'gmeal-req-02',
    studentId: 'JSTU2026002',
    studentName: 'Nusrat Jahan',
    hallId: 'hall-a',
    date: '2026-11-13',
    mealType: 'lunch',
    guestCount: 1,
    reason: 'Project teammate visiting for research [REPLACE WITH REAL CONTENT]',
    status: 'PENDING',
    requestedAt: '2026-11-09T14:10:00Z'
  }
];

export const initialMealRatings: MealRatingFeedback[] = [
  {
    id: 'rating-01',
    studentId: 'JSTU2026001',
    hallId: 'hall-a',
    date: '2026-11-08',
    mealType: 'dinner',
    rating: 4,
    comment: 'Polao was fragrant and well-cooked. Firni sweetness was balanced.',
    createdAt: '2026-11-08T21:40:00Z'
  },
  {
    id: 'rating-02',
    studentId: 'JSTU2026003',
    hallId: 'hall-a',
    date: '2026-11-08',
    mealType: 'lunch',
    rating: 5,
    comment: 'Fresh fish and hot thick dal. Very satisfying meal.',
    createdAt: '2026-11-08T14:30:00Z'
  },
  {
    id: 'rating-03',
    studentId: 'JSTU2026004',
    hallId: 'hall-b',
    date: '2026-11-08',
    mealType: 'dinner',
    rating: 3,
    comment: 'Salt was slightly high in the vegetable dish.',
    createdAt: '2026-11-08T22:10:00Z'
  }
];

export const initialDishSuggestions: DishSuggestion[] = [
  {
    id: 'sugg-01',
    studentId: 'JSTU2026005', // Internal only, not rendered
    hallId: 'hall-a',
    dishName: 'Hilsha Fish with Mustard Gravy (Shorse Ilish) for Friday',
    description: 'Special seasonal treat once a month if budget allows.',
    voteCount: 42,
    votedStudentIds: ['JSTU2026001', 'JSTU2026002', 'JSTU2026003'],
    status: 'ACCEPTED',
    reviewReason: 'Approved for upcoming monthly celebration feast.',
    createdAt: '2026-11-02T12:00:00Z'
  },
  {
    id: 'sugg-02',
    studentId: 'JSTU2026001',
    hallId: 'hall-a',
    dishName: 'Kachchi Biryani with Borhani on Special Feast Days',
    description: 'High student demand for authentic Mutton / Beef Kachchi in winter semester.',
    voteCount: 78,
    votedStudentIds: ['JSTU2026002', 'JSTU2026004'],
    status: 'PENDING',
    createdAt: '2026-11-04T16:30:00Z'
  },
  {
    id: 'sugg-03',
    studentId: 'JSTU2026006',
    hallId: 'hall-a',
    dishName: 'Cholar Dal with Luchi for Sunday Breakfast',
    description: 'Alternative breakfast variety loved by dorm students.',
    voteCount: 26,
    votedStudentIds: [],
    status: 'PENDING',
    createdAt: '2026-11-06T09:15:00Z'
  },
  {
    id: 'sugg-04',
    studentId: 'JSTU2026007',
    hallId: 'hall-b',
    dishName: 'Duck Bhuna (Haasher Mangsho) in Winter',
    description: 'Traditional winter dish with thick gravy and plain rice.',
    voteCount: 35,
    votedStudentIds: [],
    status: 'ACCEPTED',
    reviewReason: 'Incorporated into next week special schedule.',
    createdAt: '2026-11-03T18:00:00Z'
  }
];

export const initialDiningComplaints: DiningComplaint[] = [
  {
    id: 'comp-01',
    referenceNumber: 'DC-2026-0842',
    hallId: 'hall-a',
    category: 'food_quality',
    description: 'Rice at dinner counter was cold on Sunday around 8:45 PM. Please ensure thermal food warmers are active.',
    isAnonymous: false,
    studentId: 'JSTU2026001',
    studentName: 'Tanvir Ahmed',
    status: 'RESOLVED',
    resolutionNotes: 'Dining manager inspected warmer units and instructed kitchen assistants to maintain heating until 9:30 PM.',
    createdAt: '2026-11-03T21:10:00Z',
    updatedAt: '2026-11-04T11:00:00Z'
  },
  {
    id: 'comp-02',
    referenceNumber: 'DC-2026-0855',
    hallId: 'hall-a',
    category: 'hygiene',
    description: 'Counter tray cleaning area had wet floor without cautionary sign. Water drainage needs clearing.',
    isAnonymous: true,
    status: 'UNDER_REVIEW',
    createdAt: '2026-11-08T13:45:00Z',
    updatedAt: '2026-11-08T15:30:00Z'
  },
  {
    id: 'comp-03',
    referenceNumber: 'DC-2026-0860',
    hallId: 'hall-b',
    category: 'portion_size',
    description: 'Fish portion cut was smaller than standard specification on Tuesday lunch.',
    isAnonymous: true,
    status: 'SUBMITTED',
    createdAt: '2026-11-09T14:00:00Z',
    updatedAt: '2026-11-09T14:00:00Z'
  }
];

export const initialBazarCostEntries: BazarCostEntry[] = [
  {
    id: 'bazar-01',
    hallId: 'hall-a',
    date: '2026-11-08',
    month: '2026-11',
    item: 'Miniket Rice (50kg sack x 8) [REPLACE WITH REAL CONTENT]',
    quantity: '400 kg',
    amount: 28000,
    enteredBy: 'dining_manager',
    enteredAt: '2026-11-08T08:30:00Z',
    version: 1
  },
  {
    id: 'bazar-02',
    hallId: 'hall-a',
    date: '2026-11-08',
    month: '2026-11',
    item: 'Broiler Chicken (Live weight) [REPLACE WITH REAL CONTENT]',
    quantity: '120 kg',
    amount: 21600,
    enteredBy: 'dining_manager',
    enteredAt: '2026-11-08T09:00:00Z',
    version: 1
  },
  {
    id: 'bazar-03',
    hallId: 'hall-a',
    date: '2026-11-08',
    month: '2026-11',
    item: 'Seasonal Vegetables (Potatoes, Cauliflower, Tomatoes) [REPLACE WITH REAL CONTENT]',
    quantity: '180 kg',
    amount: 8200,
    enteredBy: 'dining_manager',
    enteredAt: '2026-11-08T09:15:00Z',
    version: 1
  },
  {
    id: 'bazar-04',
    hallId: 'hall-a',
    date: '2026-11-07',
    month: '2026-11',
    item: 'Mustard Oil, Soybean Oil & Spices [REPLACE WITH REAL CONTENT]',
    quantity: '45 Litres + Spices',
    amount: 14500,
    enteredBy: 'dining_manager',
    enteredAt: '2026-11-07T10:00:00Z',
    version: 1
  },
  {
    id: 'bazar-05',
    hallId: 'hall-b',
    date: '2026-11-08',
    month: '2026-11',
    item: 'Coarse & Medium Rice (10 bags) [REPLACE WITH REAL CONTENT]',
    quantity: '500 kg',
    amount: 32000,
    enteredBy: 'dining_manager',
    enteredAt: '2026-11-08T08:45:00Z',
    version: 1
  },
  {
    id: 'bazar-06',
    hallId: 'hall-b',
    date: '2026-11-08',
    month: '2026-11',
    item: 'Fresh Rui Fish [REPLACE WITH REAL CONTENT]',
    quantity: '90 kg',
    amount: 25200,
    enteredBy: 'dining_manager',
    enteredAt: '2026-11-08T09:30:00Z',
    version: 1
  }
];

export const initialStudentBillings: StudentDiningBilling[] = [
  {
    id: 'bill-demo-01',
    studentId: 'JSTU2026001',
    studentName: 'Tanvir Ahmed',
    hallId: 'hall-a',
    diningRoomId: 'hall-a-room-1',
    month: 'October 2026',
    totalMeals: 58,
    breakfastCount: 20,
    lunchCount: 19,
    dinnerCount: 19,
    mealRate: 52.5,
    totalDue: 3045,
    paymentStatus: 'PAID',
    paidAt: '2026-11-03T14:20:00Z',
    receiptNumber: 'RCPT-HA-202610-0914',
    paymentMethod: 'bKash (Mock / Demo Gateway)'
  },
  {
    id: 'bill-demo-02',
    studentId: 'JSTU2026001',
    studentName: 'Tanvir Ahmed',
    hallId: 'hall-a',
    diningRoomId: 'hall-a-room-1',
    month: 'November 2026 (Current Demo)',
    totalMeals: 22,
    breakfastCount: 7,
    lunchCount: 8,
    dinnerCount: 7,
    mealRate: 53.0,
    totalDue: 1166,
    paymentStatus: 'UNPAID'
  }
];

export const initialDiningAuditTrail: DiningAuditTrailEntry[] = [
  {
    id: 'audit-d-01',
    timestamp: '2026-11-01T10:05:00Z',
    actorRole: 'dining_manager',
    actorUid: 'demo_dining_01',
    hallId: 'hall-a',
    action: 'MENU_PUBLISH',
    details: 'Weekly dining menu published for Oporajita Hall covering Monday to Sunday.'
  },
  {
    id: 'audit-d-02',
    timestamp: '2026-11-08T09:20:00Z',
    actorRole: 'dining_manager',
    actorUid: 'demo_dining_01',
    hallId: 'hall-a',
    action: 'COST_ENTRY',
    details: 'Daily bazar expenditure recorded: 400kg rice (BDT 28,000) and 120kg chicken (BDT 21,600).'
  },
  {
    id: 'audit-d-03',
    timestamp: '2026-11-04T11:05:00Z',
    actorRole: 'dining_manager',
    actorUid: 'demo_dining_01',
    hallId: 'hall-a',
    action: 'COMPLAINT_STATUS',
    details: 'Complaint DC-2026-0842 regarding warmer temperatures updated to RESOLVED.'
  },
  {
    id: 'audit-d-04',
    timestamp: '2026-11-08T17:02:00Z',
    actorRole: 'dining_manager',
    actorUid: 'demo_dining_01',
    hallId: 'hall-a',
    action: 'GUEST_MEAL_REVIEW',
    details: 'Guest meal request for Tanvir Ahmed (2 guests, dinner) APPROVED.'
  }
];

export const initialSpecialMealEvents: SpecialMealEvent[] = [
  {
    id: 'sme-01',
    hallId: 'hall-a',
    title: 'Winter Semester Grand Feast: Shahi Polao & Roast',
    titleBn: 'শীতকালীন সেমিস্টার গ্র্যান্ড ফিস্ট: শাহী পোলাও ও রোস্ট',
    date: '2026-11-13',
    mealType: 'dinner',
    menuDescription: 'Fragrant Chinigura Rice Polao, Sonali Chicken Roast, Egg Korma, Shahi Firni and Cucumber Borhani.',
    menuDescriptionBn: 'চিনিগুঁড়া চালের শাহী পোলাও, সোনালি মুরগির রোস্ট, ডিমের কোরমা, শাহী ফিরনি ও বোরহানি।',
    extraCharge: 80, // Demo charge in BDT
    signupMode: 'REQUIRED',
    cutoffTime: '2026-11-12T20:00:00Z',
    cutoffHour: 20,
    registeredStudentIds: ['JSTU2026001', 'JSTU2026002'],
    optedOutStudentIds: [],
    dishes: [
      { name: 'Shahi Polao', nameBn: 'শাহী পোলাও', calories: '480 kcal [REPLACE WITH REAL CONTENT]', protein: '8g [REPLACE WITH REAL CONTENT]', allergens: ['milk'] },
      { name: 'Sonali Chicken Roast', nameBn: 'সোনালি মুরগির রোস্ট', calories: '350 kcal [REPLACE WITH REAL CONTENT]', protein: '28g [REPLACE WITH REAL CONTENT]', allergens: ['nuts', 'milk'] },
      { name: 'Egg Korma', nameBn: 'ডিম কোরমা', calories: '160 kcal [REPLACE WITH REAL CONTENT]', protein: '7g [REPLACE WITH REAL CONTENT]', allergens: ['egg', 'milk'] },
      { name: 'Shahi Firni', nameBn: 'শাহী ফিরনি', calories: '210 kcal [REPLACE WITH REAL CONTENT]', protein: '5g [REPLACE WITH REAL CONTENT]', allergens: ['milk', 'nuts'] }
    ],
    createdAt: '2026-11-08T10:00:00Z',
    createdBy: 'demo_dining_01'
  },
  {
    id: 'sme-02',
    hallId: 'hall-b',
    title: 'Autumn Special Mutton Kacchi & Borhani Night',
    titleBn: 'হেমন্তের বিশেষ কাচ্চি বিরিয়ানি ও বোরহানি রজনী',
    date: '2026-11-14',
    mealType: 'lunch',
    menuDescription: 'Traditional Dum Mutton Kacchi Biryani served with spiced Borhani and Salad.',
    menuDescriptionBn: 'ঐতিহ্যবাহী দম খাসির কাচ্চি বিরিয়ানি ও মশলাদার বোরহানি।',
    extraCharge: 110,
    signupMode: 'AUTOMATIC',
    cutoffTime: '2026-11-13T20:00:00Z',
    cutoffHour: 20,
    registeredStudentIds: ['JSTU2026004'],
    optedOutStudentIds: [],
    dishes: [
      { name: 'Dum Mutton Kacchi', nameBn: 'দম খাসির কাচ্চি', calories: '750 kcal [REPLACE WITH REAL CONTENT]', protein: '34g [REPLACE WITH REAL CONTENT]', allergens: ['milk', 'nuts'] },
      { name: 'Borhani', nameBn: 'বোরহানি', calories: '120 kcal [REPLACE WITH REAL CONTENT]', protein: '3g [REPLACE WITH REAL CONTENT]', allergens: ['milk'] }
    ],
    createdAt: '2026-11-09T11:00:00Z',
    createdBy: 'demo_admin_01'
  }
];

export const initialMealTokens: MealToken[] = [
  {
    id: 'tok-01',
    token: 'a8f3b2c1d4e59072fe810234ac9811de',
    manualCode: '842109',
    studentId: 'JSTU2026001',
    maskedStudentName: 'T*****r A***d',
    hallId: 'hall-a',
    dateStr: '2026-11-10',
    mealType: 'dinner',
    expiresAt: '2026-11-10T21:30:00Z',
    isUsed: false
  },
  {
    id: 'tok-02',
    token: 'c3e4f5a6b7d819203142536475869708',
    manualCode: '319402',
    studentId: 'JSTU2026002',
    maskedStudentName: 'N****t J***n',
    hallId: 'hall-a',
    dateStr: '2026-11-10',
    mealType: 'lunch',
    expiresAt: '2026-11-10T14:30:00Z',
    isUsed: true,
    usedAt: '2026-11-10T13:15:00Z',
    servedCounter: 'Counter 1'
  },
  {
    id: 'tok-03',
    token: '9018273645e4f3a2b1c0d9e8f7a6b5c4',
    manualCode: '712953',
    studentId: 'JSTU2026003',
    maskedStudentName: 'F*****a K****r',
    hallId: 'hall-a',
    dateStr: '2026-11-10',
    mealType: 'breakfast',
    expiresAt: '2026-11-10T09:30:00Z',
    isUsed: false
  },
  {
    id: 'tok-04',
    token: 'b7c8d9e0f1a23456789abcdef0123456',
    manualCode: '551208',
    studentId: 'JSTU2026004',
    maskedStudentName: 'R****l H***n',
    hallId: 'hall-b',
    dateStr: '2026-11-10',
    mealType: 'dinner',
    expiresAt: '2026-11-10T21:30:00Z',
    isUsed: false
  }
];

export const initialMonthlyAuditStatuses: MonthlyAuditStatus[] = [
  {
    month: '2026-10',
    hallId: 'hall-a',
    isAudited: true,
    auditedAt: '2026-11-02T16:00:00Z',
    auditedBy: 'admin',
    auditNotes: 'Verified and signed off with bank account vouchers and meal receipts.'
  },
  {
    month: '2026-10',
    hallId: 'hall-b',
    isAudited: true,
    auditedAt: '2026-11-03T11:00:00Z',
    auditedBy: 'admin',
    auditNotes: 'All vouchers reconciled and audited.'
  },
  {
    month: '2026-11',
    hallId: 'hall-a',
    isAudited: false
  },
  {
    month: '2026-11',
    hallId: 'hall-b',
    isAudited: false
  }
];

