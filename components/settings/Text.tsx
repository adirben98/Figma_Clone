import {
  fontFamilyOptions,
  fontSizeOptions,
  fontWeightOptions,
} from "@/constants";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const selectConfigs = [
  {
    property: "fontFamily",
    placeholder: "Choose a font",
    options: fontFamilyOptions,
  },
  { property: "fontSize", placeholder: "30", options: fontSizeOptions },
  {
    property: "fontWeight",
    placeholder: "Semibold",
    options: fontWeightOptions,
  },
];

type TextProps = {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  handleInputChange: (property: string, value: string) => void;
};

const Text = ({
  fontFamily,
  fontSize,
  fontWeight,
  handleInputChange,
}: TextProps) => (
  <div className='flex flex-col gap-3 border-b border-[#202731] px-5 py-3'>
    <h3 className='text-[10px] uppercase'>Text</h3>

    <div className='flex flex-col gap-3'>
      {RenderSelect({
        config: selectConfigs[0],
        fontSize,
        fontWeight,
        fontFamily,
        handleInputChange,
      })}

      <div className='flex gap-2'>
        {selectConfigs.slice(1).map((config) =>
          RenderSelect({
            config,
            fontSize,
            fontWeight,
            fontFamily,
            handleInputChange,
          })
        )}
      </div>
    </div>
  </div>
);

type Props = {
  config: {
    property: string;
    placeholder: string;
    options: { label: string; value: string }[];
  };
  fontSize: string;
  fontWeight: string;
  fontFamily: string;
  handleInputChange: (property: string, value: string) => void;
};

const RenderSelect = ({
  config,
  fontSize,
  fontWeight,
  fontFamily,
  handleInputChange,
}: Props) => (
  <Select
    key={config.property}
    onValueChange={(value) => handleInputChange(config.property, value)}
    value={
      config.property === "fontFamily"
        ? fontFamily
        : config.property === "fontSize"
          ? fontSize
          : fontWeight
    }
  >
    <SelectTrigger className='outline-none ring-0 ring-offset-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-offset-0 w-full rounded-sm border border-[#202731]'>
      <SelectValue
        placeholder={
          config.property === "fontFamily"
            ? "Choose a font"
            : config.property === "fontSize"
              ? "30"
              : "Semibold"
        }
      />
    </SelectTrigger>
    <SelectContent className='border-[#202731] bg-[#14181f] text-[#c4d3ed]'>
      {config.options.map((option) => (
        <SelectItem
          key={option.value}
          value={option.value}
          className=' hover:bg-[#56ffa6] hover:text-[#14181f]'
        >
          {option.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export default Text;
