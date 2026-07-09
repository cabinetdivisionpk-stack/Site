import React, { useState, useEffect, useRef } from "react";
import { 
  Volume2, 
  Ear, 
  Zap, 
  Gamepad2, 
  Sliders, 
  Mic, 
  CheckCircle2, 
  XCircle, 
  ShoppingBag, 
  CreditCard, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  User,
  ShieldCheck,
  Smartphone,
  Check,
  Send,
  Sparkles,
  Info
} from "lucide-react";

let cachedImages: HTMLImageElement[] = [];

export default function App() {
  // Preloading & Frame Sequence States
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [visiblePanel, setVisiblePanel] = useState<number | null>(0);
  const [activeStage, setActiveStage] = useState(1);
  const [headerScrolled, setHeaderScrolled] = useState(false);

  // References for Canvas and Animation
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const stickyWrapperRef = useRef<HTMLDivElement | null>(null);
  
  // Animation & Lerp control
  const targetFrame = useRef(1);
  const currentFrame = useRef(1);
  const prevPanelRef = useRef<number | null>(null);

  // Customizer LED Settings
  const [selectedColor, setSelectedColor] = useState({
    name: "Electric Violet",
    color: "#8b2df2",
    glow: "rgba(139, 45, 242, 0.45)"
  });

  const colors = [
    { name: "Electric Violet", color: "#8b2df2", glow: "rgba(139, 45, 242, 0.45)" },
    { name: "Cyan Blast", color: "#00b4d8", glow: "rgba(0, 180, 216, 0.45)" },
    { name: "Aurora Green", color: "#38b000", glow: "rgba(56, 176, 0, 0.45)" },
    { name: "Solar Flare", color: "#f77f00", glow: "rgba(247, 127, 0, 0.45)" },
    { name: "Carbon Crimson", color: "#d90429", glow: "rgba(217, 4, 41, 0.45)" }
  ];

  // Testimonials Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const testimonials = [
    {
      stars: 5,
      text: "The scroll animation on this site is not an exaggeration. The physical headphones are exactly as detailed and precise. The ANC is absolute silence, and the spatial audio makes movies feel like a full theater!",
      name: "Marcus Vance",
      title: "Acoustic Engineer & Reviewer",
      icon: "astronaut"
    },
    {
      stars: 5,
      text: "As a frequent traveler, the 60-hour battery life is a lifesaver. I flew from NY to Tokyo and back on a single charge. The sound is balanced, and the Electric Violet LED ring gets compliments everywhere.",
      name: "Sophia Lin",
      title: "Digital Nomad & Creator",
      icon: "ninja"
    },
    {
      stars: 5,
      text: "Low-distortion 40mm drivers deliver the cleanest transients I've heard in a closed-back wireless set. Perfect soundstage. Highly recommend to anyone looking to upgrade their home studio setup.",
      name: "Jared Miller",
      title: "Audio Producer",
      icon: "secret"
    }
  ];

  // Checkout State
  const [addonCase, setAddonCase] = useState(false);
  const [addonCable, setAddonCable] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [receiptRefNum, setReceiptRefNum] = useState("");
  
  // Checkout Form Fields
  const [formFields, setFormFields] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: ""
  });

  // Newsletter Form State
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // 1. Initial Preloader & Canvas Setup
  useEffect(() => {
    let isMounted = true;
    const totalFrames = 151;

    if (cachedImages.length === totalFrames) {
      imagesRef.current = cachedImages;
      setLoadingProgress(100);
      setLoadingComplete(true);
      return;
    }

    let loaded = 0;
    const preloadedImages: HTMLImageElement[] = [];

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/frames/ezgif-frame-${frameNum}.jpg`;
      img.onload = () => {
        if (!isMounted) return;
        loaded++;
        const progress = Math.floor((loaded / totalFrames) * 100);
        setLoadingProgress(progress);
        if (loaded === totalFrames) {
          cachedImages = preloadedImages;
          imagesRef.current = preloadedImages;
          setLoadingComplete(true);
        }
      };
      img.onerror = () => {
        if (!isMounted) return;
        loaded++;
        const progress = Math.floor((loaded / totalFrames) * 100);
        setLoadingProgress(progress);
        if (loaded === totalFrames) {
          cachedImages = preloadedImages;
          imagesRef.current = preloadedImages;
          setLoadingComplete(true);
        }
      };
      preloadedImages.push(img);
    }
    imagesRef.current = preloadedImages;

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Responsive Canvas Sizing & Drawing Function
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    const targetWidth = Math.floor(rect.width * dpr);
    const targetHeight = Math.floor(rect.height * dpr);
    
    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      if (targetWidth > 0 && targetHeight > 0) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }
    }
  };

  const drawImageContain = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const targetWidth = Math.floor(rect.width * dpr);
    const targetHeight = Math.floor(rect.height * dpr);
    
    // Auto-correct any initially collapsed canvas sizes (e.g., loaded before full layout painting)
    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      if (targetWidth > 0 && targetHeight > 0) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    
    ctx.resetTransform();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    if (width === 0 || height === 0) return;

    const imgRatio = img.width / img.height;
    const canvasRatio = width / height;

    let dWidth, dHeight, dx, dy;

    if (imgRatio > canvasRatio) {
      dWidth = width;
      dHeight = width / imgRatio;
      dx = 0;
      dy = (height - dHeight) / 2;
    } else {
      dHeight = height;
      dWidth = height * imgRatio;
      dx = (width - dWidth) / 2;
      dy = 0;
    }

    ctx.drawImage(img, dx, dy, dWidth, dHeight);
  };

  // Resize canvas immediately when loading completes and render initial frame
  useEffect(() => {
    if (loadingComplete) {
      resizeCanvas();
      const firstImg = imagesRef.current[0];
      if (firstImg) drawImageContain(firstImg);
    }
  }, [loadingComplete]);

  // 3. Scroll Handler to set target frame
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      
      // Header state
      setHeaderScrolled(scrollTop > 50);

      const container = scrollContainerRef.current;
      if (!container) return;

      const containerTop = container.offsetTop;
      const containerHeight = container.scrollHeight;
      const viewportHeight = window.innerHeight;
      
      const startScroll = containerTop;
      const endScroll = containerTop + containerHeight - viewportHeight;
      
      let scrollFraction = (scrollTop - startScroll) / (endScroll - startScroll);
      scrollFraction = Math.max(0, Math.min(1, scrollFraction));
      
      // Map back to frame number (1-151)
      targetFrame.current = Math.max(1, Math.min(151, Math.floor(scrollFraction * 151) + 1));
    };

    const handleResize = () => {
      resizeCanvas();
      const activeFrame = Math.round(currentFrame.current);
      const img = imagesRef.current[activeFrame - 1];
      if (img) drawImageContain(img);
    };

    // Synchronize initial scroll frame position on load
    handleScroll();
    
    // Quick frame sync on mount
    currentFrame.current = targetFrame.current;

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [loadingComplete]);

  // 4. Smooth Render Loop with LERP & Highlights triggers
  useEffect(() => {
    if (!loadingComplete) return;

    let animationFrameId: number;

    const renderLoop = () => {
      // Linear Interpolation for butter-smooth high frame rate transition
      const lerpFactor = 0.12;
      currentFrame.current += (targetFrame.current - currentFrame.current) * lerpFactor;
      
      if (Math.abs(targetFrame.current - currentFrame.current) < 0.01) {
        currentFrame.current = targetFrame.current;
      }
      
      const activeFrameIdx = Math.round(currentFrame.current);
      const imgToDraw = imagesRef.current[activeFrameIdx - 1];
      
      if (imgToDraw) {
        drawImageContain(imgToDraw);
      }

      // Track highlighting panels & stage index to minimize re-renders
      let currentPanel = 0;
      let stageNum = 1;

      if (activeFrameIdx >= 1 && activeFrameIdx <= 16) {
        currentPanel = 0;
        stageNum = 1;
      } else if (activeFrameIdx >= 22 && activeFrameIdx <= 47) {
        currentPanel = 1;
        stageNum = 1;
      } else if (activeFrameIdx >= 53 && activeFrameIdx <= 79) {
        currentPanel = 2;
        stageNum = 2;
      } else if (activeFrameIdx >= 85 && activeFrameIdx <= 110) {
        currentPanel = 3;
        stageNum = 3;
      } else if (activeFrameIdx >= 116 && activeFrameIdx <= 135) {
        currentPanel = 4;
        stageNum = 4;
      } else if (activeFrameIdx >= 142 && activeFrameIdx <= 151) {
        currentPanel = 5;
        stageNum = 5;
      } else {
        if (activeFrameIdx < 22) {
          currentPanel = 0;
          stageNum = 1;
        } else if (activeFrameIdx < 53) {
          currentPanel = 1;
          stageNum = 1;
        } else if (activeFrameIdx < 85) {
          currentPanel = 2;
          stageNum = 2;
        } else if (activeFrameIdx < 116) {
          currentPanel = 3;
          stageNum = 3;
        } else if (activeFrameIdx < 142) {
          currentPanel = 4;
          stageNum = 4;
        } else {
          currentPanel = 5;
          stageNum = 5;
        }
      }

      if (currentPanel !== prevPanelRef.current) {
        prevPanelRef.current = currentPanel;
        setVisiblePanel(currentPanel);
        setActiveStage(stageNum);
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [loadingComplete]);

  // Handle stage dot navigation click
  const handleStageDotClick = (index: number) => {
    const targetFrames = [35, 66, 97, 126, 146];
    const frameVal = targetFrames[index];
    
    const container = scrollContainerRef.current;
    if (!container) return;

    const containerTop = container.offsetTop;
    const containerHeight = container.scrollHeight;
    const viewportHeight = window.innerHeight;
    const scrollDistance = containerHeight - viewportHeight;
    
    const fraction = (frameVal - 1) / 150;
    const targetScrollY = containerTop + (fraction * scrollDistance);
    
    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth"
    });
  };

  // Change LED color customizer theme
  const handleColorChange = (colorObj: typeof colors[0]) => {
    setSelectedColor(colorObj);
    document.documentElement.style.setProperty("--color-accent", colorObj.color);
  };

  // Automated pricing logic
  const basePrice = 299.0;
  const taxRate = 0.08;
  const addonsTotal = (addonCase ? 29.0 : 0.0) + (addonCable ? 19.0 : 0.0);
  const subtotal = basePrice + addonsTotal;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  // Checkout inputs formatters
  const handleCardNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    let formatted = "";
    for (let i = 0; i < val.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += " ";
      formatted += val[i];
    }
    setFormFields({ ...formFields, cardNumber: formatted.slice(0, 19) });
  };

  const handleCardExpiryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length >= 2) {
      setFormFields({ ...formFields, cardExpiry: val.slice(0, 2) + "/" + val.slice(2, 4) });
    } else {
      setFormFields({ ...formFields, cardExpiry: val });
    }
  };

  // Handle Form Submission
  const handlePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const randomRef = "AURA-" + Math.floor(1000000 + Math.random() * 9000000);
      setReceiptRefNum(randomRef);
      setOrderComplete(true);
    }, 2000);
  };

  // Newsletter
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() === "") return;
    setNewsletterSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail("");
    }, 2000);
  };

  // Auto-play reviews slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative font-sans text-zinc-900 bg-[#f5f5f7] min-h-screen selection:bg-purple-600 selection:text-white">
      
      {/* 1. Preloader Overlay */}
      <div 
        className={`fixed inset-0 bg-[#f5f5f7] z-[99999] flex flex-col items-center justify-center transition-all duration-700 ${
          loadingComplete ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="flex flex-col items-center max-w-sm w-full px-6 text-center">
          <div className="font-heading text-4xl md:text-5xl font-bold tracking-[0.15em] text-zinc-900 relative pb-3 mb-8">
            AURA<span className="font-light text-zinc-400">PRO</span>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"></div>
          </div>
          
          <div className="relative w-32 h-32 flex items-center justify-center mb-6">
            <div className="absolute inset-0 border-4 border-black/5 border-t-purple-500 rounded-full animate-spin"></div>
            <div className="absolute w-[80%] h-[80%] border-2 border-black/5 border-b-cyan-400 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
            <span className="font-heading text-2xl font-bold text-zinc-900">{loadingProgress}%</span>
          </div>

          <p className="text-xs uppercase tracking-[0.12em] text-purple-600 mb-3 animate-pulse">
            Configuring Soundstage...
          </p>
          <div className="w-full h-[3px] bg-black/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300 rounded-full" 
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 2. Glassmorphic Header */}
      <header 
        className={`fixed top-0 left-0 w-full z-[1000] border-b border-black/5 transition-all duration-300 flex items-center ${
          headerScrolled 
            ? "bg-white/85 backdrop-blur-xl h-16 shadow-[0_4px_30px_rgba(0,0,0,0.05)]" 
            : "bg-transparent h-20"
        }`}
      >
        <div className="max-w-7xl mx-auto w-full px-6 flex items-center justify-between">
          <a href="#" className="font-heading text-xl font-bold tracking-wider text-zinc-900">
            AURA<span className="font-light text-zinc-400">PRO</span>
          </a>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#scroll-container" className="text-sm font-medium text-zinc-600 hover:text-zinc-950 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-purple-600 hover:after:w-full after:transition-all after:duration-300">Anatomy</a>
            <a href="#features" className="text-sm font-medium text-zinc-600 hover:text-zinc-950 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-purple-600 hover:after:w-full after:transition-all after:duration-300">Features</a>
            <a href="#customizer" className="text-sm font-medium text-zinc-600 hover:text-zinc-950 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-purple-600 hover:after:w-full after:transition-all after:duration-300">Customizer</a>
            <a href="#specs" className="text-sm font-medium text-zinc-600 hover:text-zinc-950 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-purple-600 hover:after:w-full after:transition-all after:duration-300">Specs</a>
            <a href="#testimonials" className="text-sm font-medium text-zinc-600 hover:text-zinc-950 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-purple-600 hover:after:w-full after:transition-all after:duration-300">Reviews</a>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => handleStageDotClick(0)} 
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-4 py-2 border border-black/10 hover:border-purple-500/50 hover:bg-purple-500/5 text-zinc-600 hover:text-zinc-950 rounded-full transition-all"
            >
              Explore <ChevronRight className="w-3 h-3" />
            </button>
            <a 
              href="#checkout" 
              className="inline-flex items-center justify-center text-xs font-bold bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white px-5 py-2.5 rounded-full transition-all duration-300 hover:scale-[1.03] shadow-[0_4px_15px_rgba(139,45,242,0.3)] hover:shadow-[0_4px_25px_rgba(139,45,242,0.45)]"
            >
              Pre-Order
            </a>
          </div>
        </div>
      </header>

      {/* 3. Canvas Sticky Container (The 3D Product Explosion Component with dynamically scattered panels) */}
      <div id="scroll-container" ref={scrollContainerRef} className="relative h-[650vh] w-full bg-[#f5f5f7]">
        <div ref={stickyWrapperRef} className="sticky-wrapper select-none">
          
          {/* Full Screen Canvas Container with Dynamic Composition Shifting */}
          <div className={`absolute inset-0 w-full h-full pointer-events-none z-[2] flex items-center justify-center transition-transform duration-[1200ms] ease-out ${
            visiblePanel === null || visiblePanel === 0 || visiblePanel === 1 || visiblePanel === 3 || visiblePanel === 5
              ? "md:translate-x-[14%] lg:translate-x-[18%]" 
              : "md:-translate-x-[14%] lg:-translate-x-[18%]"
          }`}>
            <canvas ref={canvasRef} id="explosion-canvas" className="w-full h-full object-contain pointer-events-none"></canvas>
          </div>

          {/* Interactive UI Panels - Scattered Absolutely for Balanced Visual Composition */}
          <div className="absolute inset-0 z-[10] pointer-events-none">
            
            {/* Panel 0: Hero Panel (Left Corner) */}
            <div 
              className={`absolute left-4 md:left-12 lg:left-20 xl:left-28 top-[50%] -translate-y-1/2 pointer-events-auto w-[calc(100%-2rem)] sm:w-[360px] md:w-[390px] transition-all duration-700 transform ${
                visiblePanel === 0 
                  ? "opacity-100 translate-y-[-50%] scale-100" 
                  : "opacity-0 translate-y-[-40%] scale-95 pointer-events-none absolute"
              }`}
            >
              <div className="bg-white/95 border border-black/5 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
                <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full text-[9px] font-bold tracking-wider text-purple-700 uppercase mb-4">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping"></div>
                  Next-Gen Audiophile Release
                </div>
                
                <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 mb-1 leading-none">
                  AURA <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent">PRO</span>
                </h1>
                
                <h2 className="font-heading text-xs sm:text-sm font-medium text-zinc-500 mb-4 tracking-wide">
                  Acoustic Anatomy Re-engineered
                </h2>
                
                <p className="text-zinc-600 text-xs leading-relaxed mb-6">
                  Embark on a modular journey into high-fidelity sound. Scroll downward to disassemble the architecture, exploring our state-of-the-art acoustic mechanics in micro-detail.
                </p>

                <div className="flex items-center gap-3 mb-6">
                  <button 
                    onClick={() => handleStageDotClick(0)} 
                    className="px-5 py-3 bg-zinc-900 hover:bg-zinc-800 text-[10px] font-bold text-white rounded-full transition-all duration-300 hover:scale-[1.03] flex items-center justify-center gap-1.5 shadow-md"
                  >
                    Begin <ArrowRight className="w-3 h-3" />
                  </button>
                  <a 
                    href="#checkout" 
                    className="px-5 py-3 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200/60 text-[10px] font-bold text-zinc-800 rounded-full transition-all duration-300 flex items-center justify-center gap-1.5"
                  >
                    Order Now ($299)
                  </a>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 pt-5 border-t border-zinc-100">
                  <div>
                    <span className="font-heading text-lg font-bold text-zinc-900 block">60H</span>
                    <span className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold block">Playback</span>
                  </div>
                  <div>
                    <span className="font-heading text-lg font-bold text-zinc-900 block">-48dB</span>
                    <span className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold block">Neural ANC</span>
                  </div>
                  <div>
                    <span className="font-heading text-lg font-bold text-zinc-900 block">40mm</span>
                    <span className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold block">Composite driver</span>
                  </div>
                  <div>
                    <span className="font-heading text-lg font-bold text-zinc-900 block">&lt;0.1%</span>
                    <span className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold block">Ultra-Low THD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel 1: Ergonomic Design (Left Corner) */}
            <div 
              className={`absolute left-4 md:left-12 lg:left-20 xl:left-28 top-[50%] -translate-y-1/2 pointer-events-auto w-[calc(100%-2rem)] sm:w-[360px] md:w-[390px] transition-all duration-700 transform ${
                visiblePanel === 1 
                  ? "opacity-100 translate-y-[-50%] scale-100" 
                  : "opacity-0 translate-y-[-40%] scale-95 pointer-events-none absolute"
              }`}
            >
              <div className="bg-white/95 border border-black/5 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
                <span className="inline-block text-[9px] font-bold uppercase tracking-[0.15em] text-emerald-600 mb-2">
                  01 . Ergonomics
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-zinc-900 mb-3">Architectural Perfection</h3>
                <p className="text-xs text-zinc-600 leading-relaxed mb-6">
                  Designed for weightless fatigue-free listening. The telescoping aluminum headband core and custom-pivoting ear cups distribute lateral clamp pressure with surgical consistency.
                </p>
                <ul className="flex flex-col gap-3 text-[11px] text-zinc-700 font-medium">
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 p-0.5"><Check className="w-3 h-3 stroke-[3.5]" /></div>
                    <span>High-grade sandblasted aluminum core sliders</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 p-0.5"><Check className="w-3 h-3 stroke-[3.5]" /></div>
                    <span>Acoustic-mesh protein-leather memory foam</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 p-0.5"><Check className="w-3 h-3 stroke-[3.5]" /></div>
                    <span>Pure weight-saving carbon fiber matrix</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Panel 2: Acoustic Driver (Right Corner) */}
            <div 
              className={`absolute right-4 md:right-12 lg:right-20 xl:right-28 top-[50%] -translate-y-1/2 pointer-events-auto w-[calc(100%-2rem)] sm:w-[360px] md:w-[390px] transition-all duration-700 transform ${
                visiblePanel === 2 
                  ? "opacity-100 translate-y-[-50%] scale-100" 
                  : "opacity-0 translate-y-[-40%] scale-95 pointer-events-none absolute"
              }`}
            >
              <div className="bg-white/95 border border-black/5 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
                <span className="inline-block text-[9px] font-bold uppercase tracking-[0.15em] text-emerald-600 mb-2">
                  02 . Acoustics
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-zinc-900 mb-3">Tactile Dynamic Drivers</h3>
                <p className="text-xs text-zinc-600 leading-relaxed mb-6">
                  A proprietary 40mm transducer is housed inside an isolation baffle. Integrating a bio-cellulose composite diaphragm and high-purity oxygen-free copper coil, it produces breathtaking transient speeds.
                </p>
                <ul className="flex flex-col gap-3 text-[11px] text-zinc-700 font-medium">
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 p-0.5"><Check className="w-3 h-3 stroke-[3.5]" /></div>
                    <span>Customized 40mm bio-cellulose composite cone</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 p-0.5"><Check className="w-3 h-3 stroke-[3.5]" /></div>
                    <span>Dual-chamber pressure equalization vents</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 p-0.5"><Check className="w-3 h-3 stroke-[3.5]" /></div>
                    <span>Ultra-low distortion (&lt;0.1% THD @ 1kHz)</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Panel 3: ANC Chipset (Left Corner) */}
            <div 
              className={`absolute left-4 md:left-12 lg:left-20 xl:left-28 top-[50%] -translate-y-1/2 pointer-events-auto w-[calc(100%-2rem)] sm:w-[360px] md:w-[390px] transition-all duration-700 transform ${
                visiblePanel === 3 
                  ? "opacity-100 translate-y-[-50%] scale-100" 
                  : "opacity-0 translate-y-[-40%] scale-95 pointer-events-none absolute"
              }`}
            >
              <div className="bg-white/95 border border-black/5 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
                <span className="inline-block text-[9px] font-bold uppercase tracking-[0.15em] text-emerald-600 mb-2">
                  03 . Intelligence
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-zinc-900 mb-3">Proprietary DSP ANC</h3>
                <p className="text-xs text-zinc-600 leading-relaxed mb-6">
                  Powered by a dedicated dual-core neural computing chip. The feedback and feedforward microphones analyze external frequency arrays up to 48,000 times per second to generate real-time anti-noise profiles.
                </p>
                <ul className="flex flex-col gap-3 text-[11px] text-zinc-700 font-medium">
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 p-0.5"><Check className="w-3 h-3 stroke-[3.5]" /></div>
                    <span>Hybrid Active Noise Cancellation (blocks up to 48dB)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 p-0.5"><Check className="w-3 h-3 stroke-[3.5]" /></div>
                    <span>Personalized ear canal acoustics profiling</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 p-0.5"><Check className="w-3 h-3 stroke-[3.5]" /></div>
                    <span>Intelligent transparency conversation auto-trigger</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Panel 4: Battery & Electronics (Right Corner) */}
            <div 
              className={`absolute right-4 md:right-12 lg:right-20 xl:right-28 top-[50%] -translate-y-1/2 pointer-events-auto w-[calc(100%-2rem)] sm:w-[360px] md:w-[390px] transition-all duration-700 transform ${
                visiblePanel === 4 
                  ? "opacity-100 translate-y-[-50%] scale-100" 
                  : "opacity-0 translate-y-[-40%] scale-95 pointer-events-none absolute"
              }`}
            >
              <div className="bg-white/95 border border-black/5 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
                <span className="inline-block text-[9px] font-bold uppercase tracking-[0.15em] text-emerald-600 mb-2">
                  04 . Autonomy
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-zinc-900 mb-3">60 Hours of Playback</h3>
                <p className="text-xs text-zinc-600 leading-relaxed mb-6">
                  Dual integrated lithium-polymer batteries sit inside optimized chambers to preserve center-of-gravity balance, offering up to 60 hours of continuous wireless acoustic play.
                </p>
                <ul className="flex flex-col gap-3 text-[11px] text-zinc-700 font-medium">
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 p-0.5"><Check className="w-3 h-3 stroke-[3.5]" /></div>
                    <span>Dual 500mAh high-density power cell array</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 p-0.5"><Check className="w-3 h-3 stroke-[3.5]" /></div>
                    <span>Type-C QuickCharge: 10 mins adds 10 hours</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 p-0.5"><Check className="w-3 h-3 stroke-[3.5]" /></div>
                    <span>Intelligent physical wear detection auto-off sensors</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Panel 5: Aura Ring LED & Touchpad (Left Corner) */}
            <div 
              className={`absolute left-4 md:left-12 lg:left-20 xl:left-28 top-[50%] -translate-y-1/2 pointer-events-auto w-[calc(100%-2rem)] sm:w-[360px] md:w-[390px] transition-all duration-700 transform ${
                visiblePanel === 5 
                  ? "opacity-100 translate-y-[-50%] scale-100" 
                  : "opacity-0 translate-y-[-40%] scale-95 pointer-events-none absolute"
              }`}
            >
              <div className="bg-white/95 border border-black/5 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
                <span className="inline-block text-[9px] font-bold uppercase tracking-[0.15em] text-emerald-600 mb-2">
                  05 . Interface
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-zinc-900 mb-3">Aura RGB Light Ring</h3>
                <p className="text-xs text-zinc-600 leading-relaxed mb-6">
                  Precision micro-LED arrays encircle the outer cup plates, giving elegant feedback on connection status, battery levels, active modes, and customized color preference configurations.
                </p>
                <ul className="flex flex-col gap-3 text-[11px] text-zinc-700 font-medium">
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 p-0.5"><Check className="w-3 h-3 stroke-[3.5]" /></div>
                    <span>12 smart micro-LED configurable illumination rings</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 p-0.5"><Check className="w-3 h-3 stroke-[3.5]" /></div>
                    <span>Scratch-resistant capacitive multi-touch gesture plate</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 p-0.5"><Check className="w-3 h-3 stroke-[3.5]" /></div>
                    <span>Studio-grade 6-beamforming microphone voice matrix</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>

          {/* Interactive Fixed Stage Navigation Frame Overlay */}
          <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-[100] flex flex-col items-center gap-4 bg-white/80 border border-black/5 backdrop-blur-md px-3 py-6 rounded-full shadow-lg">
            <span className="writing-mode-vertical uppercase text-[8px] font-bold tracking-[0.2em] text-zinc-400 mb-2">
              Stage
            </span>
            <span className="font-heading text-sm font-bold text-zinc-900 block">
              0{activeStage}
            </span>
            <div className="flex flex-col gap-3 mt-2">
              {[0, 1, 2, 3, 4].map((idx) => (
                <button
                  key={idx}
                  onClick={() => handleStageDotClick(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    activeStage === idx + 1 
                      ? "bg-purple-600 scale-125 shadow-[0_0_8px_rgba(139,45,242,0.4)]" 
                      : "bg-zinc-300 hover:bg-zinc-400"
                  }`}
                  aria-label={`Jump to stage ${idx + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 5. Features Grid Section */}
      <section id="features" className="relative py-24 md:py-32 bg-gradient-to-b from-[#f5f5f7] via-[#e2e2e8] to-[#f5f5f7] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,45,242,0.04)_0%,transparent_60%)] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-[0.15em] block mb-3">
              Excellence in Every Detail
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight mb-4">
              Designed for Audiophiles
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-purple-600 to-cyan-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="group bg-white/90 border border-black/5 hover:border-purple-500/20 p-8 rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:bg-white hover:shadow-[0_25px_50px_rgba(0,0,0,0.04),_0_0_20px_rgba(139,45,242,0.05)] flex flex-col gap-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-black/[0.005] to-transparent pointer-events-none"></div>
              <div className="w-14 h-14 bg-zinc-100 border border-zinc-200/50 group-hover:border-transparent group-hover:bg-gradient-to-br group-hover:from-purple-600 group-hover:to-cyan-500 rounded-2xl flex items-center justify-center text-purple-600 group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm shrink-0">
                <Volume2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 group-hover:text-purple-700 transition-colors">Hi-Res Wireless Audio</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Support for advanced high-bitrate LDAC, aptX Adaptive, and AAC formats. Transmitting up to three times the signal capacity of basic SBC codecs to preserve subtle transients.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group bg-white/90 border border-black/5 hover:border-purple-500/20 p-8 rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:bg-white hover:shadow-[0_25px_50px_rgba(0,0,0,0.04),_0_0_20px_rgba(139,45,242,0.05)] flex flex-col gap-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-black/[0.005] to-transparent pointer-events-none"></div>
              <div className="w-14 h-14 bg-zinc-100 border border-zinc-200/50 group-hover:border-transparent group-hover:bg-gradient-to-br group-hover:from-purple-600 group-hover:to-cyan-500 rounded-2xl flex items-center justify-center text-purple-600 group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm shrink-0">
                <Ear className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 group-hover:text-purple-700 transition-colors">Adaptive Spatial Audio</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Advanced 9-axis spatial orientation engine. Intelligently tracking head motion configurations to recalculate and lock directional channels, maintaining full theater scale.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group bg-white/90 border border-black/5 hover:border-purple-500/20 p-8 rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:bg-white hover:shadow-[0_25px_50px_rgba(0,0,0,0.04),_0_0_20px_rgba(139,45,242,0.05)] flex flex-col gap-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-black/[0.005] to-transparent pointer-events-none"></div>
              <div className="w-14 h-14 bg-zinc-100 border border-zinc-200/50 group-hover:border-transparent group-hover:bg-gradient-to-br group-hover:from-purple-600 group-hover:to-cyan-500 rounded-2xl flex items-center justify-center text-purple-600 group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 group-hover:text-purple-700 transition-colors">Type-C Power Delivery</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Fast charging rethought. Integrate high-grade power delivery circuitry to reach 100% full capacity from dead in under 45 minutes, remaining safely wire-free for days.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="group bg-white/90 border border-black/5 hover:border-purple-500/20 p-8 rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:bg-white hover:shadow-[0_25px_50px_rgba(0,0,0,0.04),_0_0_20px_rgba(139,45,242,0.05)] flex flex-col gap-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-black/[0.005] to-transparent pointer-events-none"></div>
              <div className="w-14 h-14 bg-zinc-100 border border-zinc-200/50 group-hover:border-transparent group-hover:bg-gradient-to-br group-hover:from-purple-600 group-hover:to-cyan-500 rounded-2xl flex items-center justify-center text-purple-600 group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm shrink-0">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 group-hover:text-purple-700 transition-colors">Gaming Low-Latency Mode</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Toggle on the hyper-sync signal. Compresses latency delays down to a raw 32ms, packing high-fidelity sound perfectly aligned with gaming or cinematic screen elements.
                </p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="group bg-white/90 border border-black/5 hover:border-purple-500/20 p-8 rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:bg-white hover:shadow-[0_25px_50px_rgba(0,0,0,0.04),_0_0_20px_rgba(139,45,242,0.05)] flex flex-col gap-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-black/[0.005] to-transparent pointer-events-none"></div>
              <div className="w-14 h-14 bg-zinc-100 border border-zinc-200/50 group-hover:border-transparent group-hover:bg-gradient-to-br group-hover:from-purple-600 group-hover:to-cyan-500 rounded-2xl flex items-center justify-center text-purple-600 group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm shrink-0">
                <Sliders className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 group-hover:text-purple-700 transition-colors">Smart Multipoint Connection</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Simultaneous dual bluetooth pairing profiles. Instantly switch focus from a dynamic video conference call on your work station to an incoming ring on your device automatically.
                </p>
              </div>
            </div>

            {/* Card 6 */}
            <div className="group bg-white/90 border border-black/5 hover:border-purple-500/20 p-8 rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:bg-white hover:shadow-[0_25px_50px_rgba(0,0,0,0.04),_0_0_20px_rgba(139,45,242,0.05)] flex flex-col gap-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-black/[0.005] to-transparent pointer-events-none"></div>
              <div className="w-14 h-14 bg-zinc-100 border border-zinc-200/50 group-hover:border-transparent group-hover:bg-gradient-to-br group-hover:from-purple-600 group-hover:to-cyan-500 rounded-2xl flex items-center justify-center text-purple-600 group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm shrink-0">
                <Mic className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-zinc-900 mb-2 group-hover:text-purple-700 transition-colors">Voice Baffle Microphones</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Integrated array filters out surrounding wind noise, road rumbles, or room chatter. Extracting vocal frequency patterns with absolute isolation for premium call clarity.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Dynamic Color Customizer Section */}
      <section id="customizer" className="relative py-24 md:py-32 bg-[#e2e2e8]/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Left Column: Color LED Preview Display */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center relative p-12 border border-black/5 rounded-3xl min-h-[450px] overflow-hidden bg-gradient-to-b from-white to-[#f5f5f7] shadow-xl">
              <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
                <div 
                  className="w-80 h-80 rounded-full filter blur-[100px] opacity-[0.15] transition-all duration-1000"
                  style={{ backgroundColor: selectedColor.color }}
                ></div>
              </div>

              {/* simulated headphone earplate plate */}
              <div className="relative z-10 scale-110">
                <div className="relative w-52 h-52 rounded-full bg-gradient-to-br from-white to-zinc-100 border border-zinc-200/60 flex items-center justify-center shadow-lg">
                  <span className="font-heading text-6xl font-bold text-zinc-800">A</span>
                  
                  {/* Glowing customizer LED ring */}
                  <div 
                    className="absolute inset-[15px] rounded-full border-4 transition-all duration-700"
                    style={{ 
                      borderColor: selectedColor.color,
                      boxShadow: `0 0 20px 4px ${selectedColor.glow}, inset 0 0 20px ${selectedColor.glow}`
                    }}
                  ></div>
                </div>
              </div>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500 bg-white/80 border border-zinc-200 px-4 py-1.5 rounded-full shadow-sm backdrop-blur-md z-10">
                <Sparkles className="w-3.5 h-3.5" style={{ color: selectedColor.color }} /> Simulated Illumination Preview
              </div>
            </div>

            {/* Right Column: Customizer Interface Controls */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <span className="text-xs font-bold uppercase tracking-[0.15em] mb-3 block" style={{ color: selectedColor.color }}>
                Aesthetic Calibration
              </span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight mb-4">
                Configure Aura RGB
              </h2>
              <p className="text-zinc-600 mb-8 leading-relaxed">
                Personalize your physical presence. Our customizable light rings built into each aluminum cup shell adapt dynamically. Adjust the theme to one of 5 premium default colorways.
              </p>

              <div className="flex gap-4 mb-6">
                {colors.map((colorObj) => (
                  <button
                    key={colorObj.name}
                    onClick={() => handleColorChange(colorObj)}
                    className={`w-12 h-12 rounded-full border-[3px] border-white shadow-md transition-all duration-300 relative ${
                      selectedColor.name === colorObj.name 
                        ? "scale-115 ring-2 ring-offset-2 ring-offset-white" 
                        : "hover:scale-105"
                    }`}
                    style={{ 
                      backgroundColor: colorObj.color,
                      "--tw-ring-color": selectedColor.color 
                    } as React.CSSProperties}
                    aria-label={`Select ${colorObj.name}`}
                  >
                    {selectedColor.name === colorObj.name && (
                      <Check className="w-5 h-5 text-white absolute inset-0 m-auto" />
                    )}
                  </button>
                ))}
              </div>

              <div className="text-sm font-semibold text-zinc-800 mb-8 bg-zinc-100/80 border border-zinc-200 px-4 py-2.5 rounded-xl inline-block self-start">
                Active Selection: <span className="font-bold uppercase tracking-wider" style={{ color: selectedColor.color }}>{selectedColor.name}</span>
              </div>

              <div className="border-t border-zinc-200 pt-6 flex flex-col gap-4">
                <div className="flex justify-between items-center text-sm border-b border-zinc-100 pb-3">
                  <span className="font-medium text-zinc-500">LED Array Density</span>
                  <span className="font-bold text-zinc-900">12 Smart Micro-LEDs</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-zinc-100 pb-3">
                  <span className="font-medium text-zinc-500">Power Coefficient</span>
                  <span className="font-bold text-zinc-900">0.05W ultra-low drain</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-zinc-500">Sync Profiles</span>
                  <span className="font-bold text-zinc-900">Pulse, Sync, Solid, Off</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Specs Comparison Section */}
      <section id="specs" className="relative py-24 md:py-32 bg-gradient-to-b from-[#f5f5f7] via-[#e2e2e8] to-[#f5f5f7]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-[0.15em] block mb-3">
              How it Compares
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight mb-4">
              Technical Specifications
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-purple-600 to-cyan-500 mx-auto rounded-full"></div>
          </div>

          <div className="bg-white/90 border border-black/5 rounded-3xl overflow-hidden shadow-xl backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50/50">
                    <th className="p-6 text-sm font-semibold uppercase tracking-wider text-zinc-500">Specification</th>
                    <th className="p-6 text-sm font-bold uppercase tracking-wider text-purple-700 bg-purple-50/50">AURA Pro</th>
                    <th className="p-6 text-sm font-semibold uppercase tracking-wider text-zinc-700">AURA Standard</th>
                    <th className="p-6 text-sm font-semibold uppercase tracking-wider text-zinc-700">Competitor Flagship</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/60 text-sm font-medium text-zinc-600">
                  <tr className="hover:bg-zinc-50/40 transition-colors">
                    <td className="p-6 text-zinc-900 font-bold">Driver Configuration</td>
                    <td className="p-6 bg-purple-50/50 text-purple-700 font-bold">40mm Dynamic (Composite)</td>
                    <td className="p-6">40mm Dynamic (Standard)</td>
                    <td className="p-6 text-zinc-500">38mm Standard Mylar</td>
                  </tr>
                  <tr className="hover:bg-zinc-50/40 transition-colors">
                    <td className="p-6 text-zinc-900 font-bold">ANC Isolation Rate</td>
                    <td className="p-6 bg-purple-50/50 text-purple-700 font-bold">Smart Hybrid (Up to 48dB)</td>
                    <td className="p-6">Standard Active (Up to 38dB)</td>
                    <td className="p-6 text-zinc-500">Active ANC (Up to 40dB)</td>
                  </tr>
                  <tr className="hover:bg-zinc-50/40 transition-colors">
                    <td className="p-6 text-zinc-900 font-bold">Battery Span (ANC Off)</td>
                    <td className="p-6 bg-purple-50/50 text-purple-700 font-bold">60 Hours</td>
                    <td className="p-6">40 Hours</td>
                    <td className="p-6 text-zinc-500">30 Hours</td>
                  </tr>
                  <tr className="hover:bg-zinc-50/40 transition-colors">
                    <td className="p-6 text-zinc-900 font-bold">Quick-Charge Factor</td>
                    <td className="p-6 bg-purple-50/50 text-purple-700 font-bold">10 min = 10 Hours</td>
                    <td className="p-6">15 min = 5 Hours</td>
                    <td className="p-6 text-zinc-500">10 min = 3 Hours</td>
                  </tr>
                  <tr className="hover:bg-zinc-50/40 transition-colors">
                    <td className="p-6 text-zinc-900 font-bold">Available Codecs</td>
                    <td className="p-6 bg-purple-50/50 text-purple-700 font-bold">LDAC, aptX Adaptive, AAC, SBC</td>
                    <td className="p-6">AAC, SBC</td>
                    <td className="p-6 text-zinc-500">AAC, SBC, LDAC</td>
                  </tr>
                  <tr className="hover:bg-zinc-50/40 transition-colors">
                    <td className="p-6 text-zinc-900 font-bold">Aura Ambient LED Ring</td>
                    <td className="p-6 bg-purple-50/50 text-purple-700 font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Configurable RGB
                    </td>
                    <td className="p-6">
                      <span className="text-zinc-400 font-normal">None</span>
                    </td>
                    <td className="p-6">
                      <span className="text-zinc-400 font-normal">None</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-50/40 transition-colors">
                    <td className="p-6 text-zinc-900 font-bold">Weight Aspect</td>
                    <td className="p-6 bg-purple-50/50 text-purple-700 font-bold">260g</td>
                    <td className="p-6">265g</td>
                    <td className="p-6 text-zinc-500">285g</td>
                  </tr>
                  <tr className="hover:bg-zinc-50/40 transition-colors">
                    <td className="p-6 text-zinc-900 font-bold">Price</td>
                    <td className="p-6 bg-purple-50/60 text-purple-700 font-bold text-base">$299</td>
                    <td className="p-6 text-base text-zinc-800">$199</td>
                    <td className="p-6 text-zinc-500 text-base">$349</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Testimonials Section */}
      <section id="testimonials" className="relative py-24 md:py-32 bg-[#e2e2e8]/40">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-[0.15em] block mb-3">
              Real Sound, Real Stories
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight mb-4">
              What Audiophiles Say
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-purple-600 to-cyan-500 mx-auto rounded-full"></div>
          </div>

          <div className="relative flex flex-col items-center">
            {/* Reviews container */}
            <div className="w-full relative min-h-[280px]">
              {testimonials.map((review, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 w-full h-full bg-white/90 border border-black/5 rounded-3xl p-8 sm:p-12 flex flex-col justify-between shadow-xl transition-all duration-700 transform ${
                    currentSlide === idx 
                      ? "opacity-100 translate-x-0 scale-100 z-10" 
                      : "opacity-0 translate-x-12 scale-95 z-0 pointer-events-none"
                  }`}
                >
                  <div>
                    <div className="flex gap-1 mb-6 text-amber-500">
                      {[...Array(review.stars)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                    <p className="text-lg sm:text-xl font-light italic text-zinc-800 leading-relaxed mb-6">
                      &ldquo;{review.text}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center gap-4 border-t border-zinc-100 pt-6">
                    <div className="w-12 h-12 bg-zinc-100 border border-zinc-200 rounded-full flex items-center justify-center text-purple-600 shadow-sm">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-zinc-900 text-base">{review.name}</h4>
                      <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">{review.title}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Slider Navigation Controls */}
            <div className="flex items-center gap-6 mt-8 z-20">
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="w-12 h-12 bg-white border border-zinc-200 hover:border-purple-600 hover:bg-purple-50/50 rounded-full flex items-center justify-center text-zinc-700 transition-all shadow-sm"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      currentSlide === idx 
                        ? "bg-purple-600 scale-125 shadow-[0_0_8px_rgba(139,45,242,0.4)]" 
                        : "bg-zinc-300 hover:bg-zinc-400"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % testimonials.length)}
                className="w-12 h-12 bg-white border border-zinc-200 hover:border-purple-600 hover:bg-purple-50/50 rounded-full flex items-center justify-center text-zinc-700 transition-all shadow-sm"
                aria-label="Next review"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Pre-Order Checkout Form (Fully Interactive & Automated Pricing) */}
      <section id="checkout" className="relative py-24 md:py-32 bg-gradient-to-b from-[#f5f5f7] via-white to-[#e2e2e8] border-t border-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-[0.15em] block mb-3">
              Secure Your Pair Today
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight mb-4">
              Pre-Order AURA Pro
            </h2>
            <p className="text-zinc-600 text-sm sm:text-base">
              AURA Pro headphones are currently in pilot tooling. Delivery begins late October 2026. Price includes all shipping.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Order Summary (LG 5-cols) */}
            <div className="lg:col-span-5 bg-white border border-black/5 p-8 rounded-3xl shadow-xl backdrop-blur-md">
              <h3 className="font-heading text-xl font-bold text-zinc-900 mb-6 pb-4 border-b border-zinc-100 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-purple-600" /> Order Summary
              </h3>

              <div className="flex gap-4 items-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-zinc-50 to-zinc-100 border border-zinc-200/50 rounded-2xl flex items-center justify-center text-[#8b2df2] shadow-inner font-bold text-2xl">
                  A
                </div>
                <div className="flex-1">
                  <h4 className="font-heading text-base font-bold text-zinc-900">AURA Pro Headphone</h4>
                  <span className="text-xs text-zinc-500 block mt-1">Active Hue LED: <span className="text-purple-600 font-bold">{selectedColor.name}</span></span>
                  <span className="text-sm font-bold text-purple-600 block mt-1">$299.00</span>
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-6 mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">Premium upgrades</h4>
                
                <div className="flex flex-col gap-3">
                  <label className="flex items-center justify-between bg-zinc-50 border border-zinc-200/50 hover:border-purple-500/20 p-4 rounded-xl cursor-pointer transition-colors group">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={addonCase}
                        onChange={() => setAddonCase(!addonCase)}
                        className="w-5 h-5 rounded border-zinc-300 text-purple-600 focus:ring-purple-500 accent-purple-600 bg-white" 
                      />
                      <span className="text-sm text-zinc-700 font-medium group-hover:text-zinc-900 transition-colors">Hard-Shell Custom Case</span>
                    </div>
                    <span className="text-sm font-bold text-zinc-800 shrink-0">+$29.00</span>
                  </label>

                  <label className="flex items-center justify-between bg-zinc-50 border border-zinc-200/50 hover:border-purple-500/20 p-4 rounded-xl cursor-pointer transition-colors group">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={addonCable}
                        onChange={() => setAddonCable(!addonCable)}
                        className="w-5 h-5 rounded border-zinc-300 text-purple-600 focus:ring-purple-500 accent-purple-600 bg-white" 
                      />
                      <span className="text-sm text-zinc-700 font-medium group-hover:text-zinc-900 transition-colors">Premium Silver Core Cable</span>
                    </div>
                    <span className="text-sm font-bold text-zinc-800 shrink-0">+$19.00</span>
                  </label>
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-6 space-y-3.5 text-sm">
                <div className="flex justify-between text-zinc-500">
                  <span>Unit Subtotal</span>
                  <span className="font-semibold text-zinc-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-500 items-center">
                  <span>Standard Shipping</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase">FREE</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-semibold text-zinc-900">${tax.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-lg font-bold text-zinc-900 pt-4 border-t border-zinc-100">
                  <span>Total Due</span>
                  <span className="text-purple-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Checkout Form (LG 7-cols) */}
            <div className="lg:col-span-7 bg-white border border-black/5 p-8 rounded-3xl shadow-xl backdrop-blur-md">
              <h3 className="font-heading text-xl font-bold text-zinc-900 mb-6 pb-4 border-b border-zinc-100 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-600" /> Secure Checkout
              </h3>

              <form onSubmit={handlePurchaseSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">First Name</label>
                    <input 
                      type="text" 
                      required
                      value={formFields.firstName}
                      onChange={(e) => setFormFields({ ...formFields, firstName: e.target.value })}
                      placeholder="John"
                      className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 focus:border-purple-500 focus:bg-white rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Last Name</label>
                    <input 
                      type="text" 
                      required
                      value={formFields.lastName}
                      onChange={(e) => setFormFields({ ...formFields, lastName: e.target.value })}
                      placeholder="Doe"
                      className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 focus:border-purple-500 focus:bg-white rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formFields.email}
                    onChange={(e) => setFormFields({ ...formFields, email: e.target.value })}
                    placeholder="john.doe@example.com"
                    className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 focus:border-purple-500 focus:bg-white rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Shipping Address</label>
                  <input 
                    type="text" 
                    required
                    value={formFields.address}
                    onChange={(e) => setFormFields({ ...formFields, address: e.target.value })}
                    placeholder="123 Sonic Wave Avenue"
                    className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 focus:border-purple-500 focus:bg-white rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">City</label>
                    <input 
                      type="text" 
                      required
                      value={formFields.city}
                      onChange={(e) => setFormFields({ ...formFields, city: e.target.value })}
                      placeholder="Acoustic Valley"
                      className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 focus:border-purple-500 focus:bg-white rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">State</label>
                    <input 
                      type="text" 
                      required
                      maxLength={2}
                      value={formFields.state}
                      onChange={(e) => setFormFields({ ...formFields, state: e.target.value })}
                      placeholder="CA"
                      className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 focus:border-purple-500 focus:bg-white rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">ZIP Code</label>
                    <input 
                      type="text" 
                      required
                      pattern="[0-9]{5}"
                      value={formFields.zip}
                      onChange={(e) => setFormFields({ ...formFields, zip: e.target.value.replace(/\D/g, "").slice(0, 5) })}
                      placeholder="90210"
                      className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 focus:border-purple-500 focus:bg-white rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                </div>

                <div className="border-t border-zinc-100 my-6 pt-6"></div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Name on Card</label>
                  <input 
                    type="text" 
                    required
                    value={formFields.cardName}
                    onChange={(e) => setFormFields({ ...formFields, cardName: e.target.value })}
                    placeholder="John Doe"
                    className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 focus:border-purple-500 focus:bg-white rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Card Number</label>
                  <input 
                    type="text" 
                    required
                    value={formFields.cardNumber}
                    onChange={handleCardNumberInput}
                    placeholder="4111 2222 3333 4444"
                    className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 focus:border-purple-500 focus:bg-white rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Expiry Date</label>
                    <input 
                      type="text" 
                      required
                      value={formFields.cardExpiry}
                      onChange={handleCardExpiryInput}
                      placeholder="MM/YY"
                      className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 focus:border-purple-500 focus:bg-white rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">CVV</label>
                    <input 
                      type="password" 
                      required
                      maxLength={4}
                      value={formFields.cardCvv}
                      onChange={(e) => setFormFields({ ...formFields, cardCvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                      placeholder="***"
                      className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 focus:border-purple-500 focus:bg-white rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 disabled:from-purple-800 disabled:to-purple-900 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:scale-[1.01] shadow-lg flex items-center justify-center gap-3 mt-8"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      Processing Secured Payment...
                    </>
                  ) : (
                    <>
                      Confirm Pre-Order Now (${total.toFixed(2)})
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* 10. Purchase Success Confirmation Modal Overlay */}
      {orderComplete && (
        <div className="fixed inset-0 bg-[#070709]/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 rounded-3xl max-w-lg w-full p-8 md:p-10 text-center shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-emerald-50 border-4 border-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 stroke-[1.5]" />
            </div>

            <h2 className="font-heading text-3xl font-bold tracking-tight mb-2">Order Confirmed!</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Your secure payment has been processed. A confirmation receipt and product tooling milestone calendar have been emailed to <span className="font-semibold text-gray-900">{formFields.email || "your email"}</span>.
            </p>

            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 text-left mb-8 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Order Reference:</span>
                <strong className="text-gray-900 font-bold">{receiptRefNum}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">Est. Tooling Release:</span>
                <strong className="text-gray-900 font-bold">Late October 2026</strong>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200 text-base">
                <span className="text-gray-900 font-semibold">Charged Amount:</span>
                <strong className="text-purple-600 font-bold">${total.toFixed(2)}</strong>
              </div>
            </div>

            <button
              onClick={() => {
                setOrderComplete(false);
                setAddonCase(false);
                setAddonCable(false);
                setFormFields({
                  firstName: "",
                  lastName: "",
                  email: "",
                  address: "",
                  city: "",
                  state: "",
                  zip: "",
                  cardName: "",
                  cardNumber: "",
                  cardExpiry: "",
                  cardCvv: ""
                });
              }}
              className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all shadow-md"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}

      {/* 11. Footer Section */}
      <footer className="bg-gradient-to-b from-[#e2e2e8]/40 to-[#f5f5f7] border-t border-black/5 pt-20 pb-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-16">
            
            {/* Left Brand Col */}
            <div className="lg:col-span-5 space-y-6">
              <a href="#" className="font-heading text-2xl font-bold tracking-wider text-zinc-900">
                AURA<span className="font-light text-zinc-500">PRO</span>
              </a>
              <p className="text-sm text-zinc-600 leading-relaxed max-w-sm">
                Innovating at the precise intersections of acoustics, responsive materials science, and neuro-adaptive DSP architecture. Designed and distributed worldwide.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-white border border-zinc-200 hover:border-purple-600 hover:bg-purple-50/50 rounded-full flex items-center justify-center text-zinc-500 hover:text-purple-600 cursor-pointer transition-all shadow-sm">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-white border border-zinc-200 hover:border-purple-600 hover:bg-purple-50/50 rounded-full flex items-center justify-center text-zinc-500 hover:text-purple-600 cursor-pointer transition-all shadow-sm">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-white border border-zinc-200 hover:border-purple-600 hover:bg-purple-50/50 rounded-full flex items-center justify-center text-zinc-500 hover:text-purple-600 cursor-pointer transition-all shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Middle Nav Links */}
            <div className="grid grid-cols-2 gap-8 lg:col-span-4">
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Product</h4>
                <ul className="space-y-2 text-sm text-zinc-600">
                  <li><a href="#scroll-container" className="hover:text-purple-600 transition-colors">Visual Anatomy</a></li>
                  <li><a href="#features" className="hover:text-purple-600 transition-colors">Key Features</a></li>
                  <li><a href="#customizer" className="hover:text-purple-600 transition-colors">LED customizer</a></li>
                  <li><a href="#specs" className="hover:text-purple-600 transition-colors">Specifications</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Company</h4>
                <ul className="space-y-2 text-sm text-zinc-600">
                  <li><a href="#" className="hover:text-purple-600 transition-colors">Acoustic Research</a></li>
                  <li><a href="#" className="hover:text-purple-600 transition-colors">Manufacturing</a></li>
                  <li><a href="#" className="hover:text-purple-600 transition-colors">Developer Portal</a></li>
                  <li><a href="#" className="hover:text-purple-600 transition-colors">Get Support</a></li>
                </ul>
              </div>
            </div>

            {/* Right Newsletter Col */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Stay Updated</h4>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Receive engineering progress logs and advanced acoustic science bulletins.
              </p>
              
              {newsletterSubscribed ? (
                <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-xl flex items-center gap-2 shadow-sm">
                  <Check className="w-4 h-4" /> Subscribed successfully!
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2 bg-white border border-zinc-200 hover:border-zinc-300 p-1 rounded-xl transition-all shadow-sm">
                  <input 
                    type="email" 
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Engineering log email" 
                    className="bg-transparent border-none outline-none text-xs text-zinc-900 placeholder-zinc-400 px-3 py-2 flex-1 min-w-0"
                  />
                  <button 
                    type="submit" 
                    className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors flex items-center justify-center"
                    aria-label="Subscribe"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

          </div>

          <div className="border-t border-black/5 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
            <p>&copy; 2026 AURA Acoustics Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-zinc-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-zinc-600 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
