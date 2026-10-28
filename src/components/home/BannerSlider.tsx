import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Users,
  Pause,
  Play,
  ArrowRight,
  FileText,
  Sparkles
} from 'lucide-react';
import { Button } from '../common/Button';
import { useLanguage } from '../../contexts/LanguageContext';
import { bannerSlidesData, BannerSlide } from '../../data/seedData';

export interface BannerSliderProps {
  onOpenPortalModal: (type: 'student' | 'teacher') => void;
}

export const BannerSlider: React.FC<BannerSliderProps> = ({ onOpenPortalModal }) => {
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<number | null>(null);

  const totalSlides = bannerSlidesData.length;

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        nextSlide();
      }, 5500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, nextSlide]);

  const currentSlide: BannerSlide = bannerSlidesData[currentIndex];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 }
      }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 40 : -40,
      opacity: 0,
      transition: { duration: 0.3 }
    })
  };

  return (
    <section className="bg-white border-b border-[#E2E8F0] py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Strong Academic Typography & Institutional CTAs */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EFF6FF] border border-[#BFDBFE] rounded-full text-xs font-semibold text-[#1E3A8A]">
              <Sparkles className="w-3.5 h-3.5 text-[#B45309]" />
              <span>{isBn ? 'স্মার্ট ও ডিজিটাল ক্যাম্পাস প্ল্যাটফর্ম' : 'Jamalpur-2012 · Smart Paperless Campus'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-[1.15]">
              {isBn
                ? 'একটি আধুনিক, ডিজিটাল ও কাগজবিহীন বিশ্ববিদ্যালয় বিনির্মাণে'
                : 'Building a Smarter, Digital & Paperless University'}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              {isBn
                ? 'অনলাইন ফলাফল প্রণয়ন, ডিজিটাল বিভাগীয় ছাড়পত্র ও সুরক্ষিত কিউআর সনদ যাচাইকরণসহ সকল একাডেমিক ও দাপ্তরিক কার্যাবলীর স্বয়ংক্রিয় সমাধান।'
                : 'Automated administrative workflows, tamper-proof semester grading, digital clearance, and verifiable e-credentials for Jamalpur Science & Technology University.'}
            </p>

            {/* CTAs: 4 requested buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/login">
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<GraduationCap className="w-4 h-4 text-amber-300" />}
                >
                  {isBn ? 'শিক্ষার্থী পোর্টাল' : 'Student Portal'}
                </Button>
              </Link>

              <Link to="/login">
                <Button
                  variant="secondary"
                  size="md"
                  leftIcon={<Users className="w-4 h-4 text-[#1E3A8A]" />}
                >
                  {isBn ? 'শিক্ষক পোর্টাল' : 'Teacher Portal'}
                </Button>
              </Link>

              <Link to="/admission">
                <Button variant="outline" size="md">
                  {isBn ? 'অনলাইনে আবেদন' : 'Apply Online'}
                </Button>
              </Link>

              <Link to="/notices">
                <Button
                  variant="ghost"
                  size="md"
                  leftIcon={<FileText className="w-4 h-4 text-[#1E3A8A]" />}
                >
                  {isBn ? 'বিজ্ঞপ্তি দেখুন' : 'View Notices'}
                </Button>
              </Link>
            </div>

            {/* Institutional Trust Indicators */}
            <div className="pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-semibold text-[#0F172A]">7 Departments Active</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1E3A8A]" />
                <span className="font-semibold text-[#0F172A]">6 Faculties</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="font-semibold text-[#0F172A]">Tamper-Proof QR Verified</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean White Framed Slider with Motion */}
          <div className="lg:col-span-6">
            <div
              className="bg-white border border-[#E2E8F0] rounded-2xl shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] overflow-hidden relative group"
              onMouseEnter={() => setIsPlaying(false)}
              onMouseLeave={() => setIsPlaying(true)}
              aria-roledescription="carousel"
              aria-label="Campus highlights photo carousel"
            >
              {/* Photo Area */}
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#F8FAFC]">
                <AnimatePresence initial={false} custom={direction} mode="sync">
                  <motion.div
                    key={currentSlide.id}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0"
                  >
                    <img
                      src={currentSlide.image}
                      alt={isBn ? currentSlide.titleBn : currentSlide.title}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80';
                      }}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Subtle image edge gradient at bottom for text readability */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

                {/* Next/Prev Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  aria-label="Previous slide"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#0F172A] shadow-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 cursor-pointer focus-visible:opacity-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Next slide"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#0F172A] shadow-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 cursor-pointer focus-visible:opacity-100"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Slider Bottom Caption Bar */}
              <div className="p-4 bg-white border-t border-[#E2E8F0] flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <span className="text-[11px] font-mono font-bold text-[#1E3A8A] uppercase tracking-wider block">
                    {isBn ? currentSlide.tagBn : currentSlide.tag}
                  </span>
                  <h3 className="text-sm font-bold text-[#0F172A] truncate">
                    {isBn ? currentSlide.titleBn : currentSlide.title}
                  </h3>
                </div>

                {/* Controls & Slide Indicators */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <div className="flex items-center gap-1.5">
                    {bannerSlidesData.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => goToSlide(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          currentIndex === idx ? 'w-6 bg-[#1E3A8A]' : 'w-2 bg-[#CBD5E1] hover:bg-slate-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
