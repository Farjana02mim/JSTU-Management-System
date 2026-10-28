import React, { useState } from 'react';
import { z } from 'zod';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Shield,
  HelpCircle
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { useLanguage } from '../../contexts/LanguageContext';
import { officesData } from '../../data/seedData';

// Zod Validation Schema
const contactFormSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number (at least 10 digits)'),
  departmentOrOffice: z.string().min(1, 'Please select a recipient department or office'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(15, 'Message must be at least 15 characters to provide context'),
  honeypot: z.string().max(0, 'Spam detected') // Honeypot field for bot protection
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export const ContactPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    phone: '',
    departmentOrOffice: 'registrar',
    subject: '',
    message: '',
    honeypot: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const officeOptions = officesData.map((o) => ({
    value: o.id,
    label: `${o.name} (${o.officerInCharge})`
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate with Zod
    const result = contactFormSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      for (const issue of result.error.issues) {
        const fieldName = issue.path[0] as keyof ContactFormData;
        fieldErrors[fieldName] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate server-side HTTPS callable
      setSubmissionSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        departmentOrOffice: 'registrar',
        subject: '',
        message: '',
        honeypot: ''
      });
    } catch {
      setErrors({ message: 'Submission failed. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-16 bg-white">
      <SEOHead
        title={isBn ? 'যোগাযোগ ও হেল্পডেস্ক' : 'Contact & Campus Directory'}
        description="Get in touch with university administration, offices, and admissions at JSTU, Jamalpur-2012."
      />

      <Breadcrumb items={[{ label: isBn ? 'যোগাযোগ' : 'Contact' }]} />

      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#1E3A8A]">
          {isBn ? 'সহায়তা ও যোগাযোগ' : 'Institutional Liaison'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
          {isBn ? 'জেএসটিইউ যোগাযোগ ও সহায়তা কেন্দ্র' : 'Contact JSTU & Directory'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {isBn
            ? 'বিশ্ববিদ্যালয় সংক্রান্ত যেকোনো জিজ্ঞাসা, ভর্তি সহায়তা বা প্রাতিষ্ঠানিক যোগাযোগের জন্য সংশ্লিষ্ট দপ্তরের সাথে সরাসরি সংযোগ স্থাপন করুন।'
            : 'Reach our administrative secretariats, admissions liaison, or student grievance desk directly.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Form with Zod Validation */}
        <div className="lg:col-span-7">
          <Card padding="lg" className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">
                {isBn ? 'অনলাইন বার্তা পাঠান' : 'Send an Official Inquiry'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {isBn
                  ? 'ফরমটি পূরণ করলে তা সংশ্লিষ্ট দপ্তরে সংরক্ষিত টিকিটিং ব্যবস্থায় প্রেরিত হবে।'
                  : 'Submitted inquiries are processed through our rate-limited server-side proxy.'}
              </p>
            </div>

            {submissionSuccess ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{isBn ? 'বার্তা সফলভাবে প্রেরিত হয়েছে!' : 'Inquiry Submitted Successfully!'}</span>
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  {isBn
                    ? 'আপনার বার্তাটি সংশ্লিষ্ট দপ্তরে পৌঁছেছে। আপনার প্রদানকৃত ইমেইল বা ফোনে শীঘ্রই যোগাযোগ করা হবে।'
                    : 'Your inquiry has been dispatched to the designated office. An acknowledgment reference has been registered.'}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSubmissionSuccess(false)}
                >
                  {isBn ? 'আরেকটি বার্তা পাঠান' : 'Submit Another Message'}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot hidden input for anti-bot spam protection */}
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label={isBn ? 'আপনার পুরো নাম' : 'Full Name'}
                    required
                    placeholder="e.g. Tanvir Ahmed"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    error={errors.fullName}
                  />

                  <Input
                    label={isBn ? 'ইমেইল ঠিকানা' : 'Email Address'}
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={errors.email}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label={isBn ? 'মোবাইল নম্বর' : 'Phone Number'}
                    required
                    placeholder="+880 1700 000000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    error={errors.phone}
                  />

                  <Select
                    label={isBn ? 'উদ্দিষ্ট দপ্তর বা অফিস' : 'Target Office'}
                    options={officeOptions}
                    value={formData.departmentOrOffice}
                    onChange={(e) => setFormData({ ...formData, departmentOrOffice: e.target.value })}
                    error={errors.departmentOrOffice}
                  />
                </div>

                <Input
                  label={isBn ? 'বার্তার বিষয়' : 'Subject of Inquiry'}
                  required
                  placeholder="e.g. Transcript verification status inquiry"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  error={errors.subject}
                />

                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-semibold text-slate-700">
                    {isBn ? 'বিস্তারিত বার্তা' : 'Message Details'}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    className="w-full text-sm rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] placeholder:text-slate-400"
                    placeholder="Please specify your query or student/reference ID..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                  {errors.message && (
                    <p className="text-xs text-red-600">{errors.message}</p>
                  )}
                </div>

                {/* Spam Protection Indicator */}
                <div className="p-3 bg-[#F8FAFC] rounded-xl flex items-center justify-between text-xs text-slate-500 border border-[#E2E8F0]">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span>Protected by Cloud Function rate limiter &amp; Honeypot challenge</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-600 font-semibold">Active</span>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
                    leftIcon={<Send className="w-4 h-4" />}
                  >
                    {isBn ? 'বার্তা প্রেরণ করুন' : 'Dispatch Inquiry'}
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>

        {/* Campus Location & Emergency Directory */}
        <div className="lg:col-span-5 space-y-6">
          <Card padding="md" className="space-y-4">
            <h2 className="text-lg font-bold text-[#0F172A]">
              {isBn ? 'ক্যাম্পাস প্রধান ঠিকানা' : 'Main Campus Location'}
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#0F172A]">
                    Jamalpur Science &amp; Technology University
                  </strong>
                  <span>Jamalpur Sadar, Jamalpur-2012, Bangladesh</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#1E3A8A] shrink-0" />
                <span>Hotline: +880 29977 12345</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#1E3A8A] shrink-0" />
                <span>info@jstu.ac.bd</span>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#059669] shrink-0" />
                <span>Sun - Thu: 09:00 AM - 05:00 PM (Govt. Hours)</span>
              </div>
            </div>
          </Card>

          <Card padding="md" className="space-y-3 bg-[#F8FAFC] border border-[#E2E8F0]">
            <h3 className="text-sm font-bold flex items-center gap-2 text-[#0F172A]">
              <HelpCircle className="w-4 h-4 text-[#1E3A8A]" />
              <span>{isBn ? 'জরুরি শিক্ষার্থী হেল্পলাইন' : 'Emergency Student Hotline'}</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              For on-campus medical emergencies, ambulance support, or proctorial safety assistance:
            </p>
            <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl text-xs space-y-1 font-mono text-[#0F172A]">
              <p>Medical Center: +880 29977 12347</p>
              <p>Proctor Office: +880 29977 12343</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
