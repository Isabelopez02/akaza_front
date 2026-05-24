import { ClipboardList } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="w-full space-y-8 animate-pulse p-1 select-none">
      {/* Premium Header Skeleton */}
      <div className="flex justify-between items-center pb-6 border-b border-gray-100/80">
        <div className="space-y-3">
          <div className="h-8 bg-gray-200 rounded-2xl w-56 shadow-sm"></div>
          <div className="h-4 bg-gray-200 rounded-xl w-96 shadow-sm"></div>
        </div>
        <div className="h-11 bg-gray-200 rounded-2xl w-36 shadow-sm"></div>
      </div>

      {/* KPI Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex items-center justify-between min-h-[128px]"
          >
            <div className="space-y-3 flex-1">
              <div className="h-3 bg-gray-200 rounded-full w-1/3"></div>
              <div className="h-8 bg-gray-200 rounded-2xl w-2/3"></div>
              <div className="h-3 bg-gray-200 rounded-full w-1/2"></div>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-2xl shadow-inner flex-shrink-0 ml-4"></div>
          </div>
        ))}
      </div>

      {/* Main Content Layout Skeleton (Two Columns) */}
      <div className="grid grid-cols-1 xl:grid-cols-[70%_30%] gap-6">
        {/* Left Side: Table/Grid Skeleton */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.015)] overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
            <div className="h-5 bg-gray-200 rounded-lg w-40"></div>
            <div className="h-8 bg-gray-200 rounded-xl w-24"></div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex gap-4 mb-4">
              <div className="h-11 bg-gray-200 rounded-xl flex-1"></div>
              <div className="h-11 bg-gray-200 rounded-xl w-32"></div>
            </div>
            <div className="space-y-3.5">
              {[1, 2, 3, 5, 6].map((i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-gray-50/50">
                  <div className="flex gap-4 items-center flex-1">
                    <div className="w-10 h-10 bg-gray-200 rounded-2xl"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded-lg w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Sidebar/Widget Skeleton */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.015)] p-6 space-y-6 flex flex-col justify-between min-h-[350px]">
          <div className="space-y-4">
            <div className="h-5 bg-gray-200 rounded-lg w-1/2"></div>
            <div className="h-9 bg-gray-200 rounded-xl w-full"></div>
          </div>
          <div className="space-y-3.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center py-2.5">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded-full w-12"></div>
              </div>
            ))}
          </div>
          <div className="h-12 bg-gray-200 rounded-2xl w-full"></div>
        </div>
      </div>
    </div>
  );
}
