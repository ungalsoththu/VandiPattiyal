
import React from 'react';
import { Translation } from '../types';
import { CONTRACT_CONTENT } from '../constants';
import { Briefcase, Landmark, Settings, Info } from 'lucide-react';

interface ContractInfoProps {
  type: 'PTSC' | 'GCC';
  language: 'en' | 'ta';
  t: Translation;
}

const ContractInfo: React.FC<ContractInfoProps> = ({ type, language, t }) => {
  const content = CONTRACT_CONTENT[language][type];

  const getIcon = (index: number) => {
    switch (index) {
      case 0: return <Landmark className="text-blue-600" size={24} />;
      case 1: return <Briefcase className="text-emerald-600" size={24} />;
      case 2: return <Settings className="text-purple-600" size={24} />;
      default: return <Info className="text-slate-600" size={24} />;
    }
  };

  const getBgColor = (index: number) => {
    switch (index) {
      case 0: return 'bg-blue-50';
      case 1: return 'bg-emerald-50';
      case 2: return 'bg-purple-50';
      default: return 'bg-slate-50';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Header Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-64 h-64 opacity-5 rounded-full -mr-16 -mt-16 ${type === 'GCC' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
        <div className="relative z-10">
          <div className="inline-block px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-500 mb-4 tracking-wide">
            {type === 'PTSC' ? t.ptsc : t.gcc}
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{content.title}</h1>
          <p className="text-lg text-slate-500 font-medium">{content.subtitle}</p>
          <p className="mt-6 text-slate-600 leading-relaxed max-w-3xl">
            {content.description}
          </p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {content.sections.map((section, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-xl ${getBgColor(index)}`}>
                {getIcon(index)}
              </div>
              <h3 className="text-lg font-bold text-slate-800">{section.title}</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed flex-1">
              {section.content}
            </p>
          </div>
        ))}
      </div>

      {/* Comparison Badge / Footer */}
      <div className="flex justify-center mt-8">
        <div className="bg-slate-100 px-6 py-3 rounded-full flex items-center gap-2 text-slate-500 text-sm">
          <Info size={16} />
          <span>
            {type === 'PTSC' 
              ? (language === 'en' ? 'Currently the dominant model for MTC diesel fleets.' : 'தற்போதைய MTC டீசல் பேருந்துகளுக்கான முக்கிய முறை.')
              : (language === 'en' ? 'Increasingly adopted for new Electric Vehicle (EV) fleets.' : 'புதிய மின்சார வாகனங்களுக்கு (EV) இது அதிகமாகப் பயன்படுத்தப்படுகிறது.')
            }
          </span>
        </div>
      </div>
    </div>
  );
};

export default ContractInfo;
