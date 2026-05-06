import { ProfileButton } from "@/components/shared";
import { AvatarGroup, AvatarGroupCount } from "@/components/ui";
import { useDesk } from "../../hooks/useDesk";
import {  LoadingState } from "@/components/states";
import { APP_ROUTES, DeskSection, useDeskContext } from "@/app/providers";
import { useRouter } from "next/navigation";
import Image, { type StaticImageData } from "next/image";
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
import { DeskSectionCard } from "../ui";

type DeskDetailsColumnProps = {
    deskId: string | null;
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
    hover: { y: -42, rotate: 12, scale: 1 },
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
    hover: { y: -120, rotate: -10, scale: 0.98 },
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
export function DeskDashboardColumn({deskId}: DeskDetailsColumnProps) {
  const { data: desk, isLoading } = useDesk(deskId);
  const { setCurrentSection } = useDeskContext();
  const router = useRouter();
  function handleTabClick(tab: DeskSection) {
    setCurrentSection(tab);
    if(!deskId) return;
    if(tab === DeskSection.chalkboard) {
      router.push(APP_ROUTES.deskChalkboard(deskId));
      return;
    }
    router.push(APP_ROUTES.desk(deskId));
  }
  if(isLoading) return <LoadingState />;
  if(!desk) return null;
  return (
    
    <div className="h-full flex flex-col flex-1">
      <div className="flex flex-[0.3] relative">
          <div style={{
            backgroundSize: "cover",
            backgroundImage: "url(https://i.ibb.co/N6q6BGpt/desk.png)",
          }} className="absolute inset-0 w-full h-full" />
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/60 w-full h-full" />
          <div className="absolute text-white px-4 py-2 bottom-0 left-0 flex items-center justify-between w-full">
            
            
            <div className="flex items-center gap-2 bg-white rounded-full px-2 py-1 text-black">

              <div className="size-2 bg-green-500 rounded-full" />
                <p>2 online</p>
              </div>

              <AvatarGroup  className="flex items-center bg-white rounded-full p-1 text-black">
                {desk.members.slice(0, 3).map((member) => (
                  <span key={member.profile.userId} onClick={e => e.stopPropagation()}>
                    <ProfileButton tabIndex={-1} disabled size="icon-sm" profile={member.profile} />
                  </span>
                ))}
                {desk.members.length > 3 &&
                  <AvatarGroupCount className="text-foreground size-[20px] bg-secondary-foreground">
                    +{desk.members.length - 3}
                  </AvatarGroupCount>
                }
              </AvatarGroup>
            </div>


          </div>
          <div className="grid grid-cols-2 grid-rows-2 w-full h-full flex-1 gap-2 p-3">
     
      
            <DeskSectionCard
              label="Notebooks"
              section={DeskSection.notebooks}
              supplies={notebookSupplies}
              onClick={() => handleTabClick(DeskSection.notebooks)}
            />
           

            <DeskSectionCard
              label="Chalkboard"
              section={DeskSection.chalkboard}
              supplies={chalkboardSupplies}
              onClick={() => handleTabClick(DeskSection.chalkboard)}
            />
            <DeskSectionCard
              label="Burning Questions"
              section={DeskSection.burningQuestions}
              supplies={burningQuestionsSupplies}
              onClick={() => handleTabClick(DeskSection.burningQuestions)}
            />
            <DeskSectionCard
              label="Study Rooms"
              section={DeskSection.studyRooms}
              supplies={studyRoomsSupplies}
              onClick={() => handleTabClick(DeskSection.studyRooms)}
            />
          <div/>
        <div/>
      </div>
    </div>
   
  );
}
