import React, { useState } from 'react';
import { useMoneyShoppingStore } from '../useMoneyShoppingStore';
import { getShopItemsByGrade } from '../data/shopItemsCatalog';
import { getBillsByGrade, formatVnd } from '../data/currencyCatalog';
import { CurrencyBillCard } from './CurrencyBillCard';
import type { ShopItemCategory, ShopItem, MoneyDenomination } from '@/types/moneyShopping';
import {
  ShoppingBag,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Receipt,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Store,
  DollarSign,
} from 'lucide-react';

export const InteractiveShopView: React.FC = () => {
  const {
    campaignId,
    selectedShopCategory,
    setShopCategory,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    walletCashGiven,
    addPaymentBill,
    clearPaymentCash,
    processShopCheckout,
    shoppingReceipt,
    shoppingFeedback,
    activeShoppingTask,
    answerShoppingTask,
    nextShoppingTask,
  } = useMoneyShoppingStore();

  const [activeTab, setActiveTab] = useState<'shop' | 'quest'>('shop');
  const [userChangeInput, setUserChangeInput] = useState<string>('');

  const gradeLevel = campaignId === 'grade-3' ? 'grade-3' : 'grade-2';
  const availableItems = getShopItemsByGrade(gradeLevel, selectedShopCategory);
  const availableBills = getBillsByGrade(gradeLevel);
  const cartTotal = getCartTotal();

  const handleCheckout = () => {
    const changeVal = parseInt(userChangeInput.replace(/\D/g, ''), 10) || 0;
    processShopCheckout(changeVal);
  };

  const categories: { id: ShopItemCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'Tất cả', icon: '🏪' },
    { id: 'food', label: 'Bánh kẹo & Đồ ăn', icon: '🍎' },
    { id: 'school', label: 'Dụng cụ học tập', icon: '✏️' },
    { id: 'adventure', label: 'Đồ dã ngoại', icon: '🧭' },
    { id: 'gear', label: 'Trang bị hiệp sĩ', icon: '🛡️' },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto p-4">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2">
            <Store className="w-6 h-6 text-cyan-300" />
            Tiệm Tạp Hóa Ma Thuật Của Bác Barnaby
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            Chọn hàng vào giỏ, kiểm tra hóa đơn, đưa tiền và tự tính tiền thừa để nhận hàng vào túi đồ!
          </p>
        </div>

        {/* Tab switch between Virtual Shop & Word Problems */}
        <div className="flex bg-black/30 p-1.5 rounded-xl border border-white/20">
          <button
            onClick={() => setActiveTab('shop')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'shop'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-white hover:text-amber-200'
            }`}
          >
            <ShoppingCart className="w-4 h-4" /> Quầy Mua Sắm Thực Tế
          </button>
          <button
            onClick={() => setActiveTab('quest')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'quest'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-white hover:text-amber-200'
            }`}
          >
            <Receipt className="w-4 h-4" /> Bài Toán Mua Bán
          </button>
        </div>
      </div>

      {activeTab === 'shop' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Shelves & Catalog */}
          <div className="lg:col-span-2 space-y-5">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 pb-1 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setShopCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                    selectedShopCategory === cat.id
                      ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-md'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Shelf Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {availableItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-blue-500/50 hover:shadow-lg transition-all group"
                >
                  <div>
                    <div className="w-full h-24 bg-slate-950/70 rounded-xl flex items-center justify-center text-4xl mb-3 shadow-inner border border-slate-800 group-hover:scale-105 transition-transform">
                      {item.icon}
                    </div>
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <h4 className="font-bold text-slate-100 text-sm line-clamp-1">
                        {item.nameVi}
                      </h4>
                      {item.popular && (
                        <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded-sm font-bold uppercase shrink-0">
                          Hot
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                      {item.descriptionVi}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="font-black text-amber-400 font-mono text-base">
                      {formatVnd(item.price)}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-transform active:scale-95 shadow-md"
                    >
                      <Plus className="w-3.5 h-3.5" /> Thêm
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Col: Cart & Cashier Counter */}
          <div className="space-y-6">
            {/* Cart Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-white text-base">Giỏ Hàng Của Tony</h3>
                </div>
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Xóa hết
                  </button>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs italic">
                  Chưa có sản phẩm nào trong giỏ hàng.
                </div>
              ) : (
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {cart.map((c) => (
                    <div
                      key={c.item.id}
                      className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 max-w-[55%]">
                        <span className="text-xl">{c.item.icon}</span>
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-200 truncate">
                            {c.item.nameVi}
                          </p>
                          <p className="text-[11px] text-amber-400 font-mono">
                            {formatVnd(c.item.price)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateCartQuantity(c.item.id, c.quantity - 1)}
                          className="w-6 h-6 rounded bg-slate-800 hover:bg-rose-600 text-white flex items-center justify-center text-xs cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-white font-mono">
                          {c.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(c.item.id, c.quantity + 1)}
                          className="w-6 h-6 rounded bg-slate-800 hover:bg-emerald-600 text-white flex items-center justify-center text-xs cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeFromCart(c.item.id)}
                          className="ml-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Total calculation breakdown */}
              <div className="mt-4 pt-3 border-t border-slate-800 space-y-1.5">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Số lượng món:</span>
                  <span className="font-mono font-bold text-slate-200">
                    {cart.reduce((s, c) => s + c.quantity, 0)} món
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-300">Tổng hóa đơn:</span>
                  <span className="text-yellow-400 font-mono text-lg">
                    {formatVnd(cartTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Cashier Payment Desk */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-white text-base">Quầy Thu Ngân</h3>
                </div>
                <button
                  onClick={clearPaymentCash}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Đặt lại tiền
                </button>
              </div>

              {/* Cash given display */}
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-400">Tiền Tony đưa:</span>
                <span className="text-lg font-black text-emerald-400 font-mono">
                  {formatVnd(walletCashGiven)}
                </span>
              </div>

              {/* Money Tray to click and give money */}
              <div>
                <span className="text-xs text-slate-400 block mb-2 font-medium">
                  Chọn tờ tiền đưa cho thu ngân:
                </span>
                <div className="flex flex-wrap gap-2">
                  {availableBills.map((bill) => (
                    <button
                      key={bill.denomination}
                      onClick={() => addPaymentBill(bill.denomination)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600/30 border border-slate-700 hover:border-emerald-400 text-xs font-mono font-bold text-white cursor-pointer transition-all"
                    >
                      +{bill.denomination.toLocaleString('vi-VN')}đ
                    </button>
                  ))}
                </div>
              </div>

              {/* Tony Change calculation input */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <label className="text-xs text-amber-300 font-bold block">
                  Tiền thừa Tony tính phải nhận lại (đồng):
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={userChangeInput}
                    onChange={(e) => setUserChangeInput(e.target.value)}
                    placeholder="Ví dụ: 2000"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono font-bold text-sm focus:outline-hidden focus:border-amber-400"
                  />
                  <button
                    onClick={handleCheckout}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 cursor-pointer shadow-md transition-transform active:scale-95"
                  >
                    Thanh Toán
                  </button>
                </div>
                <span className="text-[10px] text-slate-500 block italic">
                  Công thức: Tiền thừa = Tiền đưa - Tổng hóa đơn
                </span>
              </div>

              {/* Feedback */}
              {shoppingFeedback && (
                <div
                  className={`p-3 rounded-xl border text-xs flex flex-col gap-2 ${
                    shoppingFeedback.isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                      : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {shoppingFeedback.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span className="font-semibold">{shoppingFeedback.message}</span>
                  </div>
                </div>
              )}

              {/* Receipt Modal if completed */}
              {shoppingReceipt && (
                <div className="bg-white text-slate-950 p-4 rounded-xl shadow-2xl font-mono text-xs space-y-2 border-2 border-dashed border-slate-400">
                  <div className="text-center pb-2 border-b border-dashed border-slate-300">
                    <h4 className="font-black text-sm uppercase">HÓA ĐƠN MUA HÀNG</h4>
                    <p className="text-[10px] text-slate-500">Tiệm Tạp Hóa Ma Thuật</p>
                    <p className="text-[10px] text-slate-500">{shoppingReceipt.time}</p>
                  </div>
                  <div className="space-y-1 py-1 max-h-32 overflow-y-auto">
                    {shoppingReceipt.items.map((i) => (
                      <div key={i.item.id} className="flex justify-between">
                        <span className="truncate max-w-[65%]">
                          {i.quantity}x {i.item.nameVi}
                        </span>
                        <span className="font-bold">
                          {formatVnd(i.item.price * i.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-dashed border-slate-300 space-y-1">
                    <div className="flex justify-between font-bold">
                      <span>TỔNG CỘNG:</span>
                      <span>{formatVnd(shoppingReceipt.total)}</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Tiền khách đưa:</span>
                      <span>{formatVnd(shoppingReceipt.cashPaid)}</span>
                    </div>
                    <div className="flex justify-between font-black text-emerald-700 text-sm">
                      <span>TIỀN THỪA:</span>
                      <span>{formatVnd(shoppingReceipt.change)}</span>
                    </div>
                  </div>
                  <div className="text-center pt-2 text-[10px] text-slate-500 italic">
                    Cảm ơn hiệp sĩ Tony đã ghé tiệm!
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Word Problem Challenge Tab */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 px-3 py-1 rounded-full border border-blue-800">
                Thử thách bài toán mua sắm
              </span>
              <h3 className="text-xl font-black text-white mt-2">
                {activeShoppingTask.titleVi}
              </h3>
            </div>
          </div>

          <p className="text-xs text-amber-300 italic mb-3">
            {activeShoppingTask.storyContextVi}
          </p>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 mb-5">
            <p className="text-base text-slate-100 font-medium leading-relaxed">
              {activeShoppingTask.promptVi}
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {activeShoppingTask.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => answerShoppingTask(idx)}
                className="p-4 rounded-xl text-left font-bold text-slate-100 bg-slate-800 hover:bg-blue-600/30 border border-slate-700 hover:border-blue-500 transition-all duration-150 flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-700 group-hover:bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm group-hover:text-blue-300 transition-colors">
                    {opt}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-blue-400 transition-opacity" />
              </button>
            ))}
          </div>

          {/* Feedback */}
          {shoppingFeedback && (
            <div
              className={`p-4 rounded-xl border flex flex-col gap-3 ${
                shoppingFeedback.isCorrect
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-3">
                {shoppingFeedback.isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
                )}
                <span className="font-bold text-base">{shoppingFeedback.message}</span>
              </div>

              {shoppingFeedback.diagnostic && (
                <div className="bg-black/30 p-3 rounded-lg border border-white/10 text-xs space-y-1">
                  <span className="font-bold text-yellow-300 block">
                    💡 Hướng dẫn giải bài toán:
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {shoppingFeedback.diagnostic.remediationAdviceVi}
                  </p>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={nextShoppingTask}
                  className="px-5 py-2.5 rounded-xl font-bold bg-blue-500 hover:bg-blue-400 text-slate-950 flex items-center gap-2 cursor-pointer shadow-md transition-transform hover:scale-105"
                >
                  Bài toán tiếp theo <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
