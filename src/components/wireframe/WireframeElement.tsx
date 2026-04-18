import { WireframeElement } from './types';
import { Image, User, Play, MapPin, ChevronDown, ChevronRight, AlertTriangle, Search, Menu, MoreVertical, ArrowLeft, Home, X } from 'lucide-react';

interface Props {
  element: WireframeElement;
  selected: boolean;
  onUpdate: (el: WireframeElement) => void;
}

export default function WireframeElementComponent({ element: el, selected, onUpdate }: Props) {
  const handleSize = 8;

  const renderContent = () => {
    switch (el.type) {
      case 'text':
        return (
          <div contentEditable suppressContentEditableWarning className="w-full h-full flex items-center outline-none" style={{ fontSize: el.fontSize || 16, color: '#1e293b' }} onBlur={e => onUpdate({ ...el, text: e.currentTarget.textContent || '' })}>
            {el.text}
          </div>
        );
      case 'line':
        return <div className="w-full" style={{ height: 2, backgroundColor: el.fillColor, marginTop: el.height / 2 - 1 }} />;
      case 'divider':
        return <div className="w-full" style={{ height: 1, backgroundColor: el.fillColor }} />;
      case 'image':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{ borderRadius: el.borderRadius, backgroundColor: el.fillColor, border: `1px dashed ${el.strokeColor}` }}>
            <Image className="h-8 w-8" style={{ color: '#94a3b8' }} />
            <span className="text-xs" style={{ color: '#94a3b8' }}>Image</span>
          </div>
        );
      case 'button':
        return (
          <div className="w-full h-full flex items-center justify-center text-white font-medium" style={{ backgroundColor: el.fillColor, borderRadius: el.borderRadius, fontSize: el.fontSize || 14 }}>
            {el.text || 'Button'}
          </div>
        );
      case 'input':
        return (
          <div className="w-full h-full flex items-center px-3" style={{ backgroundColor: el.fillColor, border: `1px solid ${el.strokeColor}`, borderRadius: el.borderRadius }}>
            <span className="text-sm" style={{ color: '#94a3b8', fontSize: el.fontSize || 14 }}>{el.text || 'Input...'}</span>
          </div>
        );
      case 'card':
        return (
          <div className="w-full h-full p-4 flex flex-col gap-3" style={{ backgroundColor: el.fillColor, border: `1px solid ${el.strokeColor}`, borderRadius: el.borderRadius }}>
            <div className="h-3 w-2/3 rounded" style={{ backgroundColor: '#e2e8f0' }} />
            <div className="h-2 w-full rounded" style={{ backgroundColor: '#f1f5f9' }} />
            <div className="h-2 w-5/6 rounded" style={{ backgroundColor: '#f1f5f9' }} />
            <div className="flex-1 rounded" style={{ backgroundColor: '#f8fafc' }} />
          </div>
        );
      case 'navbar':
        return (
          <div className="w-full h-full flex items-center justify-between px-6" style={{ backgroundColor: el.fillColor, borderBottom: `1px solid ${el.strokeColor}` }}>
            <div className="h-6 w-24 rounded" style={{ backgroundColor: '#e2e8f0' }} />
            <div className="flex gap-6">
              {['Home', 'About', 'Contact'].map((t, i) => (
                <span key={i} className="text-xs font-medium" style={{ color: '#64748b' }}>{t}</span>
              ))}
            </div>
            <div className="h-8 w-20 rounded-md flex items-center justify-center text-xs text-white" style={{ backgroundColor: '#3b82f6' }}>Sign In</div>
          </div>
        );
      case 'sidebar':
        return (
          <div className="w-full h-full p-4 flex flex-col gap-2" style={{ backgroundColor: el.fillColor, borderRight: `1px solid ${el.strokeColor}` }}>
            <div className="h-8 w-full rounded flex items-center px-3 text-xs font-medium" style={{ backgroundColor: '#e2e8f0', color: '#475569' }}>Dashboard</div>
            {['Analytics', 'Projects', 'Settings', 'Users'].map((t, i) => (
              <div key={i} className="h-8 w-full rounded flex items-center px-3 text-xs" style={{ color: '#94a3b8' }}>{t}</div>
            ))}
          </div>
        );
      case 'hero':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8" style={{ backgroundColor: el.fillColor, border: `1px solid ${el.strokeColor}`, borderRadius: el.borderRadius }}>
            <div className="h-6 w-80 rounded" style={{ backgroundColor: '#bfdbfe' }} />
            <div className="h-3 w-96 rounded" style={{ backgroundColor: '#dbeafe' }} />
            <div className="h-3 w-72 rounded" style={{ backgroundColor: '#dbeafe' }} />
            <div className="h-10 w-32 rounded-lg mt-2 flex items-center justify-center text-xs text-white" style={{ backgroundColor: '#3b82f6' }}>Get Started</div>
          </div>
        );
      case 'list':
        return (
          <div className="w-full h-full p-3 flex flex-col gap-2" style={{ backgroundColor: el.fillColor, border: `1px solid ${el.strokeColor}`, borderRadius: el.borderRadius }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-3 p-2 rounded" style={{ backgroundColor: '#f8fafc' }}>
                <div className="h-6 w-6 rounded-full" style={{ backgroundColor: '#e2e8f0' }} />
                <div className="flex-1">
                  <div className="h-2 w-3/4 rounded mb-1" style={{ backgroundColor: '#e2e8f0' }} />
                  <div className="h-1.5 w-1/2 rounded" style={{ backgroundColor: '#f1f5f9' }} />
                </div>
              </div>
            ))}
          </div>
        );
      case 'avatar':
        return (
          <div className="w-full h-full rounded-full flex items-center justify-center" style={{ backgroundColor: el.fillColor, border: `2px solid ${el.strokeColor}` }}>
            <User className="w-1/2 h-1/2" style={{ color: '#94a3b8' }} />
          </div>
        );
      case 'modal':
        return (
          <div className="w-full h-full flex flex-col" style={{ backgroundColor: el.fillColor, border: `1px solid ${el.strokeColor}`, borderRadius: el.borderRadius, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: el.strokeColor }}>
              <span className="text-sm font-semibold" style={{ color: '#1e293b' }}>{el.text || 'Modal'}</span>
              <span className="text-lg cursor-pointer" style={{ color: '#94a3b8' }}>×</span>
            </div>
            <div className="flex-1 p-5">
              <div className="h-3 w-full rounded mb-3" style={{ backgroundColor: '#f1f5f9' }} />
              <div className="h-3 w-4/5 rounded mb-3" style={{ backgroundColor: '#f1f5f9' }} />
              <div className="h-3 w-3/5 rounded" style={{ backgroundColor: '#f1f5f9' }} />
            </div>
            <div className="flex justify-end gap-2 px-5 py-3 border-t" style={{ borderColor: el.strokeColor }}>
              <div className="h-8 w-16 rounded flex items-center justify-center text-xs" style={{ border: '1px solid #e2e8f0', color: '#64748b' }}>Cancel</div>
              <div className="h-8 w-16 rounded flex items-center justify-center text-xs text-white" style={{ backgroundColor: '#3b82f6' }}>Save</div>
            </div>
          </div>
        );
      case 'footer':
        return (
          <div className="w-full h-full flex items-center justify-between px-8" style={{ backgroundColor: el.fillColor, borderTop: `1px solid ${el.strokeColor}` }}>
            <div className="flex flex-col gap-2">
              <div className="h-4 w-20 rounded" style={{ backgroundColor: '#475569' }} />
              <div className="flex gap-4">{['About', 'Blog', 'Careers', 'Privacy'].map((t, i) => <span key={i} className="text-[10px]" style={{ color: '#94a3b8' }}>{t}</span>)}</div>
            </div>
            <div className="flex gap-3">{[1, 2, 3, 4].map(i => <div key={i} className="h-6 w-6 rounded-full" style={{ backgroundColor: '#475569' }} />)}</div>
          </div>
        );
      case 'form':
        return (
          <div className="w-full h-full p-5 flex flex-col gap-3" style={{ backgroundColor: el.fillColor, border: `1px solid ${el.strokeColor}`, borderRadius: el.borderRadius }}>
            <div className="text-sm font-semibold" style={{ color: '#1e293b' }}>{el.text || 'Form'}</div>
            {['Name', 'Email'].map((l, i) => (
              <div key={i} className="flex flex-col gap-1">
                <span className="text-[10px] font-medium" style={{ color: '#64748b' }}>{l}</span>
                <div className="h-9 rounded border px-2 flex items-center text-xs" style={{ borderColor: '#e2e8f0', color: '#94a3b8' }}>Enter {l.toLowerCase()}...</div>
              </div>
            ))}
            <div className="h-9 rounded flex items-center justify-center text-xs text-white mt-1" style={{ backgroundColor: '#3b82f6' }}>Submit</div>
          </div>
        );
      case 'table':
        return (
          <div className="w-full h-full" style={{ backgroundColor: el.fillColor, border: `1px solid ${el.strokeColor}`, borderRadius: el.borderRadius, overflow: 'hidden' }}>
            <div className="flex h-8 items-center border-b" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}>
              {['Name', 'Email', 'Role', 'Status'].map((h, i) => <div key={i} className="flex-1 px-3 text-[10px] font-semibold" style={{ color: '#475569' }}>{h}</div>)}
            </div>
            {[1, 2, 3, 4].map(r => (
              <div key={r} className="flex h-10 items-center border-b" style={{ borderColor: '#f1f5f9' }}>
                {[1, 2, 3, 4].map(c => <div key={c} className="flex-1 px-3"><div className="h-2 rounded" style={{ backgroundColor: '#f1f5f9', width: `${50 + c * 10}%` }} /></div>)}
              </div>
            ))}
          </div>
        );
      case 'tabs':
        return (
          <div className="w-full h-full flex items-center gap-1 px-2" style={{ backgroundColor: el.fillColor, borderRadius: el.borderRadius }}>
            {['Tab 1', 'Tab 2', 'Tab 3'].map((t, i) => (
              <div key={i} className="h-8 px-4 rounded-md flex items-center justify-center text-xs font-medium" style={{ backgroundColor: i === 0 ? '#ffffff' : 'transparent', color: i === 0 ? '#1e293b' : '#94a3b8', boxShadow: i === 0 ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>{t}</div>
            ))}
          </div>
        );
      case 'dropdown':
        return (
          <div className="w-full h-full flex items-center justify-between px-3" style={{ backgroundColor: el.fillColor, border: `1px solid ${el.strokeColor}`, borderRadius: el.borderRadius }}>
            <span className="text-sm" style={{ color: '#94a3b8' }}>{el.text || 'Select...'}</span>
            <ChevronDown className="h-4 w-4" style={{ color: '#94a3b8' }} />
          </div>
        );
      case 'checkbox':
        return <div className="w-full h-full rounded" style={{ backgroundColor: '#3b82f6', border: `2px solid #3b82f6`, borderRadius: el.borderRadius }}>
          <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
        </div>;
      case 'radio':
        return <div className="w-full h-full rounded-full flex items-center justify-center" style={{ border: `2px solid #3b82f6` }}>
          <div className="w-1/2 h-1/2 rounded-full" style={{ backgroundColor: '#3b82f6' }} />
        </div>;
      case 'toggle':
        return (
          <div className="w-full h-full rounded-full flex items-center px-1" style={{ backgroundColor: el.fillColor }}>
            <div className="rounded-full bg-white" style={{ width: el.height - 8, height: el.height - 8, marginLeft: 'auto' }} />
          </div>
        );
      case 'progress':
        return (
          <div className="w-full h-full rounded-full overflow-hidden" style={{ backgroundColor: el.fillColor }}>
            <div className="h-full rounded-full" style={{ backgroundColor: '#3b82f6', width: '65%' }} />
          </div>
        );
      case 'badge':
        return (
          <div className="w-full h-full flex items-center justify-center rounded-full" style={{ backgroundColor: el.fillColor, fontSize: el.fontSize || 12, color: '#3b82f6', fontWeight: 600 }}>
            {el.text || 'Badge'}
          </div>
        );
      case 'breadcrumb':
        return (
          <div className="w-full h-full flex items-center gap-1 text-xs" style={{ color: '#94a3b8' }}>
            {(el.text || 'Home / Page').split(' / ').map((p, i, arr) => (
              <span key={i} className="flex items-center gap-1">
                <span style={{ color: i === arr.length - 1 ? '#1e293b' : '#3b82f6', fontWeight: i === arr.length - 1 ? 600 : 400 }}>{p}</span>
                {i < arr.length - 1 && <ChevronRight className="h-3 w-3" />}
              </span>
            ))}
          </div>
        );
      case 'pricing-card':
        return (
          <div className="w-full h-full p-6 flex flex-col items-center" style={{ backgroundColor: el.fillColor, border: `1px solid ${el.strokeColor}`, borderRadius: el.borderRadius }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#3b82f6' }}>Pro Plan</div>
            <div className="text-2xl font-bold mb-1" style={{ color: '#1e293b' }}>$29<span className="text-sm font-normal" style={{ color: '#94a3b8' }}>/mo</span></div>
            <div className="w-full border-t my-3" style={{ borderColor: '#e2e8f0' }} />
            {['10 Projects', 'Unlimited Storage', 'Priority Support', 'Custom Domain'].map((f, i) => (
              <div key={i} className="flex items-center gap-2 w-full py-1.5 text-xs" style={{ color: '#475569' }}>
                <div className="h-4 w-4 rounded-full flex items-center justify-center text-white text-[8px]" style={{ backgroundColor: '#3b82f6' }}>✓</div>
                {f}
              </div>
            ))}
            <div className="mt-auto w-full h-10 rounded-lg flex items-center justify-center text-sm text-white font-medium mt-4" style={{ backgroundColor: '#3b82f6' }}>Subscribe</div>
          </div>
        );
      case 'testimonial':
        return (
          <div className="w-full h-full p-5 flex flex-col" style={{ backgroundColor: el.fillColor, border: `1px solid ${el.strokeColor}`, borderRadius: el.borderRadius }}>
            <div className="text-2xl mb-2" style={{ color: '#3b82f6' }}>"</div>
            <p className="text-xs flex-1" style={{ color: '#475569', lineHeight: 1.6 }}>This product changed my workflow completely. Highly recommend it to anyone looking for quality.</p>
            <div className="flex items-center gap-3 mt-3">
              <div className="h-8 w-8 rounded-full" style={{ backgroundColor: '#e2e8f0' }} />
              <div>
                <div className="text-xs font-semibold" style={{ color: '#1e293b' }}>Jane Cooper</div>
                <div className="text-[10px]" style={{ color: '#94a3b8' }}>CEO, TechCorp</div>
              </div>
            </div>
          </div>
        );
      case 'feature-grid':
        return (
          <div className="w-full h-full grid grid-cols-3 gap-4 p-6" style={{ backgroundColor: el.fillColor, border: `1px solid ${el.strokeColor}`, borderRadius: el.borderRadius }}>
            {[
              { svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, t: 'Fast' },
              { svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, t: 'Secure' },
              { svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>, t: 'Beautiful' },
            ].map((f, i) => (
              <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-lg" style={{ backgroundColor: '#f8fafc' }}>
                <span className="h-6 w-6" style={{ color: '#1e293b' }}>{f.svg}</span>
                <span className="text-xs font-semibold" style={{ color: '#1e293b' }}>{f.t}</span>
                <div className="h-2 w-3/4 rounded" style={{ backgroundColor: '#e2e8f0' }} />
              </div>
            ))}
          </div>
        );
      case 'cta-section':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8" style={{ backgroundColor: el.fillColor, borderRadius: el.borderRadius }}>
            <div className="text-lg font-bold text-white">Ready to get started?</div>
            <div className="text-xs text-white/70">Join thousands of users today</div>
            <div className="h-10 w-36 rounded-lg flex items-center justify-center text-sm font-medium" style={{ backgroundColor: '#ffffff', color: '#1e40af' }}>Start Free Trial</div>
          </div>
        );
      case 'contact-form':
        return (
          <div className="w-full h-full p-6 flex flex-col gap-3" style={{ backgroundColor: el.fillColor, border: `1px solid ${el.strokeColor}`, borderRadius: el.borderRadius }}>
            <div className="text-sm font-bold mb-1" style={{ color: '#1e293b' }}>{el.text || 'Contact Us'}</div>
            {['Your Name', 'Email Address'].map((l, i) => (
              <div key={i} className="h-10 rounded-lg border px-3 flex items-center text-xs" style={{ borderColor: '#e2e8f0', color: '#94a3b8' }}>{l}</div>
            ))}
            <div className="flex-1 rounded-lg border px-3 pt-2 text-xs min-h-[60px]" style={{ borderColor: '#e2e8f0', color: '#94a3b8' }}>Your message...</div>
            <div className="h-10 rounded-lg flex items-center justify-center text-xs text-white font-medium" style={{ backgroundColor: '#3b82f6' }}>Send Message</div>
          </div>
        );
      case 'login-form':
        return (
          <div className="w-full h-full p-6 flex flex-col gap-3 items-center" style={{ backgroundColor: el.fillColor, border: `1px solid ${el.strokeColor}`, borderRadius: el.borderRadius }}>
            <div className="h-10 w-10 rounded-xl mb-1" style={{ backgroundColor: '#3b82f6' }} />
            <div className="text-sm font-bold" style={{ color: '#1e293b' }}>{el.text || 'Welcome Back'}</div>
            <div className="text-[10px]" style={{ color: '#94a3b8' }}>Sign in to your account</div>
            <div className="w-full h-10 rounded-lg border px-3 flex items-center text-xs" style={{ borderColor: '#e2e8f0', color: '#94a3b8' }}>Email</div>
            <div className="w-full h-10 rounded-lg border px-3 flex items-center text-xs" style={{ borderColor: '#e2e8f0', color: '#94a3b8' }}>Password</div>
            <div className="w-full h-10 rounded-lg flex items-center justify-center text-xs text-white font-medium" style={{ backgroundColor: '#3b82f6' }}>Sign In</div>
            <div className="text-[10px]" style={{ color: '#94a3b8' }}>Don't have an account? <span style={{ color: '#3b82f6' }}>Sign up</span></div>
          </div>
        );
      case 'signup-form':
        return (
          <div className="w-full h-full p-6 flex flex-col gap-3 items-center" style={{ backgroundColor: el.fillColor, border: `1px solid ${el.strokeColor}`, borderRadius: el.borderRadius }}>
            <div className="text-sm font-bold" style={{ color: '#1e293b' }}>{el.text || 'Create Account'}</div>
            {['Full Name', 'Email', 'Password', 'Confirm Password'].map((l, i) => (
              <div key={i} className="w-full h-10 rounded-lg border px-3 flex items-center text-xs" style={{ borderColor: '#e2e8f0', color: '#94a3b8' }}>{l}</div>
            ))}
            <div className="w-full h-10 rounded-lg flex items-center justify-center text-xs text-white font-medium" style={{ backgroundColor: '#3b82f6' }}>Create Account</div>
          </div>
        );
      case 'search-bar':
        return (
          <div className="w-full h-full flex items-center gap-2 px-4" style={{ backgroundColor: el.fillColor, border: `1px solid ${el.strokeColor}`, borderRadius: el.borderRadius }}>
            <Search className="h-4 w-4" style={{ color: '#94a3b8' }} />
            <span className="text-sm" style={{ color: '#94a3b8' }}>{el.text || 'Search...'}</span>
          </div>
        );
      case 'carousel':
        return (
          <div className="w-full h-full flex items-center justify-center relative" style={{ backgroundColor: el.fillColor, border: `1px solid ${el.strokeColor}`, borderRadius: el.borderRadius }}>
            <div className="absolute left-3 h-8 w-8 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>‹</div>
            <div className="flex gap-3">
              {[1, 2, 3].map(i => <div key={i} className="rounded-lg" style={{ width: 200, height: el.height - 60, backgroundColor: i === 2 ? '#dbeafe' : '#e2e8f0' }} />)}
            </div>
            <div className="absolute right-3 h-8 w-8 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>›</div>
            <div className="absolute bottom-3 flex gap-1">{[1, 2, 3].map(i => <div key={i} className="h-2 w-2 rounded-full" style={{ backgroundColor: i === 2 ? '#3b82f6' : '#cbd5e1' }} />)}</div>
          </div>
        );
      case 'accordion':
        return (
          <div className="w-full h-full flex flex-col" style={{ backgroundColor: el.fillColor, border: `1px solid ${el.strokeColor}`, borderRadius: el.borderRadius, overflow: 'hidden' }}>
            {['Section 1', 'Section 2', 'Section 3'].map((s, i) => (
              <div key={i} className="border-b" style={{ borderColor: '#e2e8f0' }}>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs font-medium" style={{ color: '#1e293b' }}>{s}</span>
                  {i === 0 ? <ChevronDown className="h-3 w-3" style={{ color: '#94a3b8' }} /> : <ChevronRight className="h-3 w-3" style={{ color: '#94a3b8' }} />}
                </div>
                {i === 0 && <div className="px-4 pb-3 text-[10px]" style={{ color: '#64748b' }}>Expanded content area with description text.</div>}
              </div>
            ))}
          </div>
        );
      case 'alert':
        return (
          <div className="w-full h-full flex items-center gap-3 px-4" style={{ backgroundColor: el.fillColor, border: `1px solid ${el.strokeColor}`, borderRadius: el.borderRadius }}>
            <AlertTriangle className="h-4 w-4 shrink-0" style={{ color: '#f59e0b' }} />
            <span className="text-xs" style={{ color: '#92400e' }}>{el.text || 'Alert message'}</span>
            <X className="h-3 w-3 ml-auto shrink-0" style={{ color: '#92400e' }} />
          </div>
        );
      case 'tooltip-el':
        return (
          <div className="w-full h-full flex items-center justify-center relative" style={{ backgroundColor: el.fillColor, borderRadius: el.borderRadius }}>
            <span className="text-xs text-white">{el.text || 'Tooltip'}</span>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45" style={{ backgroundColor: el.fillColor }} />
          </div>
        );
      case 'video-player':
        return (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: el.fillColor, border: `1px solid ${el.strokeColor}`, borderRadius: el.borderRadius }}>
            <div className="h-14 w-14 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <Play className="h-6 w-6 text-white ml-1" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-8 flex items-center px-3 gap-2" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="h-1 flex-1 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}>
                <div className="h-full w-1/3 rounded-full bg-white" />
              </div>
              <span className="text-[9px] text-white">1:23</span>
            </div>
          </div>
        );
      case 'map-embed':
        return (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: el.fillColor, border: `1px solid ${el.strokeColor}`, borderRadius: el.borderRadius }}>
            <MapPin className="h-8 w-8" style={{ color: '#ef4444' }} />
            <div className="absolute bottom-2 right-2 flex gap-1">
              <div className="h-6 w-6 rounded text-xs flex items-center justify-center" style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>+</div>
              <div className="h-6 w-6 rounded text-xs flex items-center justify-center" style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>−</div>
            </div>
          </div>
        );
      case 'social-links':
        return (
          <div className="w-full h-full flex items-center gap-3">
            {['𝕏', 'in', 'f', '📷'].map((s, i) => (
              <div key={i} className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>{s}</div>
            ))}
          </div>
        );
      case 'stats-section':
        return (
          <div className="w-full h-full flex items-center justify-around" style={{ backgroundColor: el.fillColor, border: `1px solid ${el.strokeColor}`, borderRadius: el.borderRadius }}>
            {[{ v: '10K+', l: 'Users' }, { v: '500+', l: 'Projects' }, { v: '99.9%', l: 'Uptime' }, { v: '24/7', l: 'Support' }].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-lg font-bold" style={{ color: '#1e293b' }}>{s.v}</span>
                <span className="text-[10px]" style={{ color: '#94a3b8' }}>{s.l}</span>
              </div>
            ))}
          </div>
        );
      case 'team-section':
        return (
          <div className="w-full h-full p-6 flex flex-col items-center gap-4" style={{ backgroundColor: el.fillColor, border: `1px solid ${el.strokeColor}`, borderRadius: el.borderRadius }}>
            <div className="text-sm font-bold" style={{ color: '#1e293b' }}>Our Team</div>
            <div className="flex gap-6">
              {['Alex', 'Sarah', 'Mike', 'Lisa'].map((n, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="h-14 w-14 rounded-full" style={{ backgroundColor: '#e2e8f0' }} />
                  <span className="text-xs font-medium" style={{ color: '#1e293b' }}>{n}</span>
                  <span className="text-[9px]" style={{ color: '#94a3b8' }}>Role</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'faq-section':
        return (
          <div className="w-full h-full p-6 flex flex-col gap-3" style={{ backgroundColor: el.fillColor, border: `1px solid ${el.strokeColor}`, borderRadius: el.borderRadius }}>
            <div className="text-sm font-bold text-center mb-2" style={{ color: '#1e293b' }}>Frequently Asked Questions</div>
            {['How does it work?', 'What is the pricing?', 'Can I cancel anytime?'].map((q, i) => (
              <div key={i} className="border rounded-lg px-4 py-3" style={{ borderColor: '#e2e8f0' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: '#1e293b' }}>{q}</span>
                  <ChevronRight className="h-3 w-3" style={{ color: '#94a3b8' }} />
                </div>
              </div>
            ))}
          </div>
        );
      // Mobile Components
      case 'mobile-status-bar':
        return (
          <div className="w-full h-full flex items-end justify-between px-6 pb-2" style={{ backgroundColor: el.fillColor }}>
            <span className="text-xs font-semibold" style={{ color: '#1e293b' }}>9:41</span>
            <div className="flex gap-1 items-center">
              <div className="h-2.5 w-4 rounded-sm" style={{ border: '1px solid #1e293b' }}><div className="h-full w-3/4 rounded-sm" style={{ backgroundColor: '#1e293b' }} /></div>
            </div>
          </div>
        );
      case 'mobile-tab-bar':
        return (
          <div className="w-full h-full flex items-start justify-around pt-2 pb-6" style={{ backgroundColor: el.fillColor, borderTop: `1px solid ${el.strokeColor}` }}>
            {[{ i: '🏠', l: 'Home', a: true }, { i: '🔍', l: 'Search', a: false }, { i: '➕', l: 'Create', a: false }, { i: '💬', l: 'Chat', a: false }, { i: '👤', l: 'Profile', a: false }].map((t, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <span className="text-sm">{t.i}</span>
                <span className="text-[9px]" style={{ color: t.a ? '#3b82f6' : '#94a3b8' }}>{t.l}</span>
              </div>
            ))}
          </div>
        );
      case 'mobile-app-bar':
        return (
          <div className="w-full h-full flex items-center justify-between px-4" style={{ backgroundColor: el.fillColor, borderBottom: `1px solid ${el.strokeColor}` }}>
            <ArrowLeft className="h-5 w-5" style={{ color: '#1e293b' }} />
            <span className="text-sm font-semibold" style={{ color: '#1e293b' }}>{el.text || 'Title'}</span>
            <MoreVertical className="h-5 w-5" style={{ color: '#1e293b' }} />
          </div>
        );
      case 'mobile-fab':
        return (
          <div className="w-full h-full rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: el.fillColor, boxShadow: '0 4px 12px rgba(59,130,246,0.4)' }}>
            <span className="text-white text-xl font-bold">{el.text || '+'}</span>
          </div>
        );
      case 'mobile-list-item':
        return (
          <div className="w-full h-full flex items-center gap-3 px-4" style={{ backgroundColor: el.fillColor, borderBottom: `1px solid ${el.strokeColor}` }}>
            <div className="h-10 w-10 rounded-full shrink-0" style={{ backgroundColor: '#e2e8f0' }} />
            <div className="flex-1 flex flex-col gap-0.5">
              <span className="text-xs font-medium" style={{ color: '#1e293b' }}>{el.text || 'List Item'}</span>
              <span className="text-[10px]" style={{ color: '#94a3b8' }}>Secondary text goes here</span>
            </div>
            <ChevronRight className="h-4 w-4" style={{ color: '#cbd5e1' }} />
          </div>
        );
      case 'mobile-switch':
        return (
          <div className="w-full h-full rounded-full flex items-center px-0.5" style={{ backgroundColor: el.fillColor }}>
            <div className="rounded-full bg-white shadow" style={{ width: el.height - 4, height: el.height - 4, marginLeft: 'auto' }} />
          </div>
        );
      case 'mobile-chip':
        return (
          <div className="w-full h-full flex items-center justify-center rounded-full" style={{ backgroundColor: el.fillColor, border: `1px solid ${el.strokeColor}`, fontSize: el.fontSize || 13, color: '#3b82f6', fontWeight: 500 }}>
            {el.text || 'Chip'}
          </div>
        );
      case 'mobile-bottom-sheet':
        return (
          <div className="w-full h-full flex flex-col" style={{ backgroundColor: el.fillColor, border: `1px solid ${el.strokeColor}`, borderRadius: `${el.borderRadius}px ${el.borderRadius}px 0 0`, boxShadow: '0 -4px 20px rgba(0,0,0,0.1)' }}>
            <div className="flex justify-center py-3"><div className="h-1 w-10 rounded-full" style={{ backgroundColor: '#cbd5e1' }} /></div>
            <div className="px-5 py-2 text-sm font-semibold" style={{ color: '#1e293b' }}>Bottom Sheet</div>
            <div className="flex-1 px-5">
              {[1, 2, 3].map(i => <div key={i} className="h-3 rounded mb-3" style={{ backgroundColor: '#f1f5f9', width: `${90 - i * 15}%` }} />)}
            </div>
          </div>
        );
      case 'mobile-card':
        return (
          <div className="w-full h-full flex flex-col overflow-hidden" style={{ backgroundColor: el.fillColor, border: `1px solid ${el.strokeColor}`, borderRadius: el.borderRadius }}>
            <div className="h-1/2" style={{ backgroundColor: '#f1f5f9' }} />
            <div className="p-3 flex flex-col gap-1.5">
              <div className="h-3 w-2/3 rounded" style={{ backgroundColor: '#e2e8f0' }} />
              <div className="h-2 w-full rounded" style={{ backgroundColor: '#f1f5f9' }} />
              <div className="h-2 w-4/5 rounded" style={{ backgroundColor: '#f1f5f9' }} />
            </div>
          </div>
        );
      case 'mobile-search':
        return (
          <div className="w-full h-full flex items-center gap-2 px-3" style={{ backgroundColor: el.fillColor, borderRadius: el.borderRadius }}>
            <Search className="h-4 w-4" style={{ color: '#94a3b8' }} />
            <span className="text-xs" style={{ color: '#94a3b8' }}>{el.text || 'Search...'}</span>
          </div>
        );
      case 'mobile-drawer':
        return (
          <div className="w-full h-full flex flex-col" style={{ backgroundColor: el.fillColor, borderRight: `1px solid ${el.strokeColor}`, boxShadow: '4px 0 20px rgba(0,0,0,0.1)' }}>
            <div className="p-5 flex items-center gap-3 border-b" style={{ borderColor: '#e2e8f0' }}>
              <div className="h-10 w-10 rounded-full" style={{ backgroundColor: '#e2e8f0' }} />
              <div>
                <div className="text-xs font-semibold" style={{ color: '#1e293b' }}>John Doe</div>
                <div className="text-[10px]" style={{ color: '#94a3b8' }}>john@mail.com</div>
              </div>
            </div>
            {['Home', 'Profile', 'Settings', 'Notifications', 'Help'].map((t, i) => (
              <div key={i} className="h-11 flex items-center px-5 text-xs" style={{ color: i === 0 ? '#3b82f6' : '#475569', backgroundColor: i === 0 ? '#eff6ff' : 'transparent', fontWeight: i === 0 ? 600 : 400 }}>{t}</div>
            ))}
          </div>
        );
      case 'mobile-snackbar':
        return (
          <div className="w-full h-full flex items-center justify-between px-4" style={{ backgroundColor: el.fillColor, borderRadius: el.borderRadius }}>
            <span className="text-xs text-white">{el.text || 'Action completed'}</span>
            <span className="text-xs font-semibold" style={{ color: '#60a5fa' }}>UNDO</span>
          </div>
        );
      default: // rect, circle
        return (
          <div className="w-full h-full" style={{ backgroundColor: el.fillColor, border: `1px solid ${el.strokeColor}`, borderRadius: el.type === 'circle' ? '50%' : el.borderRadius }} />
        );
    }
  };

  return (
    <div
      className="absolute"
      style={{
        left: el.x,
        top: el.y,
        width: el.width,
        height: el.height,
        opacity: el.opacity,
        outline: selected ? '2px solid hsl(var(--primary))' : 'none',
        outlineOffset: 2,
      }}
    >
      {renderContent()}
      {selected && (
        <>
          {['nw', 'ne', 'sw', 'se'].map(pos => (
            <div
              key={pos}
              className="absolute bg-primary border-2 border-background rounded-sm"
              style={{
                width: handleSize,
                height: handleSize,
                cursor: `${pos}-resize`,
                ...(pos.includes('n') ? { top: -handleSize / 2 } : { bottom: -handleSize / 2 }),
                ...(pos.includes('w') ? { left: -handleSize / 2 } : { right: -handleSize / 2 }),
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
