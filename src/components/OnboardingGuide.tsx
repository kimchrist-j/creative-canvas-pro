import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, ChevronRight, ChevronLeft, FileText, Download, Layout, CreditCard, Sparkles } from 'lucide-react';

const steps = [
  {
    icon: FileText,
    title: 'Create Your Resume',
    description: 'Use our intuitive editor to build a professional CV. Fill in your personal information, experience, education, and skills using the sidebar panel.',
  },
  {
    icon: Download,
    title: 'Download as PDF',
    description: 'Your first download is completely free! After that, unlock unlimited downloads with a small one-time payment.',
  },
  {
    icon: Layout,
    title: 'Design Wireframes',
    description: 'Create website, web app, and mobile app wireframes and design layouts. Drag and drop elements to build your vision.',
  },
  {
    icon: Sparkles,
    title: 'Live Preview',
    description: 'See your changes in real-time as you edit. Zoom in and out, and everything updates instantly.',
  },
];

export default function OnboardingGuide({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4">
      <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              {(() => { const Icon = steps[step].icon; return <Icon className="h-6 w-6 text-foreground" />; })()}
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <h3 className="text-xl font-bold text-foreground mb-2">{steps[step].title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{steps[step].description}</p>

          {/* Dots */}
          <div className="flex gap-2 mt-6">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-foreground' : 'w-1.5 bg-border'}`} />
            ))}
          </div>
        </div>

        <div className="px-8 pb-8 flex justify-between items-center">
          <Button variant="ghost" size="sm" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          {step < steps.length - 1 ? (
            <Button size="sm" onClick={() => setStep(step + 1)}>
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button size="sm" onClick={onClose}>
              Get Started <Sparkles className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
