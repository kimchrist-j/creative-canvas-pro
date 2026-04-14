import { DeviceFrame, DEVICE_FRAMES } from './types';

interface Props {
  frame: DeviceFrame;
  children: React.ReactNode;
}

export default function DeviceFrameWrapper({ frame, children }: Props) {
  if (frame === 'none' || frame === 'desktop-browser') {
    if (frame === 'desktop-browser') {
      return (
        <div className="inline-block rounded-xl overflow-hidden shadow-2xl" style={{ border: '2px solid #e2e8f0' }}>
          {/* Browser chrome */}
          <div className="h-9 flex items-center gap-2 px-3" style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#ef4444' }} />
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#22c55e' }} />
            </div>
            <div className="flex-1 h-5 rounded-md mx-8" style={{ backgroundColor: '#e2e8f0' }} />
          </div>
          {children}
        </div>
      );
    }
    return <>{children}</>;
  }

  const config = DEVICE_FRAMES[frame];
  const isIPhone = frame.startsWith('iphone');
  const isIPad = frame === 'ipad';

  return (
    <div className="inline-block" style={{ padding: 16 }}>
      <div
        className="relative"
        style={{
          width: config.width + 24,
          height: config.height + 24,
          backgroundColor: '#1a1a2e',
          borderRadius: isIPhone ? 48 : isIPad ? 24 : 16,
          padding: 12,
          boxShadow: '0 25px 60px -12px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.1)',
        }}
      >
        {/* Notch / Dynamic Island for iPhone 15 */}
        {frame === 'iphone-15' && (
          <div className="absolute left-1/2 -translate-x-1/2 z-10" style={{ top: 16, width: 120, height: 34, backgroundColor: '#000', borderRadius: 20 }} />
        )}

        {/* Screen */}
        <div
          className="relative overflow-hidden"
          style={{
            width: config.width,
            height: config.height,
            borderRadius: isIPhone ? 40 : isIPad ? 16 : 8,
            backgroundColor: '#ffffff',
          }}
        >
          {children}
        </div>

        {/* Home indicator for iPhone */}
        {isIPhone && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2" style={{ width: 134, height: 5, backgroundColor: '#666', borderRadius: 3 }} />
        )}
      </div>

      <div className="text-center mt-3 text-xs font-medium text-muted-foreground">{config.label}</div>
    </div>
  );
}
