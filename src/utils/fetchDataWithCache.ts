export const fetchDataWithCache = async <T>(
  url: string,
  cacheKey: string,
  cacheDuration: number,
  options?: RequestInit
): Promise<T> => {
  const cachedData = localStorage.getItem(cacheKey)
  const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`)
  const now = Date.now()

  if (
    cachedData &&
    cacheTimestamp &&
    now - parseInt(cacheTimestamp) < cacheDuration
  ) {
    return JSON.parse(cachedData)
  }

  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error(
      `Failed to fetch data: ${response.status} ${response.statusText}`
    )
  }

  const data = await response.json()

  localStorage.setItem(cacheKey, JSON.stringify(data))
  localStorage.setItem(`${cacheKey}_timestamp`, now.toString())

  return data
}
