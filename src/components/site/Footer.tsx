import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import logo from "@/assets/phc-logo.png";

export function Footer() {
  return (
    <footer dir="rtl" className="mt-24 border-t border-border bg-gradient-soft">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <img src={logo} alt="PHC" width={48} height={48} className="h-12 w-12" />
            <div>
              <div className="text-xl font-extrabold text-gradient-brand">فارما كير</div>
              <div className="text-xs text-muted-foreground">Pharma Health Care</div>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
            شركة دوائية تجمع بين الخبرة العلمية والابتكار التكنولوجي لتقديم
            مستحضرات صيدلانية عالية الجودة تخدم صحة المجتمع.
          </p>
          <div className="mt-5 flex gap-3">
            {[Facebook, Instagram, Linkedin, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="social"
                className="grid h-10 w-10 place-items-center rounded-full border border-border text-primary transition-colors hover:bg-gradient-brand hover:text-primary-foreground hover:border-transparent"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-foreground">روابط سريعة</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary">من نحن</Link></li>
            <li><Link to="/products" className="hover:text-primary">المنتجات</Link></li>
            <li><Link to="/science" className="hover:text-primary">المركز العلمي</Link></li>
            <li><Link to="/careers" className="hover:text-primary">الوظائف</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-foreground">تواصل معنا</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone size={16} className="text-primary" /> +963 11 000 0000</li>
            <li className="flex items-center gap-2"><Mail size={16} className="text-primary" /> info@pharmacare.com</li>
            <li className="flex items-center gap-2"><MapPin size={16} className="text-primary" /> دمشق، سوريا</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Pharma Health Care. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
