export default function generateQRData(year, tome, registryFrom, registryTo) {
  return `REG-${year}-${tome}-${registryFrom}-${registryTo}`;
}
