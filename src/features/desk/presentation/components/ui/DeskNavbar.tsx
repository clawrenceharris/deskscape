import { Button } from "@/components/ui";
import { Bell, Home, Settings, Users } from "lucide-react";
import { DeskSection, useHomeNavigation } from "@/app/providers/HomeNavigationProvider";
import { DeskSectionCard } from "./DeskSectionCard";
import Image, { StaticImageData } from "next/image";
import notebook from "@/assets/notebook.png";
import paperclip from "@/assets/paperclip.png";
import papers from "@/assets/papers.png";
import pencil from "@/assets/pencil.png";
import chalkboard from "@/assets/chalkboard.png";
import coloredPencils from "@/assets/colored-pencils.png";
import comingSoon from "@/assets/coming-soon.png";
import laughingFace from "@/assets/laughing-face.png";
import heartEyes from "@/assets/heart-eyes.png";
import thumbtack from "@/assets/thumbtack.png";
import { cn } from "@/lib/utils";
import { useDeskContext } from "@/app/providers";

function DeskNavButton({selected, icon, onClick }: { selected: boolean; icon: React.ReactNode; onClick: () => void }) {
  return (
    <Button className={cn("bg-card text-foreground shadow-md hover:bg-card/30 border border-muted", selected && "bg-secondary text-white hover:bg-secondary/80")}  size="icon-lg" onClick={onClick} variant="tertiary">
      {icon}
    </Button>
  );
}
export function DeskNavbar() {
  const { handleSectionClick } = useHomeNavigation();
  const { currentSection } = useDeskContext();
  return (
    <nav className="flex-1 flex flex-col gap-2">

      <ul className="flex flex-row gap-2 justify-evenly border-b py-3">
        <li>
          <DeskNavButton selected={currentSection === DeskSection.home} icon={<Home   className="size-5"/>} onClick={() => handleSectionClick(DeskSection.home)} />
        </li>
        <li>
         <DeskNavButton selected={currentSection === DeskSection.members} icon={<Users   className="size-5"/>} onClick={() => handleSectionClick(DeskSection.members)} />
        </li>
        <li>
          <DeskNavButton selected={currentSection === DeskSection.notifications} icon={<Bell   className="size-5"/>} onClick={() => handleSectionClick(DeskSection.notifications)} />
        </li>
        <li>
          <DeskNavButton selected={currentSection === DeskSection.settings} icon={<Settings   className="size-5"/>} onClick={() => handleSectionClick(DeskSection.settings)} />
        </li>
      
      </ul>
      <div className="grid grid-cols-2 grid-rows-2 w-full h-full flex-1 gap-2 p-3">
    
    
          <DeskSectionCard
            label="Notebooks"
            section={DeskSection.notebooks}
            supplies={notebookSupplies}
            onClick={handleSectionClick}
          />
          

          <DeskSectionCard
            label="Chalkboard"
            section={DeskSection.chalkboard}
            supplies={chalkboardSupplies}
            onClick={handleSectionClick}
          />
          <DeskSectionCard
            label="Burning Questions"
            section={DeskSection.burningQuestions}
            disabled={true}
            supplies={burningQuestionsSupplies}
            onClick={handleSectionClick}
          />
          <DeskSectionCard
            label="Study Rooms"
            disabled={true}
            section={DeskSection.studyRooms}
            supplies={studyRoomsSupplies}
            onClick={handleSectionClick}
          />
        </div>
    </nav>
  );
}




function SupplyImage({ src, alt, className }: { src: StaticImageData; alt: string; className: string }) {
  return (
    <div className={className}>
      <Image
        src={src}
        alt={alt}
        fill
        draggable={false}
        className="object-contain drop-shadow-md select-none"
        sizes="96px"
      />
    </div>
  );
}

const notebookSupplies = [
  {
    id: "papers",
    className: "left-4 bottom-12",
    rest: { y: 50, rotate: -10, scale: 0.9 },
    hover: { y: -18, rotate: 30, scale: 1 },
    children: <SupplyImage src={papers} alt="Papers" className="relative h-20 w-16" />,
  },
  {
    id: "notebook",
    className: "left-16 bottom-13",
    rest: { y: 0, rotate: 6, scale: 0.9 },
    hover: { y: -17, rotate: 12, scale: 1 },
    children: <SupplyImage src={notebook} alt="Notebook" className="relative h-28 w-28" />,
  },
  {
    id: "paperclip",
    className: "left-30 bottom-13",
    rest: { y: 50, rotate: 18, scale: 0.82 },
    hover: { y: -10, rotate: 0, scale: 0.95 },
    children: <SupplyImage src={paperclip} alt="Paper clip" className="relative h-14 w-14" />,
  },
  {
    id: "pencil",
    className: "left-20 bottom-5",
    rest: { y: 50, rotate: 0, scale: 0.82 },
    hover: { y: -44, rotate: 10, scale: 0.95 },
    children: <SupplyImage src={pencil} alt="Pencil" className="relative h-24 w-24" />,
  },
];

const chalkboardSupplies = [
  {
    id: "chalkboard",
    className: "left-5 bottom-13 z-10",
    rest: { y: 0, rotate: -8, scale: 0.82 },
    hover: { y: -42, rotate: -16, scale: 0.96 },
    children: <SupplyImage src={chalkboard} alt="Chalkboard" className="relative h-30 w-30" />,
  },
  {
    id: "colored-pencils",
    className: "left-23 bottom-10 z-1",
    rest: { y: 50, rotate: 0, scale: 0.82 },
    hover: { y: -100, rotate: -10, scale: 0.98 },
    children: <SupplyImage src={coloredPencils} alt="Colored pencils" className="relative h-17 w-17" />,
  },
  
  
  {
    id: "laughing-face",
    className: "left-22 bottom-7",
    rest: { y: 50, rotate: 16, scale: 0.7 },
    hover: { y: -30, rotate: 4, scale: 0.86 },
    children: <SupplyImage src={laughingFace} alt="Laughing face" className="relative h-13 w-13" />,
  },
  {
    id: "heart-eyes",
    className: "left-0 bottom-11",
    rest: { y: 50, rotate: -20, scale: 0.72 },
    hover: { y: -28, rotate: -34, scale: 0.88 },
    children: <SupplyImage src={heartEyes} alt="Heart eyes" className="relative h-13 w-13" />,
  },
];

const studyRoomsSupplies = [
  {
    id: "study-rooms",
    className: "left-5 bottom-13 z-10",
    rest: { y: 0, rotate: -45, scale: 0.82 },
    hover: { y: -32, rotate: -16, scale: 0.96 },
    children: <SupplyImage src={comingSoon} alt="Study rooms" className="relative h-20 w-20" />,
  },
  {
    id: "thumbtack",
    className: "left-5 bottom-13 z-10",
    rest: { y: 50, rotate: -45, scale: 0.82 },
    hover: { y: -32, rotate: -16, scale: 0.96 },
    children: <SupplyImage src={thumbtack} alt="Thumbtack" className="relative h-10 w-10" />,
  },
];
const burningQuestionsSupplies = [
  {
    id: "burning-questions",
    className: "left-5 bottom-13 z-10",
    rest: { y: 0, rotate: -45, scale: 0.82 },
    hover: { y: -32, rotate: -16, scale: 0.96 },
    children: <SupplyImage src={comingSoon} alt="Burning questions" className="relative h-20 w-20" />,
  },
  {
    id: "thumbtack",
    className: "left-5 bottom-13 z-10",
    rest: { y: 50, rotate: -45, scale: 0.82 },
    hover: { y: -44, rotate: -16, scale: 0.96 },
    children: <SupplyImage src={thumbtack} alt="Thumbtack" className="relative h-10 w-10" />,
  },
];