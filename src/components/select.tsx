import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/interfaces/useIUser";
import { User2 } from "lucide-react";
import { getInfoBytoken } from "@/utils/decoded";

interface SelectScrollableProps {
  items: string[] ;
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
}

export function SelectScrollable({
  items,
  value,
  onValueChange,
  label = "Select an option",
}: SelectScrollableProps) {
  return (
    <Select value={value} onValueChange={onValueChange} > 
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent className="max-h-40  overflow-y-auto">
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {items.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}


interface SelectUserScrollableProps {
  items: User[] ;
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
}

export function UserScrollable({
  items,
  value,
  onValueChange,
  label = "Select an option",
}: SelectUserScrollableProps) {
  return (
    <Select value={value} onValueChange={onValueChange} > 
      <SelectTrigger className="w-[270px]">
        <SelectValue/>
      </SelectTrigger>
      <SelectContent className="max-h-40  overflow-y-auto">
        <SelectGroup>
        
          <SelectLabel>{label}</SelectLabel>
       
          {items.map((item) => (
            <SelectItem key={item.id} value={item.id as string}>
              <div className="flex gap-2 items-center">
                  <User2></User2>
                  
                  <div className="flex gap-2">
                  <h1>{item.email}  </h1>
                 <h2>{getInfoBytoken()?.userId === item.id ? " - ADM" : " - " +item.name}</h2>
                  </div>


                  <div className={`h-2 w-2  rounded-full ${item.isActive  ? "bg-green-300" : "bg-red-300"}`}>

                  </div>
          
                 
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}