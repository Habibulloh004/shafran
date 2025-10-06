import React from 'react';

export default function SidebarItem({ icon: Icon, label, isActive, onClick, isExit }) {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer w-full flex items-center gap-3 px-3 py-2  ${
        isExit
          ? 'text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/30'
          : isActive
          ? 'text-blue-600 dark:text-blue-400'
          : 'text-gray-700 dark:text-gray-300'
      }`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="max-md:hidden font-medium text-sm sm:text-base">{label}</span>
    </button>
  );
}
