import React, { useEffect, useState, useRef } from 'react'
import {
  Globe, MessageCircle, ArrowRight,
  TrendingUp, Code2, Megaphone, BarChart3,
  Smartphone, Search, Mail, Phone, MapPin, 
  CheckCircle2, Users, Award, Zap, Menu, X, Star, Quote,
  Instagram, Play, Target, ClipboardCheck, Layers, Rocket,
  Linkedin
} from 'lucide-react'
import { Shader, Swirl, ChromaFlow, FlutedGlass, FilmGrain } from 'shaders/react'

/* ── Live clock in London ── */
export function Clock() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/London',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
      setTime(formatter.format(now))
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  return <span>{time}</span>
}

/* ── Hover Text Roll Animation ── */
function RollText({ text }: { text: string }) {
  return (
    <span className="relative block overflow-hidden h-[20px]">
      <span className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-1/2">
        <span className="h-[20px] flex items-center">{text}</span>
        <span className="h-[20px] flex items-center">{text}</span>
      </span>
    </span>
  )
}

/* ── Section Badge Row ── */
function SectionBadge({ number, label, isDark = false }: { number: string; label: string; isDark?: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-6 sm:mb-8">
      {/* Numbered circle */}
      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-[11px] sm:text-[12px] font-semibold shrink-0">
        {number}
      </div>
      {/* Pill label */}
      <div className={`text-[12px] sm:text-[13px] font-medium border ${isDark ? 'border-gray-300' : 'border-gray-200'} rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-gray-900`}>
        {label}
      </div>
    </div>
  )
}

/* ── Stats Animated Counter Hook ── */
function useCountUp(end: number, duration: number, trigger: boolean) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!trigger) return
    let frame = 0
    const startTime = performance.now()
    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setValue(Math.round(ease * end))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [trigger, end, duration])
  return value
}

/* ── Single animated stat card ── */
function AnimatedStat({
  num, suffix, label, desc, delay
}: { num: number; suffix: string; label: string; desc: string; delay: number }) {
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect() } },
      { threshold: 0.35 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const count = useCountUp(num, 2400, inView)

  return (
    <div
      ref={ref}
      className="liquid-glass stat-card rounded-3xl p-8 text-center flex flex-col justify-between"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(-48px)',
        transition: `opacity 0.65s ${delay}s cubic-bezier(0.22,1,0.36,1),
                     transform 0.65s ${delay}s cubic-bezier(0.22,1,0.36,1)`,
        minHeight: '260px',
      }}
    >
      <div>
        <p
          className="mb-3 white-shimmer"
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontWeight: 800,
            fontSize: '3.75rem',
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
          }}
        >
          {count}{suffix}
        </p>
        <p className="text-sm font-bold tracking-tight uppercase mb-3 text-gray-900">
          {label}
        </p>
      </div>
      <p className="text-xs leading-relaxed mt-2 pt-3 border-t border-gray-100 text-gray-500">
        {desc}
      </p>
    </div>
  )
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('hero')
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    service: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<null | 'success' | 'error'>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch("https://formsubmit.co/ajax/info.groveya@gmail.com", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          Name: `${formData.firstName} ${formData.lastName}`.trim(),
          Email: formData.email,
          Mobile: formData.mobile,
          Service: formData.service,
          Message: formData.message,
          _cc: "singhhemant9801@gmail.com",
          _subject: `New Contact Form Submission from ${formData.firstName} ${formData.lastName}`
        })
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          mobile: '',
          service: '',
          message: ''
        })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error(error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const sections = ['hero', 'services', 'work', 'about', 'leadership', 'testimonials', 'contact']
    const observers = sections.map((id) => {
      const el = document.getElementById(id)
      if (!el) return null
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveTab(id)
          }
        },
        { threshold: 0.2, rootMargin: '-10% 0px -60% 0px' }
      )
      observer.observe(el)
      return { observer, el }
    })

    return () => {
      observers.forEach((obs) => {
        if (obs) obs.observer.disconnect()
      })
    }
  }, [])

  // Services list
  const services = [
    { icon: <TrendingUp size={24} />, title: 'Digital Marketing', desc: 'Data-driven campaigns across SEO, PPC, and social media that convert visitors into loyal customers.' },
    { icon: <Code2 size={24} />, title: 'Web Development', desc: 'Blazing-fast, responsive websites and web apps built with modern technologies and clean code.' },
    { icon: <Megaphone size={24} />, title: 'Brand Strategy', desc: 'Craft a compelling brand identity — from logo to voice — that resonates with your target audience.' },
    { icon: <BarChart3 size={24} />, title: 'Analytics & Insights', desc: 'Turn raw data into strategic decisions with custom dashboards, KPI tracking, and growth reporting.' },
    { icon: <Smartphone size={24} />, title: 'App Development', desc: 'Native and cross-platform mobile apps that deliver seamless user experiences on iOS and Android.' },
    { icon: <Search size={24} />, title: 'SEO Optimization', desc: 'Dominate search rankings with technical SEO audits, keyword strategy, and high-authority link building.' },
  ]

  const serviceDetails: Record<string, string[]> = {
    'Digital Marketing': ['Campaign setup', 'Creative testing', 'Lead quality tracking'],
    'Web Development': ['Responsive UX', 'Conversion copy', 'Speed optimization'],
    'Brand Strategy': ['Brand voice', 'Offer positioning', 'Visual direction'],
    'Analytics & Insights': ['KPI dashboards', 'Call tracking', 'ROI reporting'],
    'App Development': ['Product roadmap', 'Interface design', 'Launch support'],
    'SEO Optimization': ['Local keywords', 'GMB optimization', 'Citation cleanup'],
  }

  const servicePillars = [
    { icon: <Target size={20} />, title: 'Audience Targeting', text: 'Campaigns begin with ideal customer profiles, location intent, and offer-fit filters.' },
    { icon: <Layers size={20} />, title: 'Creative Systems', text: 'Ad angles, landing page sections, and follow-up scripts are tested as one growth system.' },
    { icon: <ClipboardCheck size={20} />, title: 'Lead Verification', text: 'Quality checks help reduce junk enquiries and protect your sales team time.' },
    { icon: <Rocket size={20} />, title: 'Scale Planning', text: 'Winning campaigns are expanded with clear budget, channel, and conversion milestones.' },
  ]

  const processSteps = [
    { step: '01', title: 'Audit', text: 'We review your website, ads, GMB, social presence, and lead handling process.' },
    { step: '02', title: 'Build', text: 'We create the campaign structure, landing flow, tracking, creatives, and lead capture path.' },
    { step: '03', title: 'Optimize', text: 'We refine audiences, copy, budgets, and pages using weekly performance data.' },
    { step: '04', title: 'Scale', text: 'We double down on winning segments and turn growth activity into a repeatable system.' },
  ]

  // Stats list
  const stats = [
    { value: '250+', label: 'Clients Served', desc: 'Collaborated with ambitious startups and industry leaders globally to scale digital presence.' },
    { value: '98%', label: 'Satisfaction Rate', desc: 'A testament to our unwavering dedication to quality execution, clear reporting, and results.' },
    { value: '5x', label: 'Avg. ROI Delivered', desc: 'Consistently maximizing marketing budgets by optimizing conversion paths and lead quality.' },
    { value: '10+', label: 'Years Experience', desc: 'Over a decade of navigating complex search algorithms, brand positioning, and digital campaigns.' },
  ]

  const parsedStats = stats.map(s => {
    const m = s.value.match(/^(\d+)(.*)?$/)
    return { num: m ? parseInt(m[1]) : 0, suffix: m ? m[2] ?? '' : '', label: s.label, desc: s.desc }
  })

  // Case Studies
  const works: {
    tag: string;
    title: string;
    result: string;
    desc: string;
    image: string;
    video?: string;
    website?: string;
    gmb?: string;
    gmb2?: string;
    instagram?: string;
  }[] = [
    { 
      tag: 'Education', 
      title: 'Career Gurukul', 
      result: '+310% Enrolments', 
      desc: 'Scaled student admissions and lead acquisition through highly-targeted Local Search & PPC marketing.',
      image: '/career-gurukul.jpg',
      website: 'https://careergurukulindia.com/',
      gmb: 'https://share.google/nFag2P2gdsh1ON5Zk',
      instagram: 'https://www.instagram.com/career_gurukul_testprep/'
    },
    { 
      tag: 'Aesthetics', 
      title: 'Keynu Aesthetics', 
      result: '4.5x Leads Increase', 
      desc: 'Generated premium treatment bookings using refined landing pages and aesthetic Instagram branding.',
      image: '/keynu.jpg',
      website: 'https://keynu.in/',
      gmb: 'https://share.google/5mCLQgGdn12l4JZWD',
      instagram: 'https://www.instagram.com/keynuaesthetics/'
    },
    { 
      tag: 'Healthcare', 
      title: 'Balaji Dental Centre', 
      result: '+180% Bookings', 
      desc: 'Optimized GMB map pack visibility and patient acquisition funnels to maximize dental appointments.',
      image: '/balaji-dental.jpg',
      website: 'https://www.balajidentalcentre.com/',
      gmb: 'https://share.google/M8QLBW3wS4gmhKQ2n',
      instagram: 'https://www.instagram.com/balajidentalcentre/'
    },
    { 
      tag: 'Finance', 
      title: 'GLC Wealth Advisor', 
      result: '5x HNW Enquiries', 
      desc: 'Engineered lead generation flows targeting high-net-worth clients for premium advisory services.',
      image: '/glc-wealth.jpg',
      website: 'https://glcwealth.com/',
      gmb: 'https://share.google/FKf6uVxVPRSuT0foT',
      instagram: 'https://www.instagram.com/glcwealth/'
    },
    { 
      tag: 'Education', 
      title: 'Niraj Jha Classes', 
      result: '+260% Signups', 
      desc: 'Drove coaching institute enrolments through localized SEO strategies and search engine campaigns.',
      image: '/niraj-jha.jpg',
      website: 'https://www.nirajjhaclasses.in/',
      gmb: 'https://share.google/J922WzUzGZu8H9fGB',
      instagram: 'https://www.instagram.com/nirajjha.16/'
    },
    { 
      tag: 'Education', 
      title: 'Parth Institute', 
      result: '+220% Leads Grow', 
      desc: 'Strengthened localized enrollment for test prep courses using hyper-local SEO and maps prominence.',
      image: '/parth-institute.jpg',
      website: 'https://parthinstitute.co.in/',
      gmb: 'https://share.google/8iZJMoBtak8g56aJW',
      instagram: 'https://www.instagram.com/parth.institute.sec9/'
    },
  ]

  // Leadership Team
  const leaders = [
    {
      name: 'Aman Kadyan',
      role: 'CO-FOUNDER & CEO',
      image: '/ceo-cofounder.jpeg',
      desc: 'Steering agency operations, technology execution, and key campaigns management.'
    },
    {
      name: 'Hemant Singh',
      role: 'CTO',
      image: '/cto-portrait.jpeg',
      desc: 'Directing the architecture of robust applications, integrations, and tech stack.'
    },
  ]

  // Testimonials
  const testimonials: {
    name: string;
    role: string;
    quote: string;
    rating: number;
    video?: string;
  }[] = [
    {
      name: 'Dr. Keynu',
      role: 'Founder, Keynu Aesthetics',
      quote: 'The lead generation campaigns set up by groveya are incredibly high-quality. We saw a 4.5x increase in premium treatment bookings. They truly understand premium brand positioning.',
      rating: 5,
    },
    {
      name: 'Niraj Jha',
      role: 'Founder, Niraj Jha Classes',
      quote: 'We wanted to scale our offline commerce coaching batches in Rohini. groveya\'s local SEO strategies and targeted advertising brought in a 260% surge in student enquiries.',
      rating: 5,
    },
    {
      name: 'Puneet Kansal',
      role: 'Founder, Career Gurukul',
      quote: 'groveya transformed our digital student acquisition. Their local search campaigns and PPC optimizations boosted our course registrations by 310% in just a few months.',
      rating: 5,
    },
    {
      name: 'Dr. Mandeep',
      role: 'Owner, Roots Dental Clinic',
      quote: 'groveya optimized our local search map rankings (GMB) and dental bookings flow. Our patient appointments grew by 180%. Their transparency in reporting is refreshing.',
      rating: 5,
      video: '/dental-review.mp4',
    },
    {
      name: 'Sanchit Garg',
      role: 'Managing Partner, GLC Wealth',
      quote: 'Generating qualified advisory leads for high-net-worth investors is tough, but groveya delivered. They designed high-converting search funnels that increased our enquiries fivefold.',
      rating: 5,
    },
  ]

  // About lists
  const offers = [
    { icon: <Search size={18} />, label: 'High-Quality Lead Generation' },
    { icon: <TrendingUp size={18} />, label: 'Business Growth & Acquisition' },
    { icon: <BarChart3 size={18} />, label: 'Performance-Focused Marketing' },
    { icon: <Award size={18} />, label: 'Brand Building & Online Presence' },
    { icon: <Users size={18} />, label: 'Multi-Industry Lead Solutions' },
    { icon: <Zap size={18} />, label: 'ROI-Driven Campaign Management' },
  ]
  const reasons = [
    'Quality over quantity approach',
    'Verified and targeted leads',
    'Transparent communication & tracking',
    'Cost-effective marketing solutions',
    'Focus on maximizing return on investment (ROI)',
    'Customized strategies for every business scale',
  ]

  const proofPoints = [
    { value: '<2%', label: 'Junk lead target' },
    { value: '7 day', label: 'Reporting rhythm' },
    { value: '360', label: 'Website, ads, SEO, and sales view' },
  ]

  return (
    <div className="bg-[#EFEFEF] min-h-screen text-gray-900 font-sans antialiased overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════════════════
         SECTION 1: HERO (Full viewport height)
         ═══════════════════════════════════════════════════════════════════ */}
      <section id="hero" className="relative h-screen w-full flex flex-col justify-between overflow-hidden bg-[#EFEFEF]">
        
        {/* WebGL Animated Shader overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none w-full h-full">
          <Shader className="w-full h-full">
            <Swirl colorA="#ffffff" colorB="#f0f0f0" detail={1.7} />
            <ChromaFlow baseColor="#ffffff" leftColor="#ff5f03" rightColor="#ff5f03" upColor="#ff5f03" downColor="#ff5f03" momentum={13} radius={3.5} />
            <FlutedGlass aberration={0.61} angle={31} frequency={8} highlight={0.12} highlightSoftness={0} lightAngle={-90} refraction={4} shape="rounded" softness={1} speed={0.15} />
            <FilmGrain strength={0.05} />
          </Shader>
        </div>

        {/* Navigation */}
        <header className="z-20 relative w-full flex justify-center p-2 sm:p-3">
          <div className="w-full max-w-[1440px] bg-white rounded-full p-[5px] flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            
            {/* Logo and md+ links */}
            <div className="flex items-center">
              <a href="#hero" className="flex items-center gap-2 group mr-2 sm:mr-3">
                <img src="/logo-new.png" alt="groveya" className="w-8 h-8 sm:w-9 sm:h-9 object-contain" />
                <span className="text-[15px] sm:text-[17px] font-bold text-gray-900 font-sans tracking-tight group-hover:text-[#F26522] transition-colors">
                  groveya
                </span>
              </a>
              <nav className="hidden md:flex items-center gap-6 ml-4">
                {[
                  { href: '#services', label: 'Services' },
                  { href: '#work', label: 'Our Work' },
                  { href: '#about', label: 'About' },
                  { href: '#leadership', label: 'Leadership' },
                  { href: '#testimonials', label: 'Testimonials' },
                  { href: '#contact', label: 'Contact' },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-[14px] text-gray-900 hover:text-gray-500 transition-colors duration-300 font-medium"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Right details */}
            <div className="hidden md:flex items-center">
              <a
                href="#contact"
                className="bg-gray-900 hover:bg-gray-800 text-white text-[13px] font-medium rounded-full pl-5 pr-2 py-2 flex items-center gap-3 group transition-colors duration-300 cursor-pointer"
              >
                <RollText text="Book a strategy call" />
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-gray-900 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45 shrink-0">
                  <ArrowRight size={12} />
                </div>
              </a>
            </div>

            {/* Mobile Toggle Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-9 h-9 sm:w-10 sm:h-10 bg-gray-900 hover:bg-gray-800 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

          </div>
        </header>

        {/* Hero Content */}
        <div className="z-20 relative w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pb-14 sm:pb-16 lg:pb-20 flex-1 flex flex-col justify-end items-start">
          
          <span className="text-[13px] sm:text-[14px] text-gray-900 tracking-wide font-medium mb-5 sm:mb-8 uppercase">
            groveya
          </span>

          <h1 className="text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 max-w-[1100px]">
            Fueling Business Growth <br className="hidden sm:block" /><span className="sm:hidden"> </span>
            Through Smart Marketing <br className="hidden sm:block" /><span className="sm:hidden"> </span>
            &amp; Quality Leads.
          </h1>

          <p className="mt-6 text-sm sm:text-base text-gray-600 max-w-[550px] leading-relaxed">
            We help businesses recover their marketing investment with targeted lead generation, strategic branding, and conversion-focused campaigns.
          </p>

          {/* CTA Row */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center w-full sm:w-auto">
            {/* Get Leads orange button */}
            <a
              href="#contact"
              className="bg-[#F26522] hover:bg-[#e05a1a] text-white text-[13px] sm:text-[14px] font-medium rounded-full pl-5 sm:pl-6 pr-2 py-2 flex items-center gap-3 group transition-colors duration-300 cursor-pointer w-full sm:w-auto justify-between sm:justify-start"
            >
              <RollText text="Get More Leads Today" />
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center text-[#F26522] transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45 shrink-0">
                <ArrowRight size={14} />
              </div>
            </a>
          </div>

        </div>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 z-50 md:hidden flex flex-col justify-end transition-all duration-500 ${
          isMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}>
          {/* Backdrop */}
          <div
            onClick={() => setIsMenuOpen(false)}
            className="absolute inset-0 bg-black/60"
          />
          
          {/* Bottom sheet */}
          <div
            className={`relative bg-white rounded-2xl mx-3 mb-3 p-6 flex flex-col gap-6 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              isMenuOpen ? 'translate-y-0' : 'translate-y-full'
            }`}
          >
            {/* Top row */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <img src="/logo-new.png" alt="groveya" className="w-7 h-7 object-contain" />
                <span className="text-sm font-semibold text-gray-900">groveya</span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex flex-col gap-3 py-2">
              {[
                { href: '#services', label: 'Services' },
                { href: '#work', label: 'Our Work' },
                { href: '#about', label: 'About' },
                { href: '#leadership', label: 'Leadership' },
                { href: '#testimonials', label: 'Testimonials' },
                { href: '#contact', label: 'Contact' },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl sm:text-3xl font-medium text-gray-900 hover:text-gray-500 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Bottom Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 pt-4 border-t border-gray-100">
              <a
                href="#contact"
                onClick={() => setIsMenuOpen(false)}
                className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium rounded-full py-2.5 px-4 flex items-center justify-between group transition-colors duration-300 w-full sm:w-auto"
              >
                <span>Start a project</span>
                <ArrowRight size={12} className="ml-2 group-hover:translate-x-0.5 transition-transform duration-300" />
              </a>
            </div>
          </div>
        </div>

      </section>

      {/* ═══════════════════════════════════════════════════════════════════
         SECTION 2: STATS (White background)
         ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-white pt-16 sm:pt-20 lg:pt-28 pb-12 sm:pb-16 lg:pb-20 w-full flex justify-center border-t border-gray-100">
        <div className="w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
          
          <SectionBadge number="1" label="Performance Stats" />

          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {parsedStats.map((s, i) => (
              <AnimatedStat
                key={s.label}
                num={s.num}
                suffix={s.suffix}
                label={s.label}
                desc={s.desc}
                delay={i * 0.12}
              />
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
         SECTION 3: SERVICES (Light gray background)
         ═══════════════════════════════════════════════════════════════════ */}
      <section id="services" className="bg-[#F5F5F5] pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-24 w-full flex justify-center">
        <div className="w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
          
          <SectionBadge number="2" label="What We Do" isDark={true} />

          <h2 className="text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 mb-10 sm:mb-14 lg:mb-16">
            Our Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div
                key={s.title}
                className="liquid-glass service-card rounded-3xl p-8 flex flex-col justify-between min-h-[220px]"
              >
                <div>
                  {/* Icon wrap */}
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-900 mb-5 border border-gray-100">
                    {s.icon}
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 font-sans">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                    {s.desc}
                  </p>
                  <ul className="mt-5 flex flex-col gap-2">
                    {serviceDetails[s.title].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-[11px] font-semibold text-gray-700">
                        <CheckCircle2 size={14} className="text-[#F26522] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 sm:mt-12 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6">
            <div className="bg-gray-900 text-white rounded-3xl p-7 sm:p-8 flex flex-col justify-between min-h-[320px]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-4">
                  Growth Stack
                </p>
                <h3 className="text-2xl sm:text-3xl font-medium leading-tight max-w-md">
                  One connected system for attention, trust, enquiry, and follow-up.
                </h3>
              </div>
              <a
                href="#contact"
                className="mt-8 bg-white text-gray-900 hover:bg-gray-100 text-sm font-semibold rounded-full pl-5 pr-2 py-2 flex items-center justify-between gap-3 group transition-colors duration-300 w-full sm:w-fit"
              >
                <span>Plan my growth stack</span>
                <div className="w-7 h-7 rounded-full bg-[#F26522] flex items-center justify-center text-white transition-transform duration-500 group-hover:-rotate-45 shrink-0">
                  <ArrowRight size={13} />
                </div>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {servicePillars.map((pillar) => (
                <div key={pillar.title} className="bg-white rounded-2xl p-5 border border-gray-200/70 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#F26522] mb-4">
                    {pillar.icon}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2">{pillar.title}</h3>
                  <p className="text-xs leading-relaxed text-gray-500">{pillar.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 sm:mt-12 bg-white rounded-3xl border border-gray-200/70 shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-4">
              {processSteps.map((item) => (
                <div key={item.step} className="p-6 border-b md:border-b-0 md:border-r last:border-b-0 md:last:border-r-0 border-gray-100">
                  <p className="text-xs font-bold text-[#F26522] mb-4">{item.step}</p>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-xs leading-relaxed text-gray-500">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
         SECTION 4: CASE STUDIES (White background)
         ═══════════════════════════════════════════════════════════════════ */}
      <section id="work" className="bg-white pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28 w-full flex justify-center">
        <div className="w-full max-w-[1440px]">
          
          <div className="px-5 sm:px-8 lg:px-12">
            <SectionBadge number="3" label="Case Studies" />
            <h2 className="text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 mb-10 sm:mb-14 lg:mb-16">
              Featured projects
            </h2>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-5 sm:px-8 lg:px-12">
            {works.map((w, idx) => {
              const isDarkBtn = idx % 2 === 1;
              return (
                <div key={w.title} className="flex flex-col h-full">
                  {/* Video/Image container */}
                  <a
                    href={w.website || w.gmb}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 relative group cursor-pointer border border-gray-100 shadow-sm block"
                  >
                    {w.video ? (
                      <video
                        src={w.video}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.03]"
                      />
                    ) : (
                      <img
                        src={w.image}
                        alt={w.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.03]"
                      />
                    )}
                    
                    {/* Floating pill label */}
                    <div className="absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-semibold bg-white/95 text-gray-900 shadow-sm backdrop-blur-sm">
                      {w.tag}
                    </div>

                    {/* Expanding Hover button */}
                    {isDarkBtn ? (
                      <div className="absolute bottom-4 left-4 h-9 w-9 group-hover:w-[150px] bg-gray-900 rounded-full flex items-center justify-end transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] overflow-hidden shadow-lg">
                        <span className="text-[13px] font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 whitespace-nowrap pl-4 flex-1">
                          {w.website ? 'Visit Website' : 'View on Maps'}
                        </span>
                        <div className="w-9 h-9 flex items-center justify-center text-white shrink-0 -rotate-45 group-hover:rotate-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    ) : (
                      <div className="absolute bottom-4 left-4 h-9 w-9 group-hover:w-[150px] bg-white rounded-full flex items-center justify-end transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] overflow-hidden shadow-md">
                        <span className="text-[13px] font-medium text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 whitespace-nowrap pl-4 flex-1">
                          {w.website ? 'Visit Website' : 'View on Maps'}
                        </span>
                        <div className="w-9 h-9 flex items-center justify-center text-gray-900 shrink-0 -rotate-45 group-hover:rotate-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    )}
                  </a>

                  {/* Card content */}
                  <div className="mt-4 flex flex-col justify-between flex-1">
                    <div className="flex items-start justify-between w-full">
                      <div className="flex-1">
                        <h3 className="font-bold text-base text-gray-900">
                          {w.title}
                        </h3>
                        <p className="text-xs text-gray-500 leading-relaxed mt-1.5 max-w-[320px]">
                          {w.desc}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-[#F26522] bg-orange-50 px-2.5 py-1 rounded-full shrink-0 ml-3">
                        {w.result}
                      </span>
                    </div>

                    {/* Social/Web Links */}
                    <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
                      {w.website && (
                        <a
                          href={w.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200/60 rounded-full px-2.5 py-1 transition-colors"
                        >
                          <Globe size={11} className="text-gray-400" />
                          <span>Website</span>
                        </a>
                      )}
                      {w.gmb && (
                        <a
                          href={w.gmb}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200/60 rounded-full px-2.5 py-1 transition-colors"
                        >
                          <MapPin size={11} className="text-gray-400" />
                          <span>Google Maps</span>
                        </a>
                      )}
                      {w.gmb2 && (
                        <a
                          href={w.gmb2}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200/60 rounded-full px-2.5 py-1 transition-colors"
                        >
                          <MapPin size={11} className="text-gray-400" />
                          <span>Maps (Branch 2)</span>
                        </a>
                      )}
                      {w.instagram && (
                        <a
                          href={w.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200/60 rounded-full px-2.5 py-1 transition-colors"
                        >
                          <Instagram size={11} className="text-gray-400" />
                          <span>Instagram</span>
                        </a>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
         SECTION 5: ABOUT (Light gray background)
         ═══════════════════════════════════════════════════════════════════ */}
      <section id="about" className="bg-[#F5F5F5] pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-24 w-full flex justify-center">
        <div className="w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
          
          <SectionBadge number="4" label="About groveya" isDark={true} />

          <h2 className="text-[clamp(1.5rem,4vw,3.2rem)] font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 mb-12 sm:mb-16 lg:mb-20 max-w-[1100px]">
            Results-Driven Marketing <br className="hidden sm:block" />
            &amp; Lead Generation Agency
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 items-start mt-4">
            
            {/* Left: Paragraph and Offer details */}
            <div className="flex flex-col gap-6">
              <p className="text-[15px] sm:text-[17px] leading-[1.65] font-medium text-gray-900">
                We are a results-driven marketing and lead generation team built for businesses that need clearer positioning, stronger visibility, and better enquiries. Our mission is simple: help brands recover their marketing investment and turn digital attention into profitable growth.
              </p>
              
              <p className="text-[14px] sm:text-[15px] leading-[1.6] text-gray-500">
                We focus on delivering targeted, conversion-ready leads that help businesses attract genuine customers and increase revenue. Our lead generation process is designed to maintain exceptional quality, with a junk lead ratio of less than 2 out of every 100 leads generated.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {proofPoints.map((item) => (
                  <div key={item.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                    <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mt-1">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* What We Offer */}
              <div className="mt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-tight">
                  What We Offer
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {offers.map((item) => (
                    <div key={item.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-[#F26522] shrink-0">
                        {item.icon}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Why Choose Us & Lists */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/60 shadow-sm w-full">
              <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-tight">
                Why Choose Us?
              </h3>
              <ul className="space-y-4">
                {reasons.map((reason) => (
                  <li key={reason} className="flex gap-3 text-xs sm:text-sm leading-relaxed text-gray-600">
                    <CheckCircle2 size={18} className="mt-0.5 text-emerald-500 shrink-0" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-xs sm:text-sm text-gray-400 leading-relaxed">
                Our goal is not just to generate leads. We aim to create measurable business growth, strengthen your brand, and help you achieve sustainable profitability.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
         SECTION 6: LEADERSHIP (White background)
         ═══════════════════════════════════════════════════════════════════ */}
      <section id="leadership" className="bg-white pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-24 w-full flex justify-center">
        <div className="w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
          
          <SectionBadge number="5" label="Our Team" />

          <h2 className="text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 mb-10 sm:mb-14 lg:mb-16">
            Leadership Team
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 lg:gap-12 max-w-3xl mx-auto mt-8">
            {leaders.map((leader) => (
              <div
                key={leader.name}
                className="leader-card flex flex-col items-center text-center group"
              >
                {/* Photo container */}
                <div className="w-full aspect-[4/5] rounded-3xl overflow-hidden mb-6 bg-gray-50 border border-gray-150 relative shadow-sm">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="leader-photo w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  />
                  {/* Subtle dark overlay that fades on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-50 group-hover:opacity-10 transition-opacity duration-300" />
                </div>
                {/* Name */}
                <h3 className="font-bold text-base text-gray-900 group-hover:text-[#F26522] transition-colors duration-300">
                  {leader.name}
                </h3>
                {/* Title */}
                <p className="text-xs font-semibold text-[#F26522] mt-2 bg-orange-50 px-2.5 py-0.5 rounded-full">
                  {leader.role}
                </p>
                {/* Bio text */}
                <p className="text-xs text-gray-500 mt-2 leading-relaxed px-4">
                  {leader.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
         SECTION 7: TESTIMONIALS (Light gray background)
         ═══════════════════════════════════════════════════════════════════ */}
      <section id="testimonials" className="bg-[#F5F5F5] pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-24 w-full flex justify-center border-t border-gray-100">
        <div className="w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
          
          <SectionBadge number="6" label="Client Reviews" isDark={true} />

          <h2 className="text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 mb-10 sm:mb-14 lg:mb-16">
            What Our Clients Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-4">
            {testimonials.map((t, idx) => {
              let gridClasses = "col-span-1 md:col-span-6 lg:col-span-4";
              if (idx === 3) {
                gridClasses = "col-span-1 md:col-span-6 lg:col-span-4 lg:col-start-3";
              } else if (idx === 4) {
                gridClasses = "col-span-1 md:col-span-6 md:col-start-4 lg:col-span-4 lg:col-start-auto";
              }

              return (
                <div
                  key={t.name}
                  className={`liquid-glass testimonial-card rounded-3xl p-8 flex flex-col justify-between min-h-[240px] ${gridClasses}`}
                >
                  <div>
                    {/* Quote Icon & Stars */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex gap-0.5 text-amber-500">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} size={15} fill="currentColor" stroke="none" />
                        ))}
                      </div>
                      <Quote size={20} className="text-gray-300 transform rotate-180 shrink-0" />
                    </div>
                    {/* Quote text */}
                    <p className="text-[14px] sm:text-[15px] leading-relaxed text-gray-600 font-medium italic">
                      "{t.quote}"
                    </p>
                  </div>
                  {/* Author details */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-[14px] text-gray-900">
                        {t.name}
                      </h4>
                      <p className="text-[11px] font-semibold text-[#F26522] uppercase tracking-wider mt-0.5">
                        {t.role}
                      </p>
                    </div>
                    {t.video && (
                      <button
                        onClick={() => setActiveVideo(t.video ?? null)}
                        className="inline-flex items-center gap-2 bg-[#F26522] hover:bg-[#e05a1a] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 shrink-0 self-start sm:self-auto group cursor-pointer"
                      >
                        <Play size={12} fill="currentColor" className="group-hover:scale-110 transition-transform" />
                        <span>Watch Review</span>
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
         SECTION 8: CONTACT (White background)
         ═══════════════════════════════════════════════════════════════════ */}
      <section id="contact" className="bg-white pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-24 w-full flex justify-center border-t border-gray-150">
        <div className="w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
          
          <SectionBadge number="7" label="Get In Touch" isDark={false} />

          <h2 className="text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 mb-10 sm:mb-14 lg:mb-16">
            Start Your Growth Journey
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 items-start mt-4">
            
            {/* Form Box */}
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/60 shadow-sm flex flex-col gap-5 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-400 focus:bg-white transition-all text-gray-900"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-400 focus:bg-white transition-all text-gray-900"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-400 focus:bg-white transition-all text-gray-900"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Mobile Number</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-400 focus:bg-white transition-all text-gray-900"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Service Needed</label>
                <div className="relative">
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-400 focus:bg-white transition-all text-gray-900 w-full appearance-none"
                  >
                    <option value="">Select a service</option>
                    <option value="marketing">Digital Marketing</option>
                    <option value="web">Web Development</option>
                    <option value="brand">Brand Strategy</option>
                    <option value="seo">SEO Optimization</option>
                    <option value="app">App Development</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  placeholder="Tell us about your project..."
                  rows={3}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-400 focus:bg-white transition-all text-gray-900 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-gray-900 hover:bg-gray-800 text-white rounded-full py-3 text-[14px] font-semibold flex items-center justify-center gap-3 group transition-colors duration-300 w-full cursor-pointer mt-2 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <RollText text={isSubmitting ? 'Sending...' : 'Send Message'} />
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-gray-900 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45 shrink-0">
                  <ArrowRight size={12} />
                </div>
              </button>

              {submitStatus === 'success' && (
                <div className="text-emerald-600 bg-emerald-50 border border-emerald-200 text-xs font-semibold px-4 py-3 rounded-xl text-center">
                  Thank you! Your message has been sent successfully.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="text-red-600 bg-red-50 border border-red-200 text-xs font-semibold px-4 py-3 rounded-xl text-center">
                  Oops! Something went wrong. Please try again or email us directly at info.groveya@gmail.com.
                </div>
              )}
            </form>

            {/* Info Cards */}
            <div className="flex flex-col gap-5 w-full">
              {[
                { icon: <Mail size={20} />, label: 'Email Us', val: 'info.groveya@gmail.com' },
                { icon: <Phone size={20} />, label: 'Call Us', val: '+91 98916 37598' },
                { icon: <MapPin size={20} />, label: 'Visit Us', val: 'Rohini, Delhi, India' },
              ].map(c => (
                <div key={c.label} className="bg-white rounded-2xl p-6 flex items-center gap-5 border border-gray-200/50 shadow-sm w-full">
                  <div className="w-11 h-11 rounded-full bg-orange-50 flex items-center justify-center text-[#F26522] shrink-0 border border-orange-100">
                    {c.icon}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-0.5 text-gray-400 font-bold">{c.label}</p>
                    <p className="text-sm font-semibold text-gray-900">{c.val}</p>
                  </div>
                </div>
              ))}

            </div>

          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
         FOOTER
         ═══════════════════════════════════════════════════════════════════ */}
      <footer className="bg-white pb-28 sm:pb-10 px-6 pt-8 w-full flex justify-center border-t border-gray-150">
        <div className="w-full max-w-[1440px]">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo-new.png" alt="groveya" className="w-8 h-8 object-contain" />
                <span className="text-base font-bold text-gray-900 font-sans tracking-tight">groveya</span>
              </div>
              <p className="text-xs leading-relaxed mb-4 text-gray-400 font-medium">
                Technologies &amp; Growth Partners helping businesses thrive in the digital world.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/groveyaa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8.5 h-8.5 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 border border-gray-100 transition-colors cursor-pointer"
                  aria-label="Instagram"
                >
                  <Instagram size={16} />
                </a>
                <a
                  href="https://www.linkedin.com/company/grow-on-online/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8.5 h-8.5 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 border border-gray-100 transition-colors cursor-pointer"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={16} />
                </a>
                <a
                  href="mailto:info.groveya@gmail.com"
                  className="w-8.5 h-8.5 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 border border-gray-100 transition-colors cursor-pointer"
                  aria-label="Email"
                >
                  <Mail size={16} />
                </a>
              </div>
            </div>
            
            {[
              { title: 'Services', links: [
                { label: 'Digital Marketing', href: '#services' },
                { label: 'Web Development', href: '#services' },
                { label: 'Brand Strategy', href: '#services' },
                { label: 'SEO Optimization', href: '#services' },
                { label: 'App Development', href: '#services' },
              ] },
              { title: 'Company', links: [
                { label: 'About Us', href: '#about' },
                { label: 'Our Work', href: '#work' },
                { label: 'Leadership', href: '#leadership' },
                { label: 'Reviews', href: '#testimonials' },
              ] },
              { title: 'Contact', links: [
                { label: 'Book a Strategy Call', href: '#contact' },
                { label: 'Email Us', href: 'mailto:info.groveya@gmail.com' },
                { label: 'Call Us', href: 'tel:+919891637598' },
                { label: 'Visit Rohini', href: '#contact' },
              ] },
            ].map(col => (
              <div key={col.title}>
                <p className="text-sm font-bold mb-4 uppercase tracking-wider text-gray-900">{col.title}</p>
                <ul className="flex flex-col gap-2">
                  {col.links.map(l => (
                    <li key={l.label}>
                      <a href={l.href} className="text-xs text-gray-400 hover:text-gray-900 transition-colors duration-300 font-medium">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 border-t border-gray-100">
            <p className="text-xs text-gray-400 font-medium">
              © 2026 groveya Technologies &amp; Growth Partners. All rights reserved.
            </p>
            <p className="text-xs text-gray-300 font-semibold">
              Made with ♥ in India
            </p>
          </div>

        </div>
      </footer>

      {/* ── Mobile Floating Tab Bar (iOS/Android Style) ── */}
      <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden">
        <div className="bg-white/85 backdrop-blur-xl border border-gray-250/60 rounded-2xl py-2.5 px-2 shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex justify-between items-center max-w-md mx-auto">
          {[
            { id: 'hero', icon: <Globe size={20} />, label: 'Home' },
            { id: 'services', icon: <Zap size={20} />, label: 'Services' },
            { id: 'work', icon: <Award size={20} />, label: 'Work' },
            { id: 'about', icon: <Users size={20} />, label: 'About' },
            { id: 'contact', icon: <MessageCircle size={20} />, label: 'Contact' },
          ].map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(tab.id)?.scrollIntoView({ behavior: 'smooth' })
                  setActiveTab(tab.id)
                }}
                className={`flex flex-col items-center gap-1 transition-all duration-300 relative py-1 px-2 rounded-xl ${
                  isActive ? 'text-[#F26522] scale-105' : 'text-gray-400 hover:text-gray-650'
                }`}
              >
                {tab.icon}
                <span className="text-[10px] font-semibold tracking-tight">
                  {tab.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-[#F26522]" />
                )}
              </a>
            )
          })}
        </div>
      </div>

      {/* ── Testimonial Video Modal overlay ── */}
      {activeVideo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 transition-all duration-300"
          onClick={() => setActiveVideo(null)}
        >
          <div 
            className="relative w-full max-w-3xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors backdrop-blur-sm cursor-pointer"
              aria-label="Close video player"
            >
              <X size={20} />
            </button>
            {/* Video Player */}
            <div className="aspect-video w-full">
              <video
                src={activeVideo}
                autoPlay
                controls
                playsInline
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
