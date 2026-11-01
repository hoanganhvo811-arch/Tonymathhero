import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '#/';
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="max-w-md w-full bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-8 shadow-2xl space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-4xl animate-bounce">
              🛡️
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-widest text-amber-400 block mb-1">
                KHIÊN BẢO HỘ TONY MATH HERO
              </span>
              <h2 className="text-2xl font-black text-white">
                Đã Xảy Ra Gián Đoạn Nhỏ!
              </h2>
              <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                Đừng lo lắng, toàn bộ tiến trình học tập, trang bị và thành tựu của Tony vẫn được bảo vệ an toàn trong máy tính!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black rounded-xl shadow-lg transition active:scale-95 text-sm"
              >
                🔄 Tải Lại Trò Chơi
              </button>
              <button
                onClick={this.handleGoHome}
                className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 transition text-sm"
              >
                🏠 Về Trang Chủ
              </button>
            </div>

            {this.state.error && (
              <details className="text-left text-xs text-gray-500 mt-4 bg-black/40 p-3 rounded-xl border border-white/10 overflow-auto max-h-32">
                <summary className="cursor-pointer font-bold text-gray-400 hover:text-gray-300">
                  Chi tiết kỹ thuật (dành cho phụ huynh / lập trình viên)
                </summary>
                <p className="mt-2 text-rose-300 font-mono text-[11px]">
                  {this.state.error.toString()}
                </p>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
