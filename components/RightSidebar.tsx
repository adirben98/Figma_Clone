import React, { useRef } from "react";
import Dimensions from "./settings/Dimensions";
import Color from "./settings/Color";
import Text from "./settings/Text";
import Export from "./settings/Export";
import { RightSidebarProps } from "@/types/type";
import { modifyShape } from "@/lib/shapes";
import { Canvas } from "fabric";

export default function RightSidebar({isEditingRef,elementAttributes,setElementAttributes,fabricRef,syncShapeInStorage,activeObjectRef}:RightSidebarProps) {
  const colorInputRef=useRef(null)
  const strokeInputRef=useRef(null)
  const handleInputChange=(property:string,value:string)=>{
    if(!isEditingRef.current) isEditingRef.current=true
    setElementAttributes((prevState)=>({
      ...prevState,
      [property]:value
    }))
    modifyShape({
      canvas: fabricRef.current as Canvas,
      property,
      value,
      activeObjectRef,
      syncShapeInStorage
  })}
  return (
    <section className="flex flex-col  bg-[#14181f] text-[#c4d3ed] min-w-[227px] sticky right-0 h-full max-sm:hidden select-none  ">
      <h3 className=" px-5 pt-4 text-xs uppercase">Design</h3>
      <span className="text-xs text-[#c4d3ed] mt-3 px-5 border-b border-[#202731] pb-4">
        Make changes to canvas as you like
      </span>
      <Dimensions handleInputChange={handleInputChange} width={elementAttributes.width} height={elementAttributes.height} isEditingRef={isEditingRef}/>
      <Text handleInputChange={handleInputChange} fontFamily={elementAttributes.fontFamily} fontSize={elementAttributes.fontSize} fontWeight={elementAttributes.fontWeight}/>
      <Color attributeType="fill" inputRef={colorInputRef} attribute={elementAttributes.fill} placeholder="Color" handleInputChange={handleInputChange}/>
      <Color attributeType="stroke" inputRef={strokeInputRef} attribute={elementAttributes.stroke} placeholder="Stroke" handleInputChange={handleInputChange}/>

      <Export/>
    </section>
  );
}
