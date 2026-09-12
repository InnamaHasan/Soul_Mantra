import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookHeart, 
  SmilePlus, 
  Camera, 
  Mic, 
  ClipboardList, 
  Activity, 
  MessageSquare,
  LineChart,
  Settings,
  HelpCircle,
  Menu,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: BookHeart, label: 'Journal', path: '/journal' },
  { icon: SmilePlus, label: 'Mood Check-in', path: '/mood' },
  { icon: Camera, label: 'Face Reflection', path: '/face' },
  { icon: Mic, label: 'Voice Reflection', path: '/voice' },
  { icon: ClipboardList, label: 'Assessments', path: '/assessments' },
  { icon: Activity, label: 'Health Tracker', path: '/health' },
  { icon: MessageSquare, label: 'Dawn Companion', path: '/chat' },
  { icon: LineChart, label: 'Insights', path: '/insights' },
];

const bottomNavItems = [
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: HelpCircle, label: 'Help', path: '/help' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card border-r">
      <div className="h-16 flex items-center px-4 border-b shrink-0 justify-between">
        {(!collapsed || isMobile) && (
          <span className="font-semibold text-lg text-primary truncate">SoulMantra</span>
        )}
        {!isMobile && (
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="ml-auto">
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => isMobile && setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  collapsed && !isMobile ? "justify-center" : "justify-start"
                )
              }
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={cn("h-5 w-5", (!collapsed || isMobile) && "mr-3")} />
              {(!collapsed || isMobile) && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </ScrollArea>

      <div className="mt-auto p-4 border-t space-y-1">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => isMobile && setMobileOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                collapsed && !isMobile ? "justify-center" : "justify-start"
              )
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon className={cn("h-5 w-5", (!collapsed || isMobile) && "mr-3")} />
            {(!collapsed || isMobile) && <span>{item.label}</span>}
          </NavLink>
        ))}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <Button 
          variant="ghost" 
          size="icon" 
          className="fixed top-3 left-3 z-50 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {mobileOpen && (
          <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" onClick={() => setMobileOpen(false)} />
        )}
        
        <div className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <SidebarContent />
        </div>
      </>
    );
  }

  return (
    <div className={cn(
      "hidden md:block h-screen transition-all duration-300 ease-in-out",
      collapsed ? "w-16" : "w-64"
    )}>
      <SidebarContent />
    </div>
  );
}
