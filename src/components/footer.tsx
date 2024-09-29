import { useState } from "react";
import { FaInfo } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className=" group items-center justify-center fixed bottom-4 right-4 text-slate-800 bg-slate-700 rounded">
      <div
        className="text-white p-2 rounded  group-hover:bg-slate-600"
        role="button"
      >
        <FaInfo />
      </div>
      <p className=" bg-slate-700 border-slate-700  border-l-slate-500 border-4 py-2 px-4 rounded text-white animate-bounce fixed right-4 -bottom-[100px] group-hover:bottom-[60px] transition-all duration-1000">
        Created by Alejandro Castro
      </p>
    </footer>
  );
}
