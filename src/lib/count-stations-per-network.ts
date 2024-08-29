export async function countStationsPerNetwork(href: string) {
  const res = await fetch(`http://api.citybik.es${href}`)
  const data = await res.json()
  return data.network.stations.length
}
