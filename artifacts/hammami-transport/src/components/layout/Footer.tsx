import { MapPin, Phone, Mail, Facebook, Instagram, Activity } from "lucide-react";
import { Link } from "wouter";
import { FaWhatsapp } from "react-icons/fa";
import { useHealthCheck } from "@workspace/api-client-react";

export function Footer() {
  const { data: health } = useHealthCheck({}, { query: { refetchInterval: 30000 } });

  return (
    <footer id="contact" className="bg-slate-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-primary p-2 rounded-lg text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/><path d="M14 17h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
              </div>
              <span className="font-bold text-xl tracking-tight">
                Hammami<span className="text-primary">Transport</span>
              </span>
            </div>
            <p className="text-slate-400 mb-6 max-w-sm">
              La solution logistique de confiance en Tunisie. Livraison rapide, sécurisée et professionnelle sur tout le territoire.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-primary hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-primary hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-primary hover:text-white transition-colors">
                <FaWhatsapp size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-6">Liens Rapides</h3>
            <ul className="flex flex-col gap-3 text-slate-400">
              <li><Link href="/" className="hover:text-primary transition-colors">Accueil</Link></li>
              <li><Link href="/#services" className="hover:text-primary transition-colors">Services</Link></li>
              <li><Link href="/#about" className="hover:text-primary transition-colors">À propos</Link></li>
              <li><Link href="/admin" className="hover:text-primary transition-colors">Tableau de bord</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6">Contactez-nous</h3>
            <ul className="flex flex-col gap-4 text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="text-primary shrink-0 mt-1" size={20} />
                <span>Zone Industrielle, Sfax<br />Tunisie 3000</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-primary shrink-0" size={20} />
                <span>+216 74 123 456</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-primary shrink-0" size={20} />
                <span>contact@hammami-transport.tn</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Hammami Transport. Tous droits réservés.</p>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Activity size={14} className={health?.status === "ok" ? "text-green-500" : "text-red-500"} />
            <span>Système: {health?.status === "ok" ? "En ligne" : "Hors ligne"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
