// This goes in your /api/threats route

async function fetchAllThreats(): Promise<TrendMicroRawItem[]> {
  const allThreats: TrendMicroRawItem[] = [];
  let offset = 0;
  const limit = 100;
  let hasMore = true;

  while (hasMore) {
    const response = await fetchFromTrendMicro({
      limit,
      offset,
    });

    const data = response?.alerts || [];
    allThreats.push(...data);

    if (data.length < limit) {
      hasMore = false;
    } else {
      offset += limit;
    }
  }

  return allThreats;
}
