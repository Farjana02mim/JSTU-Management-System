import React, { useState, useEffect, useMemo } from 'react';
import {
  Camera,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Calendar,
  Sparkles,
  Download,
  Search
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { useLanguage } from '../../contexts/LanguageContext';
import { galleryPhotosData } from '../../data/publicSectionsSeedData';
import { UniversityGalleryImage, GalleryCategory } from '../../types/publicSections';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';

export const GalleryPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [selectedAlbum, setSelectedAlbum] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const albums = [
    { key: 'All', label: 'All Photos', labelBn: 'সকল ছবি' },
    { key: 'Architecture', label: 'Architecture', labelBn: 'ক্যাম্পাস স্থাপত্য' },
    { key: 'Laboratories', label: 'Laboratories & Facilities', labelBn: 'ল্যাবরেটরি ও বিজ্ঞানাগার' },
    { key: 'Campus Grounds', label: 'Campus Grounds & Nature', labelBn: 'সবুজ প্রাঙ্গণ' },
    { key: 'Events & Convocations', label: 'Events & Milestones', labelBn: 'অনুষ্ঠান ও সমাবর্তন' },
    { key: 'Student Life', label: 'Student Life', labelBn: 'শিক্ষার্থী জীবন' }
  ];

  const allPublishedPhotos = useMemo(() => {
    const store = SharedDataStoreManager.getInstance().getStore();
    const source = store.managedGallery && store.managedGallery.length > 0 ? store.managedGallery : galleryPhotosData;
    return source.filter((item: any) => item.status === 'published' || !item.status);
  }, []);

  const filteredPhotos = allPublishedPhotos.filter((item: any) => {
    if (selectedAlbum !== 'All' && item.category !== selectedAlbum) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = (isBn ? item.titleBn : item.title).toLowerCase().includes(q);
      const matchCaption = (isBn ? item.captionBn : item.caption).toLowerCase().includes(q);
      const matchAlbum = (isBn ? item.albumBn : item.album).toLowerCase().includes(q);
      if (!matchTitle && !matchCaption && !matchAlbum) return false;
    }
    return true;
  });

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % filteredPhotos.length : 0));
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + filteredPhotos.length) % filteredPhotos.length : 0
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredPhotos.length]);

  const activePhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-12 bg-white">
      <SEOHead
        title={isBn ? 'ছবি গ্যালারি ও ফটো অ্যালবাম' : 'Campus Photo Gallery & Media'}
        description="Photographic tour of JSTU campus architecture, research laboratories, botanical grounds, and university ceremonies."
      />

      <Breadcrumb items={[{ label: isBn ? 'ফটো গ্যালারি' : 'Photo Gallery' }]} />

      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
          {isBn ? 'ফটোগ্রাফিক প্রদর্শনী' : 'Visual Impressions'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
          {isBn ? 'ক্যাম্পাস ফটো গ্যালারি' : 'Campus Life & Architecture Gallery'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {isBn
            ? '৫০ একরের সবুজ প্রাঙ্গণ, আধুনিক একাডেমিক ভবন, অত্যাধুনিক বিজ্ঞানাগার এবং শিক্ষার্থীদের বর্ণিল মুহূর্তের আলোকচিত্র।'
            : 'Explore high-resolution photographs capturing our academic infrastructure, high-tech engineering facilities, campus greenery, and milestone ceremonies.'}
        </p>
      </div>

      {/* Toolbar: Album Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {albums.map((album) => (
            <button
              key={album.key}
              onClick={() => {
                setSelectedAlbum(album.key);
                setLightboxIndex(null);
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition cursor-pointer ${
                selectedAlbum === album.key
                  ? 'bg-[#1E3A8A] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isBn ? album.labelBn : album.label}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder={isBn ? 'ছবি খুঁজুন...' : 'Search photos by keyword...'}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setLightboxIndex(null);
            }}
            className="pl-8"
          />
        </div>
      </div>

      {/* Gallery Count */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          {isBn
            ? `মোট ${filteredPhotos.length}টি ছবি প্রদর্শিত হচ্ছে`
            : `Showing ${filteredPhotos.length} campus photographs`}
        </span>
      </div>

      {filteredPhotos.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
          <Camera className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">
            {isBn ? 'কোনো ছবি খুঁজে পাওয়া যায়নি' : 'No photos match your search criteria'}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedAlbum('All');
            }}
          >
            {isBn ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
          </Button>
        </div>
      ) : (
        /* Gallery Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPhotos.map((photo: any, index: number) => (
          <div
            key={photo.id}
            onClick={() => setLightboxIndex(index)}
            className="group relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs cursor-pointer bg-slate-100 hover:shadow-lg transition-all duration-300"
          >
            <div className="aspect-4/3 overflow-hidden">
              <img
                src={photo.imageUrl}
                alt={isBn ? (photo.titleBn || photo.title) : photo.title}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80';
                }}
              />
            </div>

            {/* Overlay On Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-white">
              <div className="flex justify-end">
                <span className="p-2 bg-white/20 backdrop-blur-xs rounded-full">
                  <Maximize2 className="w-4 h-4 text-white" />
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                  {isBn ? photo.categoryBn : photo.category}
                </span>
                <h4 className="text-xs font-bold leading-snug">
                  {isBn ? photo.titleBn : photo.title}
                </h4>
              </div>
            </div>

            <div className="p-3 bg-white border-t border-slate-100">
              <h5 className="text-xs font-bold text-[#0F172A] truncate">
                {isBn ? photo.titleBn : photo.title}
              </h5>
              <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                {photo.date}
              </span>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* LIGHTBOX MODAL */}
      {activePhoto && lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-sm flex flex-col justify-between p-4 sm:p-8 animate-fadeIn">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white border-b border-white/10 pb-4">
            <div className="space-y-0.5">
              <span className="text-xs text-amber-400 font-mono font-bold uppercase tracking-wider">
                {isBn ? activePhoto.albumBn : activePhoto.album} &bull; Photo {lightboxIndex + 1} of{' '}
                {filteredPhotos.length}
              </span>
              <h3 className="text-base sm:text-lg font-bold">
                {isBn ? activePhoto.titleBn : activePhoto.title}
              </h3>
            </div>

            <button
              onClick={() => setLightboxIndex(null)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              title="Close Lightbox (Esc)"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Central Image Container with Nav Arrows */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(
                  (lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length
                );
              }}
              className="absolute left-2 sm:left-6 z-10 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition cursor-pointer"
              title="Previous Photo (Left Arrow)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={activePhoto.imageUrl}
              alt={activePhoto.title}
              referrerPolicy="no-referrer"
              className="max-h-[70vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />

            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length);
              }}
              className="absolute right-2 sm:right-6 z-10 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition cursor-pointer"
              title="Next Photo (Right Arrow)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Caption Bar */}
          <div className="bg-slate-900/80 rounded-2xl p-4 text-white text-xs max-w-3xl mx-auto w-full text-center space-y-1">
            <p className="text-slate-300 leading-relaxed">
              {isBn ? activePhoto.captionBn : activePhoto.caption}
            </p>
            <span className="text-[11px] text-slate-500 block font-mono">
              /* [REPLACE WITH REAL CONTENT] Official JSTU Archive */ &bull; Date: {activePhoto.date}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
