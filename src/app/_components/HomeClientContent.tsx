"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

export default function HomeClientContent() {
  return (
    <div className="flex-1">
      <div className="flex w-[70%] flex-col mx-auto">
        <div className="w-[50%] p-4 mx-auto mb-16">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pr-10 py-6 px-4 h-12 rounded-md border-2 border-black dark:border-white outline-none"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <img src="/search.svg" alt="Search" className="w-full h-full" />
            </button>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-[20%] p-4">
            <div>
              <h1 className="text-center text-2xl font-semibold py-3 mb-3">
                Filters
              </h1>
            </div>
            <Collapsible className="w-full mb-8">
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border-2 border-black dark:border-white p-4">
                <span>Subject</span>
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 space-y-2">
                <div className="rounded-md border-2 border-black/20 dark:border-white/20 p-4">
                  <select className="w-full bg-transparent outline-none dark:bg-[#1c1b22] dark:text-white">
                    <option value="option1" className="dark:bg-[#1c1b22]">
                      Computer Science
                    </option>
                    <option value="option2" className="dark:bg-[#1c1b22]">
                      Calculus 1
                    </option>
                    <option value="option3" className="dark:bg-[#1c1b22]">
                      Calculus 2
                    </option>
                  </select>
                </div>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible className="w-full">
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border-2 border-black dark:border-white p-4">
                <span>Location</span>
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 space-y-2">
                <div className="rounded-md border-2 border-black/20 dark:border-white/20 p-4">
                  <select className="w-full bg-transparent outline-none dark:bg-[#1c1b22] dark:text-white">
                    <option value="option1" className="dark:bg-[#1c1b22]">
                      Long Beach, CA
                    </option>
                    <option value="option2" className="dark:bg-[#1c1b22]">
                      Lakewood, CA
                    </option>
                    <option value="option3" className="dark:bg-[#1c1b22]">
                      Carson, CA
                    </option>
                    <option value="option3" className="dark:bg-[#1c1b22]">
                      Cerritos, CA
                    </option>
                    <option value="option3" className="dark:bg-[#1c1b22]">
                      Artesia, CA
                    </option>
                    <option value="option3" className="dark:bg-[#1c1b22]">
                      Norwalk, CA
                    </option>
                  </select>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
          <div className="w-[75%] p-4 border-2 border-black rounded-xl dark:border-white"></div>
        </div>
      </div>
    </div>
  );
}
