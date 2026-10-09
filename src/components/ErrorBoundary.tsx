import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  private handleReset = () => {
    // Clear corrupted active draft from localStorage to prevent stuck state
    try {
      localStorage.removeItem('troly_gv_active_exam');
      localStorage.removeItem('troly_gv_active_lesson');
      localStorage.removeItem('troly_gv_active_slides');
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }

    if (this.props.onReset) {
      this.props.onReset();
    }
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-white rounded-2xl border border-red-200 shadow-xl p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl mx-auto flex items-center justify-center border border-red-200">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">
                {this.props.fallbackTitle || 'Đã xảy ra sự cố khi hiển thị giao diện'}
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Dữ liệu vừa tạo hoặc bản nháp có định dạng chưa khớp với mẫu hiển thị. Đừng lo lắng, dữ liệu kho lưu trữ của bạn vẫn an toàn!
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left text-[11px] text-slate-600 font-mono break-all max-h-32 overflow-y-auto">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="btn-3d-teal w-full sm:w-auto px-4 py-2.5 text-xs font-bold flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Khôi phục đề mẫu chuẩn & Tiếp tục</span>
              </button>

              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Tải lại trang</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
