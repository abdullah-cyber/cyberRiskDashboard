import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useTenableVulnerabilities() {
  const { data, error, isLoading } = useSWR(
    "/api/tenable", // Adjust this endpoint to match your backend
    fetcher,
  );

  return {
    data,
    isLoading,
    isError: !!error,
  };
}
