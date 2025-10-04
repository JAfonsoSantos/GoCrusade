import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavMenuItem {
  label: string;
  href: string;
  icon?: ReactNode;
}

interface NavMenuProps {
  title: string;
  href: string;
  items: NavMenuItem[];
}

export function NavMenu({ title, href, items }: NavMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = location.pathname.startsWith(href);
  
  let hoverTimeout: NodeJS.Timeout;
  
  const handleMouseEnter = () => {
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => setIsOpen(true), 150);
  };
  
  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => setIsOpen(false), 200);
  };
  
  const handleTitleClick = () => {
    navigate(href);
    setIsOpen(false);
  };
  
  const handleItemClick = (itemHref: string) => {
    navigate(itemHref);
    setIsOpen(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={handleTitleClick}
        className={cn(
          "flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors rounded-md",
          isActive
            ? "text-foreground bg-muted"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {title}
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1 min-w-[200px] rounded-md border bg-popover shadow-lg z-50"
          >
            <div className="p-1">
              {items.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleItemClick(item.href)}
                  className={cn(
                    "flex items-center gap-2 w-full px-3 py-2 text-sm rounded-sm transition-colors text-left",
                    location.pathname === item.href
                      ? "bg-muted text-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
