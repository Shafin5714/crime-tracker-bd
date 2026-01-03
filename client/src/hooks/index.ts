// ============================================================================
// Hooks - Barrel export
// ============================================================================

export { useAuth, useCurrentUser, useLogin, useRegister, useLogout, authKeys } from "./useAuth";
export {
  useCrimes,
  useCrime,
  useHeatmapData,
  useCrimesNearby,
  useSubmitCrime,
  useUpdateCrime,
  useDeleteCrime,
  useValidateCrime,
  crimeKeys,
} from "./useCrimes";
export {
  useUsers,
  useUser,
  useUpdateUserRole,
  useBanUser,
  useUnbanUser,
  userKeys,
} from "./useUsers";
