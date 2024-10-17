import React from "react";

interface props {
  isActive: boolean;
  name: string;
}

const Filter = ({ isActive, name }: props) => {
  return (
    <div
      className={`border-2 border-black ${isActive ? "bg-light-yellow" : "bg-background"}  px-[8px] py-[2px] font-bungee text-[16px]`}
    >
      {name}
    </div>
  );
};

export default Filter;
