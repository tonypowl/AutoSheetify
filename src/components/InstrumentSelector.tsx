import React, { forwardRef, useImperativeHandle } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music } from 'lucide-react';

export interface InstrumentSelectorHandles {
  selectInstrument: (instrument: 'piano' | 'guitar') => void;
}

interface InstrumentSelectorProps {
  selectedInstrument: 'piano' | 'guitar';
  onInstrumentChange: (instrument: 'piano' | 'guitar') => void;
}

const InstrumentSelector = forwardRef<InstrumentSelectorHandles, InstrumentSelectorProps>(
  ({ selectedInstrument, onInstrumentChange }, ref) => {
    useImperativeHandle(ref, () => ({
      selectInstrument: (instrument: 'piano' | 'guitar') => {
        onInstrumentChange(instrument);
        document.getElementById('instrument-section')?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      },
    }));

    return (
      <Card
        id="instrument-section"
        className="bg-slate-800/50 border-slate-700/50 backdrop-blur-lg mb-8 scroll-mt-28"
      >
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Music className="mr-2 h-5 w-5 text-purple-400" />
            Select Instrument
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {(['piano', 'guitar'] as const).map((instrument) => (
              <button
                key={instrument}
                onClick={() => onInstrumentChange(instrument)}
                className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                  selectedInstrument === instrument
                    ? 'border-cyan-400 bg-cyan-400/10 shadow-lg'
                    : 'border-slate-600 hover:border-slate-500 hover:bg-slate-700/30'
                }`}
              >
                <div className="text-center space-y-3">
                  <div className="text-4xl">{instrument === 'piano' ? '🎹' : '🎸'}</div>
                  <div>
                    <h3 className="text-white font-semibold capitalize">{instrument}</h3>
                    <p className="text-slate-400 text-sm">
                      {instrument === 'piano'
                        ? 'Perfect for melodies and harmonies'
                        : 'Great for chords and rhythm'}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
);

export default InstrumentSelector;
