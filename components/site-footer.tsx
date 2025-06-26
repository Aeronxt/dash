import Link from "next/link"
import Image from "next/image"
import { Icons } from "@/components/icons"

export function SiteFooter() {
  return (
    <footer className="bg-black text-secondary-foreground py-12">
      <div className="container flex flex-col items-center justify-center gap-4">
        <Icons.logo 
          src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/webimages//atxrlog%20white%20(1).png"
          alt="ATXR Racing Logo"
          className="h-20 w-20"
        />
        <span className="font-montserrat text-lg">© {new Date().getFullYear()} ATXR Racing. All rights reserved.</span>
        
        <div className="flex flex-col items-center mt-4">
          <span className="text-sm text-muted-foreground mb-2">Powered by:</span>
          <a 
            href="https://www.aeronxtt.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-80"
          >
            <Image
              src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/webimages/aerondropshad.png"
              alt="Aeron Logo"
              width={120}
              height={40}
              className="h-auto"
            />
          </a>
        </div>
      </div>
    </footer>
  )
}