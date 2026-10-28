import React, { useState } from 'react';
import {
  Bus,
  Clock,
  MapPin,
  Phone,
  Download,
  Search,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Navigation,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { SEOHead } from '../../../components/common/SEOHead';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { useLanguage } from '../../../contexts/LanguageContext';
import { initialTransportRoutesData } from '../../../data/studentLifeSeedData';
import { TransportRoute } from '../../../types/studentLife';

export const TransportPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [routes] = useState<TransportRoute[]>(initialTransportRoutesData);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('all');
  const [direction, setDirection] = useState<'to_campus' | 'to_city'>('to_campus');
  const [feedback, setFeedback] = useState<string | null>(null);

  const filteredRoutes = routes.filter(
    (r) => selectedRouteId === 'all' || r.id === selectedRouteId
  );

  const handleDownloadTimetablePDF = () => {
    const textContent = `========================================================================
     JAMALPUR SCIENCE & TECHNOLOGY UNIVERSITY (JSTU)
         OFFICIAL CAMPUS BUS SCHEDULE & TIMETABLE 2026
========================================================================

Effective Date: October 2026 | Transport Pool Secretariat
Contact: Transport In-Charge (+880 1711-334411)

------------------------------------------------------------------------
ROUTE 01: Jamalpur Station - Doyamoyee Mor - Gatepar - JSTU Campus
------------------------------------------------------------------------
Bus: JSTU BUS-01 (Ashirbad) | Driver: Md. Dulal Mia (+880 1711-334411)
Morning Trip  : Departs Station 07:15 AM -> Arrives Campus 08:15 AM
Midday Trip   : Departs Station 12:30 PM -> Arrives Campus 01:30 PM
Afternoon Return: Departs Campus 02:30 PM -> Arrives Station 03:30 PM
Evening Return  : Departs Campus 05:30 PM -> Arrives Station 06:30 PM

------------------------------------------------------------------------
ROUTE 02: Melandaha Upazila Bazar - Aditmari - JSTU Campus
------------------------------------------------------------------------
Bus: JSTU BUS-02 (Shopno) | Driver: Md. Moniruzzaman (+880 1713-778833)
Morning Trip  : Departs Melandaha 07:20 AM -> Arrives Campus 08:10 AM
Midday Trip   : Departs Melandaha 12:35 PM -> Arrives Campus 01:25 PM
Afternoon Return: Departs Campus 02:45 PM -> Arrives Melandaha 03:30 PM
Evening Return  : Departs Campus 05:35 PM -> Arrives Melandaha 06:25 PM

------------------------------------------------------------------------
ROUTE 03: Sherpur Bridge Point - Nandina - Narundi - JSTU Campus
------------------------------------------------------------------------
Bus: JSTU BUS-03 (Uddipon) | Driver: Anwar Hossain (+880 1715-112255)
Morning Trip  : Departs Bridge Point 07:05 AM -> Arrives Campus 08:20 AM
Afternoon Return: Departs Campus 02:30 PM -> Arrives Bridge Point 03:40 PM
Evening Return  : Departs Campus 05:20 PM -> Arrives Bridge Point 06:30 PM

------------------------------------------------------------------------
ROUTE 04: Executive Staff Shuttle (Circuit House - JSTU Admin)
------------------------------------------------------------------------
Bus: JSTU MINIBUS-01 | Driver: Sujon Mia (+880 1717-556677)
Morning Trip  : Departs Officers Club 07:45 AM -> Arrives Admin 08:25 AM
Evening Return: Departs Admin 03:55 PM -> Arrives Officers Club 04:45 PM

========================================================================
All students and staff must carry valid institutional ID card.
Emergency Break-down Support: +880 1712-556622
========================================================================`;

    const blob = new Blob([textContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `JSTU_Campus_Bus_Timetable_2026.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setFeedback('Official Campus Bus Timetable PDF downloaded.');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      <SEOHead
        title={isBn ? 'ক্যাম্পাস পরিবহন ও বাস শিডিউল | জেএসটিইউ' : 'Campus Transport Fleet & Bus Timetable | JSTU'}
        description={
          isBn
            ? 'জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়ের বাস রুট, স্টপেজ, সময়সূচি এবং ড্রাইভারদের জরুরি যোগাযোগ নম্বর।'
            : 'JSTU campus bus routes, stoppages, morning/evening timetable, downloadable PDF schedule, and driver helpline.'
        }
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[#0A2540] via-[#1E3A8A] to-[#0A2540] text-white py-12 px-4 sm:px-8 border-b border-blue-900 shadow-md">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-amber-300 text-xs font-semibold border border-blue-400/30">
            <Bus className="w-3.5 h-3.5" />
            <span>{isBn ? 'বিশ্ববিদ্যালয় কেন্দ্রীয় পরিবহন পুল' : 'JSTU Transport Pool'}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {isBn ? 'ক্যাম্পাস বাস সার্ভিস ও রুট শিডিউল' : 'Campus Bus Fleet & Route Schedule'}
              </h1>
              <p className="text-sm sm:text-base text-blue-100 max-w-2xl mt-1 leading-relaxed">
                {isBn
                  ? 'জামালপুর রেলওয়ে স্টেশন, মেলান্দহ, নান্দিনা ও শেরপুর সংযোগকারী সার্বক্ষণিক শিক্ষার্থী ও শিক্ষক বাস সার্ভিস।'
                  : 'Reliable, daily campus transport connecting Jamalpur city center, railway station, Melandaha, and Sherpur.'}
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleDownloadTimetablePDF}
              className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold self-start md:self-auto shadow-md"
            >
              <Download className="w-4 h-4 mr-2" />
              <span>{isBn ? 'শিডিউল পিডিএফ ডাউনলোড' : 'Download Bus Timetable'}</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-8 space-y-8">
        {feedback && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{feedback}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600">
              &times;
            </button>
          </div>
        )}

        {/* Toolbar: Route Selector & Direction Toggle */}
        <Card padding="md" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setSelectedRouteId('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors ${
                  selectedRouteId === 'all'
                    ? 'bg-[#1E3A8A] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All 4 Routes
              </button>
              {routes.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRouteId(r.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors ${
                    selectedRouteId === r.id
                      ? 'bg-[#1E3A8A] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {r.routeCode}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
              <button
                onClick={() => setDirection('to_campus')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  direction === 'to_campus'
                    ? 'bg-white text-[#1E3A8A] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isBn ? 'ক্যাম্পাসের উদ্দেশ্যে (সকাল)' : 'Towards Campus (Morning / Noon)'}
              </button>
              <button
                onClick={() => setDirection('to_city')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  direction === 'to_city'
                    ? 'bg-white text-[#1E3A8A] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isBn ? 'শহরের উদ্দেশ্যে (বিকাল)' : 'Towards City (Afternoon / Evening)'}
              </button>
            </div>
          </div>
        </Card>

        {/* Route Details Cards */}
        <div className="space-y-6">
          {filteredRoutes.map((r) => (
            <Card key={r.id} padding="none" className="overflow-hidden border border-slate-200 shadow-sm">
              <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    <Bus className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-300">{r.routeCode}</span>
                      <span className="text-slate-300 text-xs">&bull; {r.busNumber}</span>
                    </div>
                    <h3 className="font-bold text-white text-base mt-0.5">{isBn ? r.routeNameBn : r.routeName}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">Driver Contact</span>
                    <span className="font-mono text-white font-bold">{r.driverName} ({r.driverPhone})</span>
                  </div>
                  <Badge variant="success">ON SCHEDULE</Badge>
                </div>
              </div>

              {/* Stoppages Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Stoppage Point</th>
                      {direction === 'to_campus' ? (
                        <>
                          <th className="p-3">Morning Departure (Up)</th>
                          <th className="p-3">Midday Departure (Up)</th>
                        </>
                      ) : (
                        <>
                          <th className="p-3">Afternoon Return (Down)</th>
                          <th className="p-3">Evening Return (Down)</th>
                        </>
                      )}
                      <th className="p-3 text-right">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {r.stoppages.map((stop, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="p-3 font-semibold text-slate-900 flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{isBn ? stop.stopNameBn : stop.stopName}</span>
                        </td>
                        {direction === 'to_campus' ? (
                          <>
                            <td className="p-3 font-mono font-bold text-slate-800">{stop.morningUp}</td>
                            <td className="p-3 font-mono text-slate-600">{stop.noonUp}</td>
                          </>
                        ) : (
                          <>
                            <td className="p-3 font-mono font-bold text-slate-800">{stop.afternoonDown}</td>
                            <td className="p-3 font-mono text-slate-600">{stop.eveningDown}</td>
                          </>
                        )}
                        <td className="p-3 text-right text-[11px] text-slate-400">
                          {i === 0 ? 'Starting Terminal' : i === r.stoppages.length - 1 ? 'Campus Final Stop' : 'Standard Boarding'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span>Supervisor: {r.supervisorName} ({r.supervisorPhone})</span>
                <span className="font-semibold text-[#1E3A8A]">Bus seating capacity: {r.capacity} Passengers</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
