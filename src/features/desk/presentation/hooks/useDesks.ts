import { useQuery } from "@tanstack/react-query";
import { DeskForDetail } from "../../infrastructure/queries";
import { getDesks } from "../../server";

export function useDesks(select?: (data: DeskForDetail[]) => DeskForDetail[]) {
  return useQuery({
    queryKey: ['desks'],
    queryFn: async () => {
      const result = await getDesks();
      if(!result.success){
        throw new Error(result.error);
      }
      return result.data;
    },
    select,
  });
}