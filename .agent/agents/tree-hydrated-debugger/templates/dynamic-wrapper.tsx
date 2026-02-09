
import dynamic from "next/dynamic"

export const SafeDynamic = (importer) =>
  dynamic(importer, { ssr: false })
