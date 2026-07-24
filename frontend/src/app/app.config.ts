import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { 
  LucideAngularModule,
  Droplets, 
  LayoutDashboard, 
  Building2, 
  ReceiptText, 
  User, 
  LogOut, 
  Sun, 
  Moon, 
  Bell, 
  Menu, 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  ShieldCheck, 
  Search, 
  ChevronDown, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Check, 
  Wallet, 
  Activity, 
  History, 
  Calendar, 
  Plus, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  Layers, 
  Monitor, 
  Globe, 
  ExternalLink, 
  Calculator, 
  Bolt, 
  IndianRupee, 
  CheckCheck,
  X,
  Info,
  Mail,
  Cpu,
  Lock,
  MapPin,
  Eye,
  EyeOff,
  LogIn,
  Edit2,
  Trash2,
  UserPlus,
  CreditCard,
  ArrowRight,
  Construction
} from 'lucide-angular';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    provideCharts(withDefaultRegisterables()),
    importProvidersFrom(LucideAngularModule.pick({ 
      Droplets, LayoutDashboard, Building2, ReceiptText, User, LogOut, Sun, Moon, Bell, Menu, 
      ChevronLeft, ChevronRight, Settings, ShieldCheck, Search, ChevronDown, CheckCircle, 
      Clock, AlertCircle, Check, Wallet, Activity, History, Calendar, Plus, Zap, 
      TrendingUp, TrendingDown, ArrowUpRight, Layers, Monitor, Globe, ExternalLink, 
      Calculator, Bolt, IndianRupee, CheckCheck, X,
      Info, Mail, Cpu, Lock, MapPin, Eye, EyeOff, LogIn, Edit2, Trash2, 
      UserPlus, CreditCard, ArrowRight, Construction
    }))
  ]
};
