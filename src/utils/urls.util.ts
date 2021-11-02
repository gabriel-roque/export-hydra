export function formatLinkDownload(pathFileName: string): string {
  return `${process.env.DOMAIN}:${process.env.PORT}/${pathFileName}`;
}
