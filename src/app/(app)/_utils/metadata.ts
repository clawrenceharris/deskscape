import { getDeskById } from "@/actions/desk/getDeskById";

/** Page metadata helper for desk-scoped routes (extend for notebook titles when needed). */
export async function getCurrentDeskOrNotebookTitle(currentDeskId: string) {
  const currentDesk = await getDeskById(currentDeskId);
  if (!currentDesk.success) {
    return {
      title: "DeskShare",
      description: "Your own virtual desk for sharing your school notes and materials",
    };
  }
  const deskTitle = `${currentDesk.data?.name ?? "Desk"}`;

  return {
    title: deskTitle,
    description: "Your own virtual desk for sharing your school notes and materials",
  };
}