import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { areaService } from "@/services/api";
import type { CreateAreaRequest, UpdateAreaRequest } from "@/types/api.types";

export const areaKeys = {
  all: ["areas"] as const,
  lists: () => [...areaKeys.all, "list"] as const,
  details: () => [...areaKeys.all, "detail"] as const,
  detail: (id: string) => [...areaKeys.details(), id] as const,
  search: (query: string) => [...areaKeys.all, "search", query] as const,
};

export const useAreas = () => {
  return useQuery({
    queryKey: areaKeys.lists(),
    queryFn: () => areaService.getAreas(),
  });
};

export const useArea = (id: string) => {
  return useQuery({
    queryKey: areaKeys.detail(id),
    queryFn: () => areaService.getAreaById(id),
    enabled: !!id,
  });
};

export const useSearchArea = (query: string) => {
  return useQuery({
    queryKey: areaKeys.search(query),
    queryFn: () => areaService.searchArea(query),
    enabled: !!query && query.length >= 2,
  });
};

export const useCreateArea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAreaRequest) => areaService.createArea(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: areaKeys.lists() });
    },
  });
};

export const useUpdateArea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAreaRequest }) =>
      areaService.updateArea(id, data),
    onSuccess: (updatedArea) => {
      queryClient.invalidateQueries({ queryKey: areaKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: areaKeys.detail(updatedArea.id),
      });
    },
  });
};

export const useDeleteArea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => areaService.deleteArea(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: areaKeys.lists() });
    },
  });
};
