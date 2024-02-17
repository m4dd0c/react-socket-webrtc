import React from "react";

const MsgCard = ({ sender, text, dir }) => {
  console.log(sender);
  return (
    <div
      className={`flex ${
        dir === "r" ? "justify-end" : "justify-start"
      } items-center`}
    >
      {dir === "l" && (
        <div className="rounded-full uppercase grid place-items-center font-extrabold h-9 w-9 mx-3 bg-orange-300">
          {sender}
        </div>
      )}
      <div className="max-w-[45vw] bg-emerald-400 px-4 py-2 rounded-lg mt-2">
        {text}
      </div>
      {dir === "r" && (
         <div className="rounded-full uppercase grid place-items-center font-extrabold h-9 w-9 mx-3 bg-orange-300">
         {sender}
       </div>
      )}
    </div>
  );
};

export default MsgCard;
