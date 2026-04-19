import { useQuery } from "@tanstack/react-query";
import { getSchools } from "../../server";
import { SchoolForDetail } from "../../infrastructure/queries";
import { schoolKeys } from "@/lib/queries";
import { ApplicationError } from "@/lib/utils/errors";

export function useSchools(select?: (data: SchoolForDetail[]) => SchoolForDetail[]) {
  return useQuery({
    queryKey: schoolKeys.all,
    queryFn: async () => {
      const result = await getSchools();
      if(!result.success){
        throw new ApplicationError(result.error);
      }
      return result.data;
    },
    select,
  });
}
