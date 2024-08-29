const countryCoordinates: { [key: string]: [number, number] } = {
  US: [37.0902, -95.7129],
  DE: [51.1657, 10.4515],
  GB: [52.3555, -1.1743],
  CA: [53.9807, -122.8757],
  // Adicione mais países aqui
}

export const getCountryPosition = (country: string): [number, number] => {
  return countryCoordinates[country] || [0, 0] // Retorna [0, 0] se o país não estiver no banco de dados
}
