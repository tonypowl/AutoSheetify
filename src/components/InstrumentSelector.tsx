
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music } from 'lucide-react';

interface InstrumentSelectorProps {
  selectedInstrument: 'piano' | 'guitar';
  onInstrumentChange: (instrument: 'piano' | 'guitar') => void;
}

const InstrumentSelector = ({ selectedInstrument, onInstrumentChange }: InstrumentSelectorProps) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-lg mb-8">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Music className="mr-2 h-5 w-5 text-purple-400" />
          Select Instrument
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onInstrumentChange('piano')}
            className={`p-6 rounded-lg border-2 transition-all duration-300 ${
              selectedInstrument === 'piano'
                ? 'border-cyan-400 bg-cyan-400/10 shadow-lg'
                : 'border-slate-600 hover:border-slate-500 hover:bg-slate-700/30'
            }`}
          >
            <div className="text-center space-y-3">
              <div className="text-4xl">🎹</div>
              <div>
                <h3 className="text-white font-semibold">Piano</h3>
                <p className="text-slate-400 text-sm">Perfect for melodies and harmonies</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onInstrumentChange('guitar')}
            className={`p-6 rounded-lg border-2 transition-all duration-300 ${
              selectedInstrument === 'guitar'
                ? 'border-cyan-400 bg-cyan-400/10 shadow-lg'
                : 'border-slate-600 hover:border-slate-500 hover:bg-slate-700/30'
            }`}
          >
            <div className="text-center space-y-3">
              <div className="text-4xl">🎸</div>
              <div>
                <h3 className="text-white font-semibold">Guitar</h3>
                <p className="text-slate-400 text-sm">Great for chords and rhythm</p>
              </div>
            </div>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstrumentSelector;
