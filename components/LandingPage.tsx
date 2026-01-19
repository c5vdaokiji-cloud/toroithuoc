import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight, Search, Shield, Zap, Activity, Database, CheckCircle2, Sparkles, TrendingUp, Layers } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const Typewriter: React.FC<{ words: string[]; delay?: number }> = ({ words, delay = 100 }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleTyping = () => {
      const currentWord = words[currentWordIndex];
      
      if (isDeleting) {
        setCurrentText(prev => prev.substring(0, prev.length - 1));
      } else {
        setCurrentText(prev => currentWord.substring(0, prev.length + 1));
      }

      if (!isDeleting && currentText === currentWord) {
        setTimeout(() => setIsDeleting(true), 2000); // Wait before deleting
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }
    };

    const timer = setTimeout(handleTyping, isDeleting ? 50 : delay);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, words, currentWordIndex, delay]);

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-accent-500 to-brand-600 dark:from-brand-400 dark:via-accent-400 dark:to-brand-400 drop-shadow-sm">
      {currentText}
      <span className="inline-block w-1 h-12 align-middle ml-1 bg-brand-500 animate-pulse"></span>
    </span>
  );
};

// Scroll Reveal Component using Intersection Observer
const ScrollReveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = '', delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '50px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${
        isVisible 
          ? 'opacity-100 translate-y-0 transform-none' 
          : 'opacity-0 translate-y-12'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 overflow-x-hidden relative bg-slate-50 dark:bg-slate-950 selection:bg-brand-500 selection:text-white">
      
      {/* Navbar */}
      <nav className="fixed w-full z-50 top-0 bg-white/10 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-brand-500 to-accent-600 p-2 rounded-xl shadow-lg shadow-brand-500/20">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">MediSearch</span>
           </div>
           <button onClick={onStart} className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Truy cập ngay
           </button>
        </div>
      </nav>

      {/* Parallax Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Blob 1 */}
        <div 
           className="absolute -top-[10%] -right-[10%] w-[50rem] h-[50rem] will-change-transform transform-gpu"
           style={{ transform: `translate3d(0, ${scrollY * 0.5}px, 0)` }}
        >
           <div className="w-full h-full rounded-full bg-brand-400/20 dark:bg-brand-900/20 blur-[60px] lg:blur-[100px] opacity-60 mix-blend-multiply dark:mix-blend-screen animate-blob will-change-transform transform-gpu"></div>
        </div>

        {/* Blob 2 */}
        <div 
           className="absolute top-[20%] -left-[10%] w-[45rem] h-[45rem] will-change-transform transform-gpu"
           style={{ transform: `translate3d(0, ${scrollY * 0.4}px, 0)` }}
        >
           <div className="w-full h-full rounded-full bg-accent-400/20 dark:bg-accent-900/20 blur-[60px] lg:blur-[100px] opacity-60 mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000 will-change-transform transform-gpu"></div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-screen flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          
          <div style={{ transform: `translate3d(0, ${scrollY * 0.2}px, 0)`, opacity: 1 - Math.min(1, scrollY / 700) }} className="will-change-transform transform-gpu">
              <ScrollReveal>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-8 shadow-sm hover:scale-105 transition-transform cursor-default">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                  </span>
                  Hệ thống dữ liệu Y Tế 4.0
                </div>
              </ScrollReveal>
              
              <ScrollReveal delay={100}>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1]">
                  Tra Cứu Dược Phẩm <br />
                  <Typewriter words={['Thông Minh', 'Chính Xác', 'Siêu Tốc', 'Bảo Mật']} />
                </h1>
              </ScrollReveal>
              
              <ScrollReveal delay={200}>
                <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed">
                  Nền tảng số hóa thông minh giúp quản lý, tìm kiếm thông tin thuốc từ Excel dễ dàng. Tối ưu hóa quy trình làm việc của bạn.
                </p>
              </ScrollReveal>
              
              <ScrollReveal delay={300}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                  <button 
                    onClick={onStart}
                    className="px-8 py-4 bg-slate-900 hover:bg-brand-600 dark:bg-white dark:hover:bg-brand-400 text-white dark:text-slate-900 rounded-2xl font-bold text-lg shadow-xl shadow-brand-500/20 transition-all hover:scale-105 hover:shadow-brand-500/40 flex items-center gap-3 group"
                  >
                    <Sparkles className="w-5 h-5 fill-current" />
                    Khám phá ngay
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="px-8 py-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-slate-700 dark:text-slate-200 border border-white/60 dark:border-slate-700 rounded-2xl font-bold text-lg hover:bg-white dark:hover:bg-slate-800 transition-all hover:-translate-y-1 shadow-sm hover:shadow-lg">
                    Tìm hiểu thêm
                  </button>
                </div>
              </ScrollReveal>
          </div>

          {/* Floating UI Elements */}
          <div 
            className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-12 hidden xl:block will-change-transform transform-gpu"
            style={{ transform: `translate3d(0, ${-scrollY * 0.15}px, 0)` }}
          >
             <div className="glass-panel p-4 rounded-2xl shadow-2xl flex items-center gap-4 w-72 animate-float">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-green-500/30">
                   <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                   <div className="text-sm font-bold text-slate-900 dark:text-white">Đã tìm thấy thuốc</div>
                   <div className="text-xs text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded mt-1 inline-block">Paracetamol 500mg</div>
                </div>
             </div>
          </div>

          <div 
            className="absolute top-1/3 right-0 -translate-y-1/2 translate-x-12 hidden xl:block will-change-transform transform-gpu"
            style={{ transform: `translate3d(0, ${-scrollY * 0.25}px, 0)` }}
          >
             <div className="glass-panel p-4 rounded-2xl shadow-2xl flex items-center gap-4 w-72 animate-float-delayed">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400 to-accent-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
                   <Database className="w-6 h-6" />
                </div>
                <div>
                   <div className="text-sm font-bold text-slate-900 dark:text-white">Dữ liệu đồng bộ</div>
                   <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Auto-sync enabled</div>
                </div>
             </div>
          </div>

        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white/60 dark:bg-slate-900/80 backdrop-blur-2xl border-t border-slate-200 dark:border-slate-800 relative z-20">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">Tính Năng <span className="text-brand-600 dark:text-brand-400">Vượt Trội</span></h2>
                <div className="h-1.5 w-24 bg-gradient-to-r from-brand-500 to-accent-500 mx-auto rounded-full"></div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal delay={100} className="h-full">
              <div className="group p-8 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-black/20 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-300 hover:-translate-y-2 h-full">
                <div className="w-16 h-16 bg-brand-50 dark:bg-brand-900/20 rounded-2xl flex items-center justify-center mb-8 text-brand-600 dark:text-brand-400 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Tra cứu siêu tốc</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg">
                  Công cụ tìm kiếm mạnh mẽ, hỗ trợ tìm theo tên, hoạt chất, số thứ tự. Kết quả hiển thị tức thì.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200} className="h-full">
              <div className="group p-8 bg-slate-900 dark:bg-slate-800 rounded-[2.5rem] border border-slate-800 dark:border-slate-700 shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-accent-500/20 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden h-full">
                 <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-brand-500 to-accent-600 opacity-10 rounded-bl-[100px] -mr-10 -mt-10 transition-all group-hover:scale-125"></div>
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 text-white group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                  <Layers className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Giao diện hiện đại</h3>
                <p className="text-slate-300 leading-relaxed text-lg">
                  Thiết kế Glassmorphism tinh tế, thân thiện người dùng, hỗ trợ Dark Mode và tương thích mọi thiết bị.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={300} className="h-full">
              <div className="group p-8 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-black/20 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-2 h-full">
                <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mb-8 text-purple-600 dark:text-purple-400 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Bảo mật tuyệt đối</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg">
                  Dữ liệu được lưu trữ cục bộ trên trình duyệt của bạn thông qua IndexedDB. An toàn và riêng tư.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 relative z-20">
        <div className="flex items-center justify-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <span className="font-bold text-slate-900 dark:text-white">MediSearch</span>
        </div>
        <p className="text-sm">© {new Date().getFullYear()} MediSearch. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;