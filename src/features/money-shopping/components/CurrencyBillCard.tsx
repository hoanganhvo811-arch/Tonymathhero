import React from 'react';
import type { CurrencyBill, MoneyDenomination } from '@/types/moneyShopping';
import { VIETNAMESE_BILLS_CATALOG } from '../data/currencyCatalog';

interface CurrencyBillCardProps {
  bill?: CurrencyBill;
  denomination?: MoneyDenomination;
  size?: 'sm' | 'md' | 'lg';
  count?: number;
  interactive?: boolean;
  onClick?: () => void;
  selected?: boolean;
}

export const CurrencyBillCard: React.FC<CurrencyBillCardProps> = ({
  bill: propBill,
  denomination,
  size = 'md',
  count,
  interactive = true,
  onClick,
  selected = false,
}) => {
  const bill =
    propBill ||
    VIETNAMESE_BILLS_CATALOG.find((b) => b.denomination === denomination) ||
    VIETNAMESE_BILLS_CATALOG[3];

  const sizeClasses = {
    sm: 'w-24 h-14 text-xs p-1.5 rounded-md shadow-sm',
    md: 'w-36 h-20 text-sm p-2.5 rounded-lg shadow-md',
    lg: 'w-48 h-28 text-base p-3 rounded-xl shadow-lg',
  }[size];

  const isPolymer = bill.material === 'polymer';

  return (
    <div
      onClick={interactive ? onClick : undefined}
      className={`relative select-none flex flex-col justify-between overflow-hidden border-2 transition-all duration-200 ${
        bill.bgGradient
      } ${bill.borderColor} ${sizeClasses} ${
        interactive
          ? 'cursor-pointer hover:scale-105 active:scale-95 hover:shadow-xl'
          : ''
      } ${selected ? 'ring-4 ring-yellow-400 ring-offset-2 scale-105 shadow-xl' : ''}`}
      style={{
        boxShadow: selected
          ? '0 0 15px rgba(234, 179, 8, 0.6)'
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Background watermark motif */}
      <div className="absolute inset-0 opacity-10 flex items-center justify-center font-serif text-3xl font-black pointer-events-none">
        VIỆT NAM
      </div>

      {/* Header: Country & denomination value */}
      <div className="flex justify-between items-start z-10">
        <span className={`text-[10px] font-bold uppercase tracking-wider ${bill.textColor}`}>
          VN
        </span>
        <span className={`font-black font-mono tracking-tight ${bill.textColor}`}>
          {bill.denomination.toLocaleString('vi-VN')}
        </span>
      </div>

      {/* Center: Graphic Feature hint or Polymer Window */}
      <div className="flex items-center justify-between z-10 my-auto px-1">
        <div className="flex flex-col">
          <span className={`text-[9px] font-medium leading-tight ${bill.textColor} opacity-90 truncate max-w-[85%]`}>
            {bill.material === 'polymer' ? '⭐ Polymer' : '📜 Cotton'}
          </span>
        </div>

        {/* Polymer Window Simulation */}
        {isPolymer ? (
          <div className="w-4 h-4 rounded-full border border-sky-400/50 bg-white/40 backdrop-blur-xs flex items-center justify-center shadow-inner">
            <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
          </div>
        ) : (
          <div className="w-3 h-3 rounded-xs border border-amber-600/30 bg-amber-500/20" />
        )}
      </div>

      {/* Footer: Denomination label in text */}
      <div className="flex justify-between items-end z-10 border-t border-black/10 pt-0.5">
        <span className={`text-[9px] font-bold truncate max-w-[80px] ${bill.textColor}`}>
          {bill.labelVi}
        </span>
        <span className={`text-[9px] font-mono font-bold ${bill.textColor}`}>
          ĐỒNG
        </span>
      </div>

      {/* Counter Badge if count > 1 */}
      {count !== undefined && count > 0 && (
        <div className="absolute -top-2 -right-2 bg-rose-600 text-white font-black text-xs w-6 h-6 rounded-full flex items-center justify-center shadow-md border-2 border-white z-20">
          x{count}
        </div>
      )}
    </div>
  );
};
