import { motion } from "framer-motion";
import { ArrowRight, Package, Clock, ShieldCheck, MapPin } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full bg-slate-900 overflow-hidden min-h-[90vh] flex items-center">
        {/* Background gradient/glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/4 w-[1000px] h-[1000px] rounded-full bg-primary/20 blur-[120px] mix-blend-screen opacity-50"></div>
          <div className="absolute -bottom-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-blue-900/40 blur-[100px] mix-blend-screen opacity-50"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl text-white"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-medium text-slate-300">Logistique Tunisienne</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6">
              Livraison experte <br />
              <span className="text-primary">sans compromis.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-8 max-w-lg leading-relaxed">
              De Sfax à Tunis, nous connectons vos affaires avec rapidité, fiabilité et un service client qui fait la différence.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/transactions">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 h-14 text-base">
                  Suivre un colis
                </Button>
              </Link>
              <Link href="/#services">
                <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base border-slate-700 bg-transparent hover:bg-slate-800 text-white">
                  Nos services
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[400px] lg:h-[600px] flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" className="w-full h-auto drop-shadow-2xl">
              <defs>
                <linearGradient id="truckGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ea580c" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
                <linearGradient id="cabGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
              </defs>
              {/* Shadow */}
              <ellipse cx="400" cy="420" rx="350" ry="20" fill="rgba(0,0,0,0.5)" filter="blur(10px)"/>
              
              {/* Back Box */}
              <path d="M 50 150 L 550 150 L 550 380 L 50 380 Z" fill="url(#cabGrad)" rx="10" />
              <path d="M 60 160 L 540 160 L 540 370 L 60 370 Z" fill="#1e293b" />
              
              {/* Cab */}
              <path d="M 550 200 L 680 200 Q 720 200 740 240 L 760 300 L 760 380 L 550 380 Z" fill="url(#truckGrad)" />
              
              {/* Window */}
              <path d="M 570 220 L 660 220 Q 690 220 700 250 L 710 290 L 570 290 Z" fill="#cbd5e1" opacity="0.9" />
              <path d="M 580 230 L 650 230 Q 675 230 685 255 L 695 280 L 580 280 Z" fill="#94a3b8" />
              
              {/* Accents */}
              <rect x="560" y="320" width="180" height="20" fill="#ea580c" />
              <rect x="730" y="340" width="20" height="10" fill="#facc15" />
              
              {/* Wheels */}
              <g transform="translate(150, 380)">
                <circle cx="0" cy="0" r="45" fill="#020617" />
                <circle cx="0" cy="0" r="25" fill="#475569" />
                <circle cx="0" cy="0" r="10" fill="#1e293b" />
              </g>
              <g transform="translate(300, 380)">
                <circle cx="0" cy="0" r="45" fill="#020617" />
                <circle cx="0" cy="0" r="25" fill="#475569" />
                <circle cx="0" cy="0" r="10" fill="#1e293b" />
              </g>
              <g transform="translate(630, 380)">
                <circle cx="0" cy="0" r="45" fill="#020617" />
                <circle cx="0" cy="0" r="25" fill="#475569" />
                <circle cx="0" cy="0" r="10" fill="#1e293b" />
              </g>

              {/* Logo / Text on truck */}
              <text x="300" y="250" fill="#f97316" fontFamily="sans-serif" fontSize="60" fontWeight="900" textAnchor="middle" letterSpacing="2">HAMMAMI</text>
              <text x="300" y="290" fill="#cbd5e1" fontFamily="sans-serif" fontSize="24" fontWeight="600" textAnchor="middle" letterSpacing="4">TRANSPORT</text>
              <rect x="150" y="310" width="300" height="4" fill="#f97316" />
            </svg>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Nos Services</h2>
            <p className="text-lg text-slate-600">
              Des solutions sur mesure pour répondre à tous vos besoins d'expédition, avec la garantie Hammami.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Package,
                title: "Messagerie Rapide",
                desc: "Livraison de colis en 24/48h sur l'ensemble du territoire tunisien."
              },
              {
                icon: ShieldCheck,
                title: "Transport Sécurisé",
                desc: "Assurance intégrée et suivi rigoureux pour vos marchandises de valeur."
              },
              {
                icon: Clock,
                title: "Logistique Express",
                desc: "Solutions d'urgence pour vos besoins critiques avec des véhicules dédiés."
              }
            ].map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-xl hover:border-primary/20 transition-all group"
              >
                <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <service.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-600 mb-6">
                  {service.desc}
                </p>
                <Link href="/contact" className="inline-flex items-center text-primary font-medium hover:text-primary/80">
                  En savoir plus <ArrowRight size={16} className="ml-2" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About & Map Section */}
      <section id="about" className="py-24 bg-slate-50 border-t">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                L'infrastructure qu'il vous faut.
              </h2>
              <div className="space-y-6 text-lg text-slate-600">
                <p>
                  Hammami Transport est né d'une vision simple: rendre la logistique en Tunisie transparente, fiable et professionnelle.
                </p>
                <p>
                  Avec une flotte moderne de camions oranges sillonnant le pays tous les jours, nous sommes fiers de soutenir l'économie locale en connectant les entreprises de Sfax, Tunis, Sousse, et au-delà.
                </p>
                <ul className="space-y-4 pt-4">
                  {[
                    "Flotte moderne et régulièrement entretenue",
                    "Système de suivi en temps réel",
                    "Équipe dédiée et formée aux standards internationaux",
                    "Couverture nationale complète"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <ShieldCheck size={14} />
                      </div>
                      <span className="font-medium text-slate-800">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl transform rotate-3 scale-105 -z-10"></div>
              <div className="bg-white p-2 rounded-3xl shadow-xl overflow-hidden relative">
                {/* Decorative Map using SVG */}
                <div className="aspect-square bg-slate-100 rounded-2xl relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                  <svg viewBox="0 0 400 600" className="w-full h-full p-8 drop-shadow-md">
                    <path d="M200,50 L250,80 L280,150 L300,200 L320,280 L300,350 L310,400 L280,480 L250,550 L200,580 L150,520 L120,450 L100,380 L80,300 L110,220 L130,150 L160,80 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
                    {/* Routes */}
                    <path d="M200,200 L250,350 L200,450" fill="none" stroke="#f97316" strokeWidth="3" strokeDasharray="6,6" />
                    
                    {/* Tunis */}
                    <circle cx="200" cy="150" r="8" fill="#0f172a" />
                    <text x="215" y="155" fontSize="16" fontWeight="bold" fill="#0f172a">Tunis</text>
                    
                    {/* Sousse */}
                    <circle cx="230" cy="250" r="6" fill="#64748b" />
                    
                    {/* Sfax - Hub */}
                    <g transform="translate(250, 350)">
                      <circle cx="0" cy="0" r="16" fill="#f97316" className="animate-pulse" opacity="0.3" />
                      <circle cx="0" cy="0" r="8" fill="#f97316" />
                      <path d="M0,-20 L-10,-40 L10,-40 Z" fill="#f97316" />
                      <text x="20" y="5" fontSize="18" fontWeight="bold" fill="#f97316">Sfax (Hub)</text>
                    </g>
                    
                    {/* Gabes */}
                    <circle cx="200" cy="450" r="6" fill="#64748b" />
                  </svg>
                  
                  <div className="absolute bottom-6 right-6 bg-white p-4 rounded-xl shadow-lg border border-slate-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Agence Centrale</h4>
                      <p className="text-sm text-slate-500">Sfax, Tunisie</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
