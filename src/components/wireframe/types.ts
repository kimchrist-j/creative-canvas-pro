export type ElementType =
  // Basic
  | 'rect' | 'circle' | 'text' | 'line' | 'image'
  // Web Components
  | 'button' | 'input' | 'card' | 'navbar' | 'sidebar' | 'hero' | 'list' | 'avatar' | 'modal'
  | 'footer' | 'form' | 'table' | 'tabs' | 'dropdown' | 'checkbox' | 'radio' | 'toggle'
  | 'progress' | 'badge' | 'breadcrumb' | 'pricing-card' | 'testimonial' | 'feature-grid'
  | 'cta-section' | 'contact-form' | 'login-form' | 'signup-form' | 'search-bar' | 'carousel'
  | 'accordion' | 'alert' | 'tooltip-el' | 'divider' | 'video-player' | 'map-embed'
  | 'social-links' | 'stats-section' | 'team-section' | 'faq-section'
  // Mobile Components
  | 'mobile-status-bar' | 'mobile-tab-bar' | 'mobile-app-bar' | 'mobile-fab'
  | 'mobile-list-item' | 'mobile-switch' | 'mobile-chip' | 'mobile-bottom-sheet'
  | 'mobile-card' | 'mobile-search' | 'mobile-drawer' | 'mobile-snackbar';

export interface WireframeElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
  fillColor: string;
  strokeColor: string;
  borderRadius: number;
  opacity: number;
  locked: boolean;
  fontSize?: number;
}

export type DeviceFrame = 'none' | 'iphone-15' | 'iphone-se' | 'android' | 'ipad' | 'desktop-browser';

export type Framework = 'react' | 'react-native' | 'html';

export const DEVICE_FRAMES: Record<DeviceFrame, { width: number; height: number; label: string }> = {
  'none': { width: 1440, height: 900, label: 'Freeform Canvas' },
  'iphone-15': { width: 393, height: 852, label: 'iPhone 15' },
  'iphone-se': { width: 375, height: 667, label: 'iPhone SE' },
  'android': { width: 412, height: 915, label: 'Android (Pixel)' },
  'ipad': { width: 820, height: 1180, label: 'iPad' },
  'desktop-browser': { width: 1440, height: 900, label: 'Desktop Browser' },
};

export const ELEMENT_DEFAULTS: Record<string, Partial<WireframeElement>> = {
  // Basic
  rect: { width: 160, height: 100, fillColor: '#e2e8f0', strokeColor: '#94a3b8', borderRadius: 8 },
  circle: { width: 80, height: 80, fillColor: '#e2e8f0', strokeColor: '#94a3b8', borderRadius: 999 },
  text: { width: 200, height: 40, fillColor: 'transparent', strokeColor: 'transparent', borderRadius: 0, text: 'Text here', fontSize: 16 },
  line: { width: 200, height: 2, fillColor: '#94a3b8', strokeColor: 'transparent', borderRadius: 0 },
  image: { width: 200, height: 160, fillColor: '#f1f5f9', strokeColor: '#cbd5e1', borderRadius: 8 },
  // Web Components
  button: { width: 140, height: 44, fillColor: '#3b82f6', strokeColor: 'transparent', borderRadius: 8, text: 'Button', fontSize: 14 },
  input: { width: 240, height: 44, fillColor: '#ffffff', strokeColor: '#cbd5e1', borderRadius: 8, text: 'Input field...', fontSize: 14 },
  card: { width: 300, height: 200, fillColor: '#ffffff', strokeColor: '#e2e8f0', borderRadius: 12 },
  navbar: { width: 1440, height: 64, fillColor: '#ffffff', strokeColor: '#e2e8f0', borderRadius: 0, text: 'Navigation Bar' },
  sidebar: { width: 260, height: 600, fillColor: '#f8fafc', strokeColor: '#e2e8f0', borderRadius: 0, text: 'Sidebar' },
  hero: { width: 1200, height: 400, fillColor: '#eff6ff', strokeColor: '#bfdbfe', borderRadius: 16, text: 'Hero Section' },
  list: { width: 300, height: 240, fillColor: '#ffffff', strokeColor: '#e2e8f0', borderRadius: 8 },
  avatar: { width: 48, height: 48, fillColor: '#e2e8f0', strokeColor: '#94a3b8', borderRadius: 999 },
  modal: { width: 480, height: 320, fillColor: '#ffffff', strokeColor: '#e2e8f0', borderRadius: 16, text: 'Modal Dialog' },
  footer: { width: 1440, height: 200, fillColor: '#1e293b', strokeColor: '#334155', borderRadius: 0, text: 'Footer' },
  form: { width: 400, height: 350, fillColor: '#ffffff', strokeColor: '#e2e8f0', borderRadius: 12, text: 'Form' },
  table: { width: 600, height: 300, fillColor: '#ffffff', strokeColor: '#e2e8f0', borderRadius: 8 },
  tabs: { width: 500, height: 44, fillColor: '#f1f5f9', strokeColor: '#e2e8f0', borderRadius: 8 },
  dropdown: { width: 200, height: 44, fillColor: '#ffffff', strokeColor: '#cbd5e1', borderRadius: 8, text: 'Select option...' },
  checkbox: { width: 24, height: 24, fillColor: '#ffffff', strokeColor: '#94a3b8', borderRadius: 4 },
  radio: { width: 24, height: 24, fillColor: '#ffffff', strokeColor: '#94a3b8', borderRadius: 999 },
  toggle: { width: 48, height: 28, fillColor: '#3b82f6', strokeColor: 'transparent', borderRadius: 999 },
  progress: { width: 300, height: 8, fillColor: '#e2e8f0', strokeColor: 'transparent', borderRadius: 999 },
  badge: { width: 80, height: 28, fillColor: '#dbeafe', strokeColor: 'transparent', borderRadius: 999, text: 'Badge', fontSize: 12 },
  breadcrumb: { width: 400, height: 32, fillColor: 'transparent', strokeColor: 'transparent', borderRadius: 0, text: 'Home / Products / Details' },
  'pricing-card': { width: 320, height: 440, fillColor: '#ffffff', strokeColor: '#e2e8f0', borderRadius: 16 },
  testimonial: { width: 350, height: 200, fillColor: '#ffffff', strokeColor: '#e2e8f0', borderRadius: 12 },
  'feature-grid': { width: 900, height: 300, fillColor: '#ffffff', strokeColor: '#e2e8f0', borderRadius: 12 },
  'cta-section': { width: 1000, height: 250, fillColor: '#1e40af', strokeColor: 'transparent', borderRadius: 16, text: 'Call to Action' },
  'contact-form': { width: 500, height: 450, fillColor: '#ffffff', strokeColor: '#e2e8f0', borderRadius: 12, text: 'Contact Us' },
  'login-form': { width: 400, height: 400, fillColor: '#ffffff', strokeColor: '#e2e8f0', borderRadius: 16, text: 'Login' },
  'signup-form': { width: 400, height: 500, fillColor: '#ffffff', strokeColor: '#e2e8f0', borderRadius: 16, text: 'Sign Up' },
  'search-bar': { width: 400, height: 48, fillColor: '#ffffff', strokeColor: '#cbd5e1', borderRadius: 999, text: 'Search...' },
  carousel: { width: 800, height: 400, fillColor: '#f8fafc', strokeColor: '#e2e8f0', borderRadius: 12 },
  accordion: { width: 400, height: 200, fillColor: '#ffffff', strokeColor: '#e2e8f0', borderRadius: 8 },
  alert: { width: 400, height: 64, fillColor: '#fef3c7', strokeColor: '#fbbf24', borderRadius: 8, text: 'This is an alert message' },
  'tooltip-el': { width: 200, height: 40, fillColor: '#1e293b', strokeColor: 'transparent', borderRadius: 6, text: 'Tooltip text', fontSize: 12 },
  divider: { width: 600, height: 1, fillColor: '#e2e8f0', strokeColor: 'transparent', borderRadius: 0 },
  'video-player': { width: 640, height: 360, fillColor: '#0f172a', strokeColor: '#334155', borderRadius: 12 },
  'map-embed': { width: 500, height: 300, fillColor: '#d4e6d4', strokeColor: '#94a3b8', borderRadius: 12 },
  'social-links': { width: 200, height: 48, fillColor: 'transparent', strokeColor: 'transparent', borderRadius: 0 },
  'stats-section': { width: 900, height: 150, fillColor: '#ffffff', strokeColor: '#e2e8f0', borderRadius: 12 },
  'team-section': { width: 900, height: 300, fillColor: '#ffffff', strokeColor: '#e2e8f0', borderRadius: 12 },
  'faq-section': { width: 700, height: 400, fillColor: '#ffffff', strokeColor: '#e2e8f0', borderRadius: 12 },
  // Mobile Components
  'mobile-status-bar': { width: 393, height: 54, fillColor: '#ffffff', strokeColor: 'transparent', borderRadius: 0 },
  'mobile-tab-bar': { width: 393, height: 84, fillColor: '#ffffff', strokeColor: '#e2e8f0', borderRadius: 0 },
  'mobile-app-bar': { width: 393, height: 56, fillColor: '#ffffff', strokeColor: '#e2e8f0', borderRadius: 0, text: 'App Title' },
  'mobile-fab': { width: 56, height: 56, fillColor: '#3b82f6', strokeColor: 'transparent', borderRadius: 999, text: '+' },
  'mobile-list-item': { width: 393, height: 72, fillColor: '#ffffff', strokeColor: '#f1f5f9', borderRadius: 0, text: 'List Item' },
  'mobile-switch': { width: 52, height: 32, fillColor: '#3b82f6', strokeColor: 'transparent', borderRadius: 999 },
  'mobile-chip': { width: 100, height: 36, fillColor: '#eff6ff', strokeColor: '#3b82f6', borderRadius: 999, text: 'Chip', fontSize: 13 },
  'mobile-bottom-sheet': { width: 393, height: 300, fillColor: '#ffffff', strokeColor: '#e2e8f0', borderRadius: 24 },
  'mobile-card': { width: 360, height: 200, fillColor: '#ffffff', strokeColor: '#e2e8f0', borderRadius: 16 },
  'mobile-search': { width: 360, height: 48, fillColor: '#f1f5f9', strokeColor: 'transparent', borderRadius: 12, text: 'Search...' },
  'mobile-drawer': { width: 300, height: 852, fillColor: '#ffffff', strokeColor: '#e2e8f0', borderRadius: 0, text: 'Drawer Menu' },
  'mobile-snackbar': { width: 360, height: 48, fillColor: '#323232', strokeColor: 'transparent', borderRadius: 8, text: 'Action completed', fontSize: 14 },
};
