import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Race with ATXR Academy | Global Racing Opportunities",
  description: "Join ATXR Academy and race across global motorsport series. From F4 to GT3, we provide the path to your racing career. Professional coaching, testing, and full team support available.",
  keywords: "racing academy, motorsport, F4, F3, GT3, race driver, racing career, driver development, racing school",
}

export default function RaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
} 