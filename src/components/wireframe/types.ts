export interface WireframeElement {
  id: string;
  type: 'rect' | 'circle' | 'text' | 'line' | 'image' | 'button' | 'input' | 'card' | 'navbar' | 'sidebar' | 'hero' | 'list' | 'avatar' | 'modal';
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

export const ELEMENT_DEFAULTS: Record<string, Partial<WireframeElement>> = {
  rect: { width: 160, height: 100, fillColor: '#e2e8f0', strokeColor: '#94a3b8', borderRadius: 8 },
  circle: { width: 80, height: 80, fillColor: '#e2e8f0', strokeColor: '#94a3b8', borderRadius: 999 },
  text: { width: 200, height: 40, fillColor: 'transparent', strokeColor: 'transparent', borderRadius: 0, text: 'Text here', fontSize: 16 },
  line: { width: 200, height: 2, fillColor: '#94a3b8', strokeColor: 'transparent', borderRadius: 0 },
  image: { width: 200, height: 160, fillColor: '#f1f5f9', strokeColor: '#cbd5e1', borderRadius: 8 },
  button: { width: 140, height: 44, fillColor: '#3b82f6', strokeColor: 'transparent', borderRadius: 8, text: 'Button', fontSize: 14 },
  input: { width: 240, height: 44, fillColor: '#ffffff', strokeColor: '#cbd5e1', borderRadius: 8, text: 'Input field...', fontSize: 14 },
  card: { width: 300, height: 200, fillColor: '#ffffff', strokeColor: '#e2e8f0', borderRadius: 12 },
  navbar: { width: 1440, height: 64, fillColor: '#ffffff', strokeColor: '#e2e8f0', borderRadius: 0, text: 'Navigation Bar' },
  sidebar: { width: 260, height: 600, fillColor: '#f8fafc', strokeColor: '#e2e8f0', borderRadius: 0, text: 'Sidebar' },
  hero: { width: 1200, height: 400, fillColor: '#eff6ff', strokeColor: '#bfdbfe', borderRadius: 16, text: 'Hero Section' },
  list: { width: 300, height: 240, fillColor: '#ffffff', strokeColor: '#e2e8f0', borderRadius: 8 },
  avatar: { width: 48, height: 48, fillColor: '#e2e8f0', strokeColor: '#94a3b8', borderRadius: 999 },
  modal: { width: 480, height: 320, fillColor: '#ffffff', strokeColor: '#e2e8f0', borderRadius: 16, text: 'Modal Dialog' },
};
