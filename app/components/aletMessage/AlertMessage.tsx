import React from "react";

function AlertMessage({ text, no, yes }: { text: string, no: () => void, yes: () => void }) {
  return (
    <div className="bg-white relative w-115 h-30 rounded-lg text-black p-4">
      <p>{text}</p>

      <div className="w-full flex items-center justify-end space-x-4 absolute -bottom-9 h-full right-2">
        <button onClick={yes} className="bg-green-500 cursor-pointer text-white p-2 rounded-lg w-20">
          Yes
        </button>
        <button onClick={no} className="bg-red-500 cursor-pointer text-white p-2 rounded-lg w-20">
          No
        </button>
      </div>
    </div>
  );
}

export default AlertMessage;
