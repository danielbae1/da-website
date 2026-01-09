import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, ArrowDown, ExternalLink, 
  MapPin, Calendar, Download, Mail, 
  Linkedin, ChevronRight, Mountain,
  Clock, CheckCircle, Zap, Award, FileText,
  Briefcase, GraduationCap, ArrowLeft, Camera,
  PenTool, Phone, Settings, Cpu, Wind, AlertTriangle
} from 'lucide-react';

/* --- UTILS & CONFIG --- */

// Custom Hook for Scroll Animations
const FadeIn = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setIsVisible(true);
      });
    });
    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

/* --- COMPONENTS --- */

const TypewriterText = ({ words, wait = 2000 }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const timeout2 = setTimeout(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearTimeout(timeout2);
  }, [blink]);

  useEffect(() => {
    if (!words || words.length === 0) return;

    if (subIndex === words[index].length + 1 && !reverse) {
      const timeout = setTimeout(() => {
        setReverse(true);
      }, wait); 
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words, wait]);

  return (
    <span className="inline-flex whitespace-nowrap">
      {words[index].substring(0, subIndex)}
      <span className={`${blink ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100 ml-0.5`}>|</span>
    </span>
  );
};

const NavLink = ({ children, mobile, onClick, active, colorClass }) => (
  <button 
    onClick={onClick}
    className={`
      uppercase tracking-wider text-xs lg:text-sm font-extrabold transition-all duration-300 whitespace-nowrap
      ${mobile 
        ? 'block py-4 text-stone-900 text-lg border-b border-stone-100 w-full text-left' 
        : `${colorClass} hover:underline decoration-green-700 decoration-2 underline-offset-8 ${active ? 'underline text-stone-900' : ''}`}
    `}
  >
    {children}
  </button>
);

const JobEntry = ({ role, company, location, dates, bullets, logoColor = "bg-stone-200", logo, logoSize = "h-16 w-16" }) => (
  <div className="group relative pl-8 border-l border-stone-200 pb-6 last:pb-0">
    <div className={`absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full ${logoColor} ring-4 ring-white z-10`}></div>
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1 pr-4">
        <h3 className="font-bold text-stone-900 text-lg leading-tight mb-1">{company}</h3>
        <div className="flex flex-col gap-1">
          <div className="text-xs font-mono text-stone-500 uppercase tracking-wider font-bold">{dates}</div>
          <div className="text-sm text-stone-700 font-bold">{role}</div>
          {location && <div className="text-sm text-stone-500 font-medium italic">{location}</div>}
        </div>
      </div>
      {logo && (
        <div className={`${logoSize} flex-shrink-0 flex items-start justify-center ml-4 mt-1`}>
          <img src={logo} alt={`${company} logo`} className="max-h-full max-w-full object-contain" />
        </div>
      )}
    </div>
    <ul className="space-y-2">
      {bullets.map((bullet, i) => (
        <li key={i} className="text-stone-600 text-sm leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1 before:h-1 before:bg-stone-300 before:rounded-full">
          {bullet}
        </li>
      ))}
    </ul>
  </div>
);

// --- PROJECT MODAL ---
const ProjectModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-300 rounded-sm">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-stone-100 rounded-full transition-colors z-10">
          <X size={20} className="text-stone-500" />
        </button>
        
        <div className="p-8 md:p-12">
          <div className="mb-8 border-b border-stone-100 pb-6">
             <span className="font-mono text-xs font-bold uppercase tracking-widest text-green-900 mb-2 block">{data.category}</span>
             <h2 className="font-serif text-3xl md:text-4xl text-stone-900 leading-tight mb-2">{data.title}</h2>
             {data.title.includes("Turbofan") && (
                <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1 rounded-sm border border-amber-200 mt-2">
                  <AlertTriangle size={14} />
                  <span className="text-xs font-bold uppercase tracking-wide">Early Stage • Updates & Photos Coming Soon</span>
                </div>
             )}
          </div>

          <div className="space-y-8">
            <div>
               <h4 className="flex items-center gap-2 font-bold text-stone-800 text-sm uppercase tracking-wide mb-3">
                 <Settings size={16} className="text-stone-400" /> Overview
               </h4>
               <p className="text-stone-600 leading-relaxed">{data.overview}</p>
            </div>

            <div>
               <h4 className="flex items-center gap-2 font-bold text-stone-800 text-sm uppercase tracking-wide mb-3">
                 <Cpu size={16} className="text-stone-400" /> Key Contributions
               </h4>
               <ul className="space-y-3">
                 {data.contributions.map((item, i) => (
                   <li key={i} className="flex gap-3 text-stone-600 text-sm leading-relaxed">
                     <CheckCircle size={16} className="text-green-700 shrink-0 mt-0.5" />
                     <span>{item}</span>
                   </li>
                 ))}
               </ul>
            </div>

            {data.results && (
              <div className="bg-stone-50 p-6 rounded-lg border border-stone-100">
                 <h4 className="flex items-center gap-2 font-bold text-stone-800 text-sm uppercase tracking-wide mb-3">
                   <Award size={16} className="text-stone-400" /> Results & Impact
                 </h4>
                 <p className="text-stone-600 text-sm leading-relaxed">{data.results}</p>
              </div>
            )}
            
            {/* Tags in Modal */}
            <div className="flex flex-wrap gap-2 pt-4">
              {data.tags && data.tags.map(tag => (
                <span key={tag} className="text-xs font-bold uppercase text-stone-500 bg-stone-100 border border-stone-200 px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ModernProjectRow = ({ title, category, overview, contributions, results, tags, color, image, index }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const isEven = index % 2 === 0;

  // Define updated image links
  const updatedImages = {
    "Formula SAE EV Wheel Centre": "https://github.com/danielbae1/portfolio-website-images/blob/main/WC%20wide.png?raw=true",
    "2-Spool Turbofan Engine": "https://github.com/danielbae1/portfolio-website-images/blob/main/b787_8_215_genx_cutaway.jpg?raw=true",
    "Custom Composites 3D Printer": "https://github.com/danielbae1/portfolio-website-images/blob/main/3D%20wide%202.JPG?raw=true",
    "6-Axis Camera Robot Arm": "https://github.com/danielbae1/portfolio-website-images/blob/main/CA%20wide.png?raw=true",
    "Lab-Grade Silica Powder Dispenser": "https://github.com/danielbae1/portfolio-website-images/blob/main/silica.png?raw=true", 
    "Ford Wind Tunnel CFD Validation": "https://github.com/danielbae1/portfolio-website-images/blob/main/wt%20wide.JPG?raw=true"
  };

  const projectData = { title, category, overview, contributions, results, tags };

  return (
    <FadeIn className="mb-32 last:mb-0">
      <div className={`flex flex-col lg:flex-row gap-12 lg:gap-20 items-start ${isEven ? '' : 'lg:flex-row-reverse'}`}>
        
        {/* Image Side - Full Aspect Ratio */}
        <div className="w-full lg:w-1/2">
           <div className="relative group cursor-pointer" onClick={() => setModalOpen(true)}>
              <div className={`absolute -inset-4 ${color} opacity-20 rounded-xl transform rotate-2 group-hover:rotate-0 transition-transform duration-500`}></div>
              {/* Image Container */}
              <div className="relative w-full rounded-lg shadow-2xl bg-white overflow-hidden">
                 {image || updatedImages[title] ? (
                    <img 
                      src={updatedImages[title] || image} 
                      alt={title} 
                      className="w-full h-auto object-contain transform group-hover:scale-105 transition-transform duration-700" 
                    />
                 ) : (
                    <div className="w-full h-64 bg-stone-200 flex items-center justify-center text-stone-400 font-mono">Image Placeholder</div>
                 )}
                 
                 <div className="absolute bottom-0 left-0 right-0 bg-stone-900/90 backdrop-blur-md p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 flex justify-between items-center">
                    <span className="text-white text-xs font-bold uppercase tracking-widest">Click to View Analysis</span>
                    <ArrowDown className="-rotate-90 text-white" size={16} />
                 </div>
              </div>
           </div>
        </div>

        {/* Content Side */}
        <div className="w-full lg:w-1/2 pt-4">
           <span className="font-mono text-xs font-bold uppercase tracking-widest text-green-900 mb-2 block">{category}</span>
           <h2 className="font-serif text-4xl text-stone-900 mb-2 leading-tight">{title}</h2>
           
           {/* Early Stage Badge for Turbofan */}
           {title.includes("Turbofan") && (
              <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1 rounded-sm border border-amber-200 mb-6">
                <AlertTriangle size={14} />
                <span className="text-xs font-bold uppercase tracking-wide">Early Stage • Updates Coming Soon</span>
              </div>
           )}

           <div className="space-y-6 mt-4">
             <p className="text-stone-600 text-sm leading-relaxed line-clamp-4">{overview}</p>
             
             <div className="flex flex-wrap gap-2">
                {tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[10px] font-bold uppercase text-stone-400 border border-stone-200 px-2 py-1">
                    {tag}
                  </span>
                ))}
             </div>

             <button
               onClick={() => setModalOpen(true)}
               className="inline-flex items-center gap-2 bg-stone-900 text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-stone-700 transition-colors"
             >
               Click for Details
             </button>
           </div>
        </div>
      </div>
      
      <ProjectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} data={projectData} />
    </FadeIn>
  );
};

const ExpeditionCard = ({ title, sub, location, image, size = "standard" }) => {
  let gridClass = "col-span-1 row-span-1 h-80";
  if (size === "wide") gridClass = "md:col-span-2 h-80";
  if (size === "tall") gridClass = "row-span-2 h-[42rem]"; 

  return (
    <div className={`relative group overflow-hidden rounded-sm ${gridClass}`}>
      {image ? (
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0" 
        />
      ) : (
        <div className="w-full h-full bg-stone-200 flex items-center justify-center">No Image</div>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
      
      <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
        <div className="flex items-center gap-2 text-white/70 text-xs font-mono uppercase tracking-widest mb-2">
          <MapPin size={12} /> {location}
        </div>
        <h3 className="font-serif text-3xl text-white mb-2 leading-none">{title}</h3>
        <p className="text-white/60 text-sm font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          {sub}
        </p>
      </div>
    </div>
  );
};

const SkillBar = ({ skill, level }) => {
  const percentage = Math.min((level / 3) * 100, 100);
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-bold text-stone-700">{skill}</span>
      </div>
      <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden relative">
         <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white z-10"></div>
         <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white z-10"></div>
         <div className="h-full bg-green-800 rounded-full transition-all duration-500 ease-out" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

const SkillCategory = ({ title, skills }) => (
  <div className="mb-8 break-inside-avoid">
    <h4 className="font-mono text-sm font-extrabold uppercase tracking-widest text-green-900 mb-4 border-b border-stone-200 pb-2">
      {title}
    </h4>
    <div>
      {skills.map((s, i) => (
        <SkillBar key={i} skill={s.name} level={s.level} />
      ))}
    </div>
  </div>
);

// --- SUMMARY MODAL WITH RESUME AND PDF BUTTONS (Restored Content) ---
const SummaryModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-300 rounded-sm">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-stone-100 rounded-full transition-colors">
          <X size={20} className="text-stone-500" />
        </button>
        <div className="p-8 md:p-12">
          <div className="flex items-center gap-2 mb-6 text-green-700 font-mono text-xs font-bold uppercase tracking-widest">
            <Clock size={14} /> The 2-Minute Read
          </div>
          <h2 className="font-serif text-3xl text-stone-900 mb-2">Danny Bae</h2>
          <p className="text-stone-500 font-medium mb-8">Mechanical Engineering Student (UofT)</p>
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-stone-50 p-4 border border-stone-100 col-span-2">
                <span className="block font-bold text-2xl text-stone-900">2nd</span>
                <span className="text-xs text-stone-500 uppercase tracking-wide">Year Engineering</span>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-stone-900 mb-3 flex items-center gap-2">
                <Zap size={16} className="text-amber-500" /> Key Competencies
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed mb-3">
                Specializing in Mechatronics and Solid Mechanics. I bridge the gap between heavy mechanical design (CAD, FEA) and effective engineering leadership.
              </p>
              <div className="flex flex-wrap gap-2">
                {['SolidWorks', 'ANSYS', 'Python', 'Arduino', 'Manufacturing'].map(s => (
                  <span key={s} className="px-2 py-1 bg-stone-100 text-stone-600 text-xs font-bold uppercase border border-stone-200">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-stone-900 mb-3 flex items-center gap-2">
                <Award size={16} className="text-green-700" /> Career Highlights
              </h3>
              <ul className="space-y-3">
                <li className="flex gap-3 text-sm text-stone-600">
                  <CheckCircle size={16} className="text-stone-400 shrink-0 mt-0.5" />
                  <span><strong>Engineering Leadership:</strong> Oversaw drivetrain integration for UTFR Formula SAE Electric, reducing manufacturing time by 2+ weeks.</span>
                </li>
                <li className="flex gap-3 text-sm text-stone-600">
                  <CheckCircle size={16} className="text-stone-400 shrink-0 mt-0.5" />
                  <span><strong>R&D & Mechatronics:</strong> Led the design and assembly of a custom fiber-reinforced 3D-printing system, achieving an 85% cost reduction.</span>
                </li>
                <li className="flex gap-3 text-sm text-stone-600">
                  <CheckCircle size={16} className="text-stone-400 shrink-0 mt-0.5" />
                  <span><strong>FSAE Wheel Centre Development:</strong> Designed and FEA-validated wheel centres for UTFR’s first in-hub motor race car, achieving an 11% mass reduction and 8% stiffness increase.</span>
                </li>
                <li className="flex gap-3 text-sm text-stone-600">
                  <CheckCircle size={16} className="text-stone-400 shrink-0 mt-0.5" />
                  <span><strong>Turbofan Engine Design:</strong> Designing and validating a high-bypass, 2-spool turbofan engine, gaining foundational turbomachinery knowledge applicable to aerospace roles.</span>
                </li>
              </ul>
            </div>
            <div className="pt-6 border-t border-stone-100 mt-8">
               <p className="text-sm font-medium text-stone-900 mb-4">
                 Currently seeking PEY Co-op opportunities for <span className="underline decoration-green-500 decoration-2">May 2026</span>.
               </p>
               {/* Updated Buttons in Modal */}
               <div className="flex flex-wrap gap-4">
                 <a 
                   href="https://cdn.jsdelivr.net/gh/danielbae1/Resume-and-Portfolio-PDF@main/Daniel_Bae_Resume_2026-01-08.pdf" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="flex items-center gap-2 bg-stone-900 text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-stone-700 transition-colors w-full md:w-auto text-center"
                 >
                   <Download size={16} /> Resume
                 </a>
                 <button 
                   disabled 
                   className="flex items-center gap-2 border border-stone-200 text-stone-400 px-6 py-3 text-xs font-bold uppercase tracking-widest cursor-not-allowed w-full md:w-auto text-center"
                 >
                   <FileText size={16} /> Portfolio PDF
                 </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- SKILLS CONFIGURATION --- */
const SKILLS_DATA = [
  {
    title: "Computer Aided Design (CAD)",
    items: [
      { name: "SolidWorks", level: 2.2 },
      { name: "Siemens NX", level: 1.3 },
      { name: "Catia", level: 1.3 },
      { name: "Fusion 360", level: 1.7 }
    ]
  },
  {
    title: "Mechanical Design / Analysis",
    items: [
      { name: "ANSYS Mechanical FEA", level: 2.1 },
      { name: "Siemens STAR-CCM+", level: 1.4 },
      { name: "DFM & DFA", level: 1.7 },
      { name: "GD&T Standards", level: 1.8 }
    ]
  },
  {
    title: "Fabrication / Prototyping",
    items: [
      { name: "Machining (Mill/Lathe)", level: 2 },
      { name: "3D Printing / Additive", level: 1.8 },
      { name: "Rapid Prototyping", level: 2.2 },
      { name: "Power & Hand Tools", level: 2.9 }
    ]
  },
  {
    title: "Documentation / Logistics",
    items: [
      { name: "Project Management (Gantt, Excel)", level: 2.4 },
      { name: "Technical Presentations", level: 1.7}, 
      { name: "Microsoft Suite", level: 2.8 }   ]
  },
  {
    title: "Programming",
    items: [
      { name: "Python", level: 1.9 },
      { name: "MATLAB", level: 1.5 },
      { name: "G-Code", level: 1.5 }
    ]
  },
  {
    title: "Backpacking",
    items: [
      { name: "Navigation & Mobility", level: 2.8 },
      { name: "Cross-Cultural Communication", level: 2.3 },
      { name: "Hiking & Scrambling", level: 2.7 },
      { name: "Mountaineering", level: 1.8}
    ]
  }
];

export default function PortfolioV3() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [scrollY, setScrollY] = useState(0); 

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setScrollY(window.scrollY); 
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (view, id) => {
    setCurrentView(view);
    setMenuOpen(false);
    setTimeout(() => {
      if (id) {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  // Ensure nav text is white when not scrolled (since all headers have dark images)
  const navTextColor = !scrolled 
    ? 'text-white drop-shadow-md hover:text-stone-200' 
    : 'text-stone-500 hover:text-stone-900';

  return (
    <div className="bg-stone-50 min-h-screen font-sans text-stone-900 selection:bg-green-200 selection:text-green-900">
      
      <SummaryModal isOpen={summaryOpen} onClose={() => setSummaryOpen(false)} />

      {/* --- NAVIGATION --- */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <button 
            onClick={() => handleNavClick('home', null)}
            className={`font-serif font-black text-3xl tracking-tight z-50 ${!scrolled || menuOpen ? 'text-white drop-shadow-md' : 'text-stone-900'}`}
          >
            D.BAE
          </button>

          {/* Desktop Links */}
          <div className="hidden lg:flex gap-8">
             <NavLink onClick={() => handleNavClick('projects', null)} active={currentView === 'projects'} colorClass={navTextColor}>Engineering Projects</NavLink>
             <NavLink onClick={() => handleNavClick('home', 'experience')} active={false} colorClass={navTextColor}>Education & Experience</NavLink>
             <NavLink onClick={() => handleNavClick('home', 'skills')} active={false} colorClass={navTextColor}>Technical Skills</NavLink>
             <NavLink onClick={() => handleNavClick('outdoors', null)} active={currentView === 'outdoors'} colorClass={navTextColor}>Expeditions & Photography</NavLink>
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className={`lg:hidden z-50 ${!scrolled || menuOpen ? 'text-white drop-shadow-md' : 'text-stone-900'}`}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="fixed inset-0 bg-white z-40 flex items-center justify-center animate-in fade-in duration-200">
            <div className="flex flex-col items-center gap-6 w-full px-12">
              <NavLink mobile onClick={() => handleNavClick('home', null)}>Home</NavLink>
              <NavLink mobile onClick={() => handleNavClick('projects', null)}>Engineering Projects</NavLink>
              <NavLink mobile onClick={() => handleNavClick('home', 'experience')}>Education & Experience</NavLink>
              <NavLink mobile onClick={() => handleNavClick('home', 'skills')}>Technical Skills</NavLink>
              <NavLink mobile onClick={() => handleNavClick('outdoors', null)}>Expeditions & Photography</NavLink>
            </div>
          </div>
        )}
      </nav>

      {/* ==================== HOME VIEW ==================== */}
      {currentView === 'home' && (
        <>
          {/* --- HERO SECTION --- */}
          <header className="relative h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-stone-900">
               <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60 z-10"></div>
               <div 
                 className="absolute w-full h-[120vh] -top-[10vh] left-0 bg-cover bg-center opacity-80" 
                 style={{ 
                   backgroundImage: `url('https://github.com/danielbae1/portfolio-website-images/blob/main/DSC01603.JPG?raw=true')`,
                   transform: `translateY(${scrollY * 0.5}px)` 
                 }}
               ></div>
            </div>

            <div className="relative z-20 text-center text-white px-6 w-full max-w-6xl mx-auto">
              <div className="mb-6 opacity-80 font-mono text-xs md:text-sm tracking-[0.2em] uppercase flex flex-col md:flex-row gap-3 items-center justify-center text-stone-300">
                <span className="whitespace-nowrap">Mechanical Engineer</span>
                <span className="hidden md:inline text-stone-500">|</span>
                <span className="font-bold text-white min-w-min transition-all duration-300">
                  <TypewriterText 
                    words={[
                      "Photographer", 
                      "Automotive Enthusiast", 
                      "Backpacker", 
                      "Aerospace Enthusiast", 
                      "Trailblazer"
                    ]} 
                  />
                </span>
                <span className="hidden md:inline text-stone-500">|</span>
                <span className="whitespace-nowrap">Toronto</span>
              </div>

              <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl mb-8 tracking-tight text-white drop-shadow-2xl">
                Danny Bae
              </h1>
              <div className="flex flex-col md:flex-row gap-6 justify-center items-center opacity-90 text-stone-200">
                 <span className="flex items-center gap-2 text-sm font-medium tracking-wide">
                   <Mail size={16} /> danny.bae@mail.utoronto.ca
                 </span>
                 <span className="hidden md:block w-px h-4 bg-white/40"></span>
                 <span className="flex items-center gap-2 text-sm font-medium tracking-wide">
                   <Phone size={16} /> 1-226-921-5604
                 </span>
              </div>
            </div>

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
              <ArrowDown size={24} />
            </div>
          </header>

          {/* --- RECRUITER SUMMARY BAR --- */}
          <div className="bg-gradient-to-r from-orange-50 to-stone-200 border-b border-stone-200 sticky top-0 md:relative z-30 shadow-md">
            <div className="max-w-6xl mx-auto px-6 h-20 md:h-24 flex items-center justify-between">
              
              <div className="hidden md:flex items-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
                <div className="flex items-center gap-2 font-serif font-bold text-stone-700">
                   {/* ADDED LOGO 1: UofT */}
                   <img src="https://github.com/danielbae1/portfolio-website-images/blob/main/uoft%20logo.png?raw=true" alt="UofT" className="h-10 w-auto opacity-80" />
                </div>
                <div className="h-6 w-px bg-stone-400/50"></div>
                {/* ADDED LOGO 2: UTFR */}
                <img src="https://github.com/danielbae1/portfolio-website-images/blob/main/utfr%20logo.png?raw=true" alt="UTFR" className="h-8 w-auto opacity-80" />
              </div>

              <div className="flex-1 md:flex-none flex justify-center">
                 <button 
                   onClick={() => setSummaryOpen(true)}
                   className="bg-stone-900 hover:bg-green-900 text-white px-6 md:px-8 py-3 md:py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 transform hover:-translate-y-1 shadow-md flex items-center gap-3"
                 >
                   <Clock size={16} className="text-stone-400" />
                   Click Here for 2 Minute Summary
                 </button>
              </div>

               <div className="hidden md:flex items-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-300 justify-end">
                <div className="font-mono text-xs font-bold text-stone-600 uppercase">
                  Available <br/> May 2026
                </div>
                <a href="https://www.linkedin.com/in/danielbae1/" target="_blank" rel="noreferrer" className="h-8 w-8 bg-white rounded-full flex items-center justify-center hover:bg-blue-100 transition-colors shadow-sm">
                   <Linkedin size={16} className="text-stone-700" />
                </a>
              </div>
            </div>
          </div>

          {/* --- ABOUT SECTION --- */}
          <section id="about" className="relative bg-stone-900 text-white overflow-hidden">
             {/* Background Image */}
             <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-stone-900/80 z-10"></div>
                <img 
                  src="https://github.com/danielbae1/portfolio-website-images/blob/main/DSC02135.JPG?raw=true" 
                  alt="Mountain Background" 
                  className="w-full h-full object-cover grayscale opacity-60"
                />
             </div>

             <div className="max-w-6xl mx-auto px-6 md:px-12 py-32 relative z-10">
               <div className="grid md:grid-cols-2 gap-16 items-center">
                 <FadeIn>
                    <h2 className="font-serif text-5xl md:text-6xl text-white mb-8 leading-tight drop-shadow-lg">
                      Engineering with <br/> an explorer's mindset.
                    </h2>
                    
                    <div className="space-y-6 text-stone-200 leading-relaxed text-sm md:text-base font-sans font-medium tracking-wide drop-shadow-md">
                       <p>
                        Hello! My name is <strong>Danny</strong> and I am a <strong>Mechanical Engineering student</strong> raised in rural Stratford, ON, at the <strong>University of Toronto</strong> with specialization in <strong>Mechatronics and Solid Mechanics</strong>. My life has changed drastically within the past three years and here’s my story.
                       </p>
                       <p>
                         Initially pursuing medicine after high school in 2020 and studying at one of Canada’s most competitive pre-med programs for two and a half years, I dropped out. After taking some time away to work full time, reflect, and <strong>solo-backpack South America</strong>, I decided to begin my mechanical engineering career at the University of Toronto.
                       </p>
                       <p>
                         I not only reignited my curiosity and passion for mechanical engineering, but I supercharged my drive to pursue three industries: <strong>aerospace, performance automotive, and consumer tech</strong>. From designing jet propulsion systems to the newest and flashy tech, the passion is there. But do I have the skills to back it up?
                       </p>
                       <p>
                         Throughout my time here at U of T, I’ve gained invaluable technical experience working with <strong>UTFR (University of Toronto Formula Racing)</strong>, a composites research lab, and on my own engineering endeavors at home. My most notable contribution to our FSAE team has been designing wheel centers for our first ever in-hub motor race car, considering novel, unfamiliar load cases the team has never previously dealt with. Outside of school, my largest and most ambitious project has been designing, validating, and 3D printing a high-bypass, 2-spool turbofan engine.
                       </p>
                       <p>
                         These experiences—from the resilience learned during my career pivot to the technical knowledge required for FSAE design and propulsion analysis—have prepared me to take the next step and apply my skills in more fast-paced industrial environments. I'm currently seeking <strong>Summer Co-op opportunities for May 2026</strong>.
                       </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 mt-12">
                      <a href="https://cdn.jsdelivr.net/gh/danielbae1/Resume-and-Portfolio-PDF@main/Daniel_Bae_Resume_2026-01-08.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white text-stone-900 px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-stone-200 transition-colors shadow-lg">
                        <Download size={16} /> Resume
                      </a>
                      <a href="#" className="flex items-center gap-2 border-2 border-white text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
                        <FileText size={16} /> Portfolio PDF
                      </a>
                    </div>
                 </FadeIn>
                 
                 <FadeIn delay={200} className="hidden md:flex md:flex-col gap-6">
                   <div className="relative aspect-[4/5] w-full overflow-hidden border-8 border-white/10 shadow-2xl rounded-lg">
                     <img 
                       src="https://github.com/danielbae1/portfolio-website-images/blob/main/_DSC7038_Original.JPG?raw=true" 
                       alt="Danny Bae" 
                       className="w-full h-full object-cover" 
                     />
                   </div>
                   
                   <div className="relative aspect-square w-2/3 self-end overflow-hidden border-8 border-white/10 shadow-2xl rounded-lg -mt-12 z-10">
                     <img 
                       src="https://github.com/danielbae1/portfolio-website-images/blob/main/IMG_7569%20Copy%20Copy.JPG?raw=true" 
                       alt="Danny Bae - Secondary" 
                       className="w-full h-full object-cover" 
                     />
                   </div>
                 </FadeIn>
               </div>
             </div>
          </section>

            {/* --- EDUCATION & EXPERIENCE SECTION --- */}
            <section id="experience" className="mb-32 max-w-6xl mx-auto px-6 md:px-12 pt-24">
              <div className="flex items-end justify-between border-b border-stone-200 pb-4 mb-12">
                <h2 className="font-serif text-3xl text-stone-900">Education & Experience</h2>
                <a href="#" className="text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 flex items-center gap-1">
                  Full History <ChevronRight size={14} />
                </a>
              </div>

              <div className="grid md:grid-cols-2 gap-16">
                
                {/* LEFT COLUMN: Academic & Expeditions */}
                <div>
                  <h3 className="font-bold text-stone-900 mb-8 flex items-center gap-2 text-lg uppercase tracking-wider border-b border-stone-100 pb-2">
                    <GraduationCap size={20} className="text-stone-400" />
                    Academic & Expeditions
                  </h3>
                  
                  <div className="space-y-2">
                    <JobEntry 
                      company="University of Toronto"
                      role="BASc Mechanical Eng. + Business Minor"
                      location="Year 4"
                      dates="Sep 2024 - Present"
                      logo="https://github.com/danielbae1/portfolio-website-images/blob/main/uoft%20logo.png?raw=true"
                      logoSize="h-36 w-36" 
                      bullets={[
                        "Specialization: Mechatronics & Solid Mechanics.",
                        "UTFR FSAE: Drivetrain & Aerodynamics.",
                        "Pursuing Engineering Business Minor (Rotman School of Management)."
                      ]}
                    />
                     
                     <JobEntry 
                      company="Personal Development"
                      role="Independent Expeditions & Upgrading"
                      location="Global / Remote"
                      dates="May 2023 - Aug 2024"
                      logoColor="bg-green-600"
                      bullets={[
                        <>Undertook <strong>two solo, month-long expeditions</strong> across the mountains and rainforests of Ecuador and Peru.</>,
                        <>Overcame personal challenges to cultivate <strong>mental resilience, clarity, and determination</strong>.</>,
                        <>Self-funded travels and tuition by working full-time as a Pharmacy Assistant (see details →).</>,
                        <><strong>Requalified</strong> for engineering eligibility by independently re-completing university calculus (A+) and chemistry (A+) while maintaining <strong>40-hour work weeks</strong>.</>
                      ]}
                    />

                    <JobEntry 
                      company="Queen's University"
                      role="Health Sciences (Honours)"
                      location="Kingston, ON"
                      dates="Sep 2020 - Dec 2022"
                      logo="https://github.com/danielbae1/portfolio-website-images/blob/main/queens%20logo.png?raw=true"
                      logoSize="h-36 w-36" 
                      bullets={[
                        "Achieved 4.0 CGPA.",
                        "Withdrew halfway through 3rd year."
                      ]}
                    />
                    <JobEntry 
                      company="Stratford Central S.S."
                      role="Secondary Diploma"
                      location="Stratford, ON"
                      dates="2016 - 2020"
                      logoColor="bg-red-900"
                      bullets={[
                        "Varsity Soccer & Basketball.",
                        "Symphonic Band & Jazz Band."
                      ]}
                    />
                  </div>
                </div>

                {/* RIGHT COLUMN: Professional Experience */}
                <div>
                  <h3 className="font-bold text-stone-900 mb-8 flex items-center gap-2 text-lg uppercase tracking-wider border-b border-stone-100 pb-2">
                    <Briefcase size={20} className="text-stone-400" />
                    Experience
                  </h3>
                  
                  <div className="space-y-2">
                    <JobEntry 
                      company="University of Toronto Formula Racing"
                      role="Senior Drivetrain & Aerodynamics Member"
                      location="Toronto, ON"
                      dates="Sep 2024 - Present"
                      logo="https://github.com/danielbae1/portfolio-website-images/blob/main/utfr%20logo.png?raw=true"
                      logoSize="h-36 w-36" 
                      bullets={[
                        <>Assumed leadership of drivetrain subsystem mid-project cycle, overseeing integration across <strong>3 subsystems</strong> and <strong>reducing manufacturing time by 2+ weeks</strong>.</>,
                        <>Designed and FEA-validated wheel centers and rear wing elements in <strong>SolidWorks</strong> and <strong>ANSYS</strong> applying <strong>GD&T</strong> and <strong>DFM</strong> principles (11% mass reduction, 8% stiffness increase).</>,
                        <>Designed molds and fabricated <strong>10+ carbon fiber</strong> wing elements by wet layup and vacuum bagging.</>,
                        <>Conducted <strong>7 STAR-CCM+ simulations</strong> evaluating geometries of rear wing endplates, increasing ClA by 4%.</>,
                        "Spearheading efforts to improve open-communication between drivetrain and suspension leads."
                      ]}
                    />
                    <JobEntry 
                      company="University of Toronto"
                      role="Undergraduate Mechatronics Research Intern"
                      location="Multifunctional Composites Lab"
                      dates="May 2025 - Aug 2025"
                      logo="https://github.com/danielbae1/portfolio-website-images/blob/main/uoft%20logo.png?raw=true"
                      logoSize="h-36 w-36" 
                      bullets={[
                        <>Took sole ownership of finalizing the design and assembly of a <strong>custom 3D-printing system</strong> for fiber-reinforced polymer extrusion.</>,
                        <>Selected hardware and electrical components and configured <strong>Klipper firmware</strong> via <strong>G-Code</strong> commands.</>,
                        <>Achieved an <strong>85%+ overall cost reduction</strong> over commercially available systems.</>,
                        "Coordinated with supervisor in bi-weekly design reviews to align technical decisions with research goals."
                      ]}
                    />
                    
                    <JobEntry 
                      company="Shoppers Drug Mart"
                      role="Pharmacy Assistant"
                      location="Stratford, ON"
                      dates="Jun 2022 - Aug 2024"
                      logo="https://github.com/danielbae1/portfolio-website-images/blob/main/sdm%20logo.png?raw=true"
                      logoSize="h-32 w-32" 
                      bullets={[
                        <>Compiled data from <strong>9600+ prescriptions</strong> into patient database, improving <strong>data entry efficiency by 100%</strong>.</>,
                        <><strong>Increased</strong> overall pharmacy efficiency by <strong>40%</strong> by implementing an improved prescription preparation process.</>,
                        <><strong>Coordinated communication</strong> with medical offices and pharmacists to verify prescription and patient details.</>
                      ]}
                    />
                  </div>
                </div>

              </div>
            </section>

            {/* --- TECHNICAL SKILLS SECTION --- */}
            <section id="skills" className="mb-32 max-w-6xl mx-auto px-6 md:px-12">
              <div className="flex items-end justify-between border-b border-stone-200 pb-4 mb-12">
                <h2 className="font-serif text-3xl text-stone-900">Technical Skills</h2>
                <div className="hidden md:flex gap-8 text-xs font-mono font-bold text-stone-400 uppercase">
                  <span>Introduced</span>
                  <span>Proficient</span>
                  <span>Expert</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-4">
                 {SKILLS_DATA.map((category, index) => (
                   <SkillCategory 
                     key={index}
                     title={category.title}
                     skills={category.items}
                   />
                 ))}
              </div>
            </section>
        </>
      )}

      {/* ==================== PROJECTS VIEW ==================== */}
      {currentView === 'projects' && (
        <div className="min-h-screen bg-stone-50"> 
           {/* Header */}
           <div className="relative h-[60vh] w-full flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-stone-900">
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60 z-10"></div>
                <img 
                  src="https://github.com/danielbae1/portfolio-website-images/blob/main/IMG_8234.PNG?raw=true" 
                  alt="Engineering Projects Background" 
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              <div className="relative z-20 text-center text-white px-6">
                <h1 className="font-serif text-5xl md:text-7xl mb-4 drop-shadow-lg">Engineering Projects</h1>
                <p className="text-stone-200 text-lg max-w-2xl mx-auto">
                  Technical work involving Mechatronics, CAD Design, and Rapid Prototyping.
                </p>
              </div>
           </div>

           <div className="max-w-6xl mx-auto px-6 py-24">
             {/* MODERN PROJECT ROWS - Updated with PDF Content */}
             <ModernProjectRow 
               index={0}
               title="Formula SAE EV Wheel Centre"
               category="Automotive / Design"
               image="https://github.com/danielbae1/portfolio-website-images/blob/main/WC%20wide.png?raw=true" 
               color="bg-stone-900"
               overview="New wheel centres were required for this year's UTFR car as the team transitioned to in-hub electric motors. This component serves as the critical interface between the hub assembly (motors, gearbox) and the carbon fibre wheel rim."
               contributions={[
                 "Designed a mass-optimized wheel centre from scratch.",
                 "FEA-validated the design with pretensioned M6 bolts and internally modelled hub.",
                 "Communicated with primary hub designer to ensure perfect interference fit during parallel design phases."
               ]}
               results="Reduced mass by 16% compared to baseline geometry. Delivered an FEA-validated part capable of handling all acceleration, braking, and cornering loads."
               tags={['SolidWorks', 'ANSYS', 'FEA', 'DFM']}
             />

             <ModernProjectRow 
               index={1}
               title="2-Spool Turbofan Engine"
               category="Propulsion / Additive Mfg"
               image="https://github.com/danielbae1/portfolio-website-images/blob/main/b787_8_215_genx_cutaway.jpg?raw=true" 
               color="bg-stone-900"
               overview="A personal project to model and 3D-print a functioning (electric motor-powered) 2-spool turbofan engine to learn turbomachinery fundamentals."
               contributions={[
                 "Designing and FEA-validating a 3D printed turbofan architecture in Solidworks, targeting a 10:1 bypass ratio.",
                 "Calculating velocity triangles for compressor and turbine stages to optimize blade stagger angles and mass flow rates, to achieve a projected engine pressure ratio of 15.",
                 "Designing LP/HP architecture and a 4:1 planetary fan reduction gearbox to demonstrate speed decoupling.",
                 "Planning structural FEA (ANSYS) of rotating components and housings for stiffness and stress validation.",
                 "Optimized for DFM, assembly, and visualization, rather than CFD-validated aerodynamic performance."
               ]}
               results="Early CAD models in the works for major static and rotating elements. Building foundational turbomachinery knowledge applicable to future aerospace roles."
               tags={['Turbomachinery', 'CAD', 'Additive Mfg']}
             />

             <ModernProjectRow 
               index={2}
               title="Custom Composites 3D Printer"
               category="Mechatronics / R&D"
               image="https://github.com/danielbae1/portfolio-website-images/blob/main/3D%20wide%202.JPG?raw=true" 
               color="bg-stone-800"
               overview="Took over the build and design of a custom 3D printer capable of fibre-reinforced polymer extrusion for a research lab. The goal was to create a flexible platform for testing various polymer pellets."
               contributions={[
                 "Designed and FEA-validated a custom mount for the extruder.",
                 "Selected and assembled motors and 3-axis movement mechanisms.",
                 "Configured Klipper firmware with no prior experience in firmware programming."
               ]}
               results="Delivered an almost-functioning one-of-a-kind 3D printer with moving motors and axes."
               tags={['Mechatronics', 'Klipper', 'G-Code', 'Hardware Assembly']}
             />

             <ModernProjectRow 
               index={3}
               title="6-Axis Camera Robot Arm" // Updated Title
               category="Robotics / Consumer Tech"
               image="https://github.com/danielbae1/portfolio-website-images/blob/main/CA%20wide.png?raw=true" 
               color="bg-stone-900"
               overview="Designed a 6-axis camera robot aimed at amateur outdoor videographers. The goal was to enable slow, sweeping cinematic shots with a portable system weighing just over 2 kg." // Updated description
               contributions={[
                 "Developed a full CAD assembly in Solidworks, targeting <1 mm deflection at full reach.", // Updated contribution
                 "Performed torque and gear calculations to size motors and gear trains for fluid motion with payloads up to 2 kg.", // Updated contribution
                 "Led a 4-member team in designing the portable system." // Added leadership detail
               ]}
               results="Developed all mechanical components including hardware and fasteners. Created an aesthetically beautiful, portable system for automated cinematic shots."
               tags={['SolidWorks', 'Motor Control', 'Mechanism Design']}
             />
             
             {/* NEW PROJECT: Silica Powder Dispenser */}
             <ModernProjectRow 
               index={4}
               title="Lab-Grade Silica Powder Dispenser"
               category="Automation / Product Design"
               image="https://github.com/danielbae1/portfolio-website-images/blob/main/silica.png?raw=true"
               color="bg-stone-800"
               overview="Led a 6-member team in designing a lab-grade silica gel powder dispenser with an active HEPA filtration system."
               contributions={[
                 "Managed team progress and generated weekly status reports using Microsoft Project Gantt Chart.",
                 "Designed the active HEPA filtration system to ensure safe operation in a lab environment.",
                 "Coordinated the integration of mechanical dispensing mechanisms with electronic controls."
               ]}
               results="Successfully designed a functional prototype meeting lab safety standards and dispensing accuracy requirements."
               tags={['Product Design', 'Project Management', 'SolidWorks']}
             />

              <ModernProjectRow 
               index={5} // Incremented index
               title="Ford Wind Tunnel CFD Validation"
               category="Aerodynamics / Testing"
               image="https://github.com/danielbae1/portfolio-website-images/blob/main/image_98143b.png?raw=true" 
               color="bg-stone-900" // Alternating color
               overview="Visited the Ford Performance wind tunnel in Detroit to validate CFD simulation results against real-world data for the UTFR racecar."
               contributions={[
                 "Compared CFD simulation results with real-life wind tunnel data.",
                 "Changed wing element and flap configurations in a fast-paced study.",
                 "Coordinated team tasks and logistics throughout the testing sessions."
               ]}
               results="Drastically reduced flap configuration change times. Increased the number of configurations tested by 50% compared to the previous year."
               tags={['CFD', 'Aerodynamics', 'Data Analysis']}
             />
           </div>
        </div>
      )}

      {/* ==================== EXPEDITIONS VIEW ==================== */}
      {currentView === 'outdoors' && (
        <div className="min-h-screen bg-stone-50"> {/* LIGHT BACKGROUND */}
           {/* Header */}
           <div className="relative h-[60vh] w-full flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-stone-900">
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60 z-10"></div>
                <img 
                  src="https://github.com/danielbae1/portfolio-website-images/blob/main/DSC01341.JPG?raw=true" 
                  alt="Expeditions Background" 
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              <div className="relative z-20 text-center text-white px-6">
                <h1 className="font-serif text-5xl md:text-7xl mb-4 drop-shadow-lg">Expeditions & Photography</h1>
                <p className="text-stone-200 text-lg max-w-2xl mx-auto">
                   A lot happens when you realize free will.
                </p>
              </div>
           </div>

           <div className="max-w-6xl mx-auto px-6 py-24">
              {/* Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-y border-stone-200 py-8 mb-16">
                 <div>
                   <strong className="block text-3xl font-serif text-stone-900">5150 m</strong>
                   <span className="text-xs font-mono text-stone-500 uppercase">Max Elevation A.S.L.</span>
                 </div>
                 <div>
                   <strong className="block text-3xl font-serif text-stone-900">15</strong>
                   <span className="text-xs font-mono text-stone-500 uppercase">Mountains</span>
                 </div>
                 <div>
                   <strong className="block text-3xl font-serif text-stone-900">3914 m</strong>
                   <span className="text-xs font-mono text-stone-500 uppercase">Max 24h Elevation Change</span>
                 </div>
                 <div>
                   <strong className="block text-3xl font-serif text-stone-900">1</strong>
                   <span className="text-xs font-mono text-stone-500 uppercase">Backpack</span>
                 </div>
              </div>

              {/* Gallery - Updated with Specific Expeditions - Masonry Style */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                 <div className="lg:col-span-2">
                    <ExpeditionCard 
                        title="Cotopaxi Volcano"
                        sub="Ecuador | 5,897m"
                        location="Andes Mountains"
                        image="https://github.com/danielbae1/portfolio-website-images/blob/main/cotopaxi%201.JPG?raw=true"
                    />
                 </div>
                 
                 <ExpeditionCard 
                    title="Quilotoa Loop"
                    sub="Ecuador | Multi-Day Trek"
                    location="Andes Mountains"
                    image="https://github.com/danielbae1/portfolio-website-images/blob/main/quilotoa%201.JPG?raw=true"
                 />
                 
                 <ExpeditionCard 
                    title="Parque Nacional Cajas"
                    sub="Ecuador | High Altitude"
                    location="Cuenca"
                    image="https://github.com/danielbae1/portfolio-website-images/blob/main/cajas%201.JPG?raw=true"
                 />
                 
                 <div className="lg:col-span-2">
                    <ExpeditionCard 
                        title="Salkantay Trek"
                        sub="Peru | To Machu Picchu"
                        location="Cusco Region"
                        image="https://github.com/danielbae1/portfolio-website-images/blob/main/salkantay%201.JPG?raw=true"
                    />
                 </div>

                 <ExpeditionCard 
                    title="Parque Nacional Huascaran"
                    sub="Peru | Glacial Lakes"
                    location="Huaraz"
                    image="https://github.com/danielbae1/portfolio-website-images/blob/main/huaraz%201%20(513).JPG?raw=true"
                 />
              </div>

           </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="bg-white py-24 border-t border-stone-200 text-center">
        <h2 className="font-serif text-2xl text-stone-900 mb-8">Let's build something durable.</h2>
        <a href="mailto:danny.bae@mail.utoronto.ca" className="inline-block border-b border-stone-900 pb-1 text-sm font-bold uppercase tracking-widest hover:text-stone-600 hover:border-stone-600 transition-colors">
          danny.bae@mail.utoronto.ca
        </a>
        <div className="mt-12 text-stone-400 text-xs font-mono">
          &copy; 2025 Danny Bae. Built with React.
        </div>
      </footer>

    </div>
  );
}