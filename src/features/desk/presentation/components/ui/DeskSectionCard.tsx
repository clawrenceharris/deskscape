import { DeskSection } from "@/app/providers/HomeNavigationProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { cn } from "@/lib/utils";
import { motion, type TargetAndTransition } from "motion/react";
import type { ReactNode } from "react";

type DeskSectionSupply = {
  id: string;
  className?: string;
  children: ReactNode;
  rest: TargetAndTransition;
  hover: TargetAndTransition;
};

type DeskSectionCardProps = {
  section: DeskSection;
  onClick?: (section: DeskSection) => void;
  supplies?: DeskSectionSupply[];
  label: string;
  disabled?: boolean;
}


export function DeskSectionCard({ section, label, onClick, supplies =[], disabled = false }: DeskSectionCardProps) {
  
  return (
    <motion.div
      className="flex h-full w-full flex-1 cursor-pointer"
      initial="rest"
      animate="rest"
      whileHover="hover"
      onClick={() => onClick?.(section)}
      aria-disabled={disabled}
    >
      <Card 
        className={cn(`
          
          flex
          items-start
          justify-start
          h-full
          w-full
          relative
          p-0
          flex-col
          transition-all duration-300 ease-in-out
          shadow-md
          ring-0
          overflow-hidden
          rounded-lg
          hover:bg-white
          `,
          disabled && "pointer-events-none",
          {
            "text-secondary": section === DeskSection.notebooks,
            "text-primary": section === DeskSection.chalkboard,
            "text-orange-500": section === DeskSection.burningQuestions,
            "text-tertiary": section === DeskSection.studyRooms,
          }
        )} 
      >
        <CardHeader className="relative z-20 px-3 py-5 rounded-t-lg w-full ">
          <CardTitle className="font-bold text-lg">
            <h3>

            {label}
            </h3>
            </CardTitle>
        </CardHeader>

        <CardContent
          className={cn(
            "w-full h-full p-0 absolute bottom-0 pointer-events-none flex",
          )}
          style={{
            background: (() => {
              if (section === DeskSection.notebooks)
                return "radial-gradient(circle at 50% -150%, var(--color-secondary) 0%, transparent 80%)";
              if (section === DeskSection.chalkboard)
                return "radial-gradient(circle at 50% -150%, var(--color-primary) 0%, transparent 80%)";
              if (section === DeskSection.burningQuestions)
                return "radial-gradient(circle at 50% -150%, var(--color-accent) 0%, transparent 80%)"; // purple-500
              if (section === DeskSection.studyRooms)
                return "radial-gradient(circle at 50% -150%, var(--color-tertiary) 0%, transparent 80%)";
              return undefined;
            })(),
          }}
        >
   
              {supplies.map((supply, index) => (
                <motion.div
                  key={supply.id}
                  className={cn("absolute origin-top z-10", supply.className, "bottom-0 right-0")}
                  variants={{
                    rest: supply.rest,
                    hover: supply.hover,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 22,
                    delay: index * 0.045,
                  }}
                >
                  {supply.children}
                </motion.div>
              ))}
           

        

        </CardContent>
      </Card>
    </motion.div>
  );
}