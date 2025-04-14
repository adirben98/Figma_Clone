import { exportToPdf } from "@/lib/utils";

import { Button } from "../ui/button";

const Export = () => (
  <div className='flex flex-col gap-3 px-5 py-3'>
    <h3 className='text-[10px] uppercase'>Export</h3>
    <Button
      variant='outline'
      className='cursor-pointer w-full border border-[#2b303b] hover:bg-[#56ffa6] hover:text-[#14181f]'
      onClick={exportToPdf}
      
    >
      Export to PDF
    </Button>
  </div>
);

export default Export;
