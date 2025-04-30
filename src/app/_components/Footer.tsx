"use client";

import { Github, Code, Heart, AlertTriangle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

export default function Footer() {
  const githubRepoUrl = "https://github.com/VanishedAIR/BrainHive";

  const [showDisclaimer, setShowDisclaimer] = useState(false);
  
  return (
    <footer className="w-full border-t border-border bg-background py-6 px-4">
      <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/*BrainHive copyright*/}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Image 
              src="/logo.svg" 
              alt="BrainHive Logo" 
              width={28} 
              height={28} 
              className="mr-2"
            />
            <span className="text-primary font-medium">BrainHive</span>
          </div>
          <span className="text-muted-foreground text-sm">© {new Date().getFullYear()} BrainHive, inc.</span>
        </div>
        
        {/*"Built with" section*/}
        <div className="flex items-center gap-2 text-sm text-muted-foreground order-2 md:order-none">
          <span>Built with</span>
          <Code size={16} className="text-primary" />
          <span>and</span>
          <Heart size={16} className="text-primary fill-primary" />
        </div>

        {/*GitHub link and disclaimer button*/}
        <div className="flex items-center gap-3 order-1 md:order-none">
          {/* Disclaimer button that opens alert dialog */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary text-xs flex items-center gap-1.5 bg-primary/10 hover:bg-primary/15 px-3 py-1.5 h-auto"
            onClick={() => setShowDisclaimer(true)}
          >
            <AlertTriangle size={14} className="text-primary" />
            <span>Disclaimer</span>
          </Button>
          
          <Link 
            href={githubRepoUrl} 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-primary transition-colors text-muted-foreground h-8 px-3 py-1"
          >
            <Github size={18} />
            <span className="text-sm">GitHub</span>
          </Link>
        </div>
      </div>

      {/*Disclaimer Alert Dialog using Shadcn*/}
      <AlertDialog open={showDisclaimer} onOpenChange={setShowDisclaimer}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex justify-between items-center">
              <AlertDialogTitle className="text-primary flex items-center gap-2">
                <AlertTriangle size={18} />
                Academic Disclaimer
              </AlertDialogTitle>
            </div>
            <div className="text-sm text-muted-foreground pt-2 space-y-4">
              <p>
                This student project was created at California State University - Long Beach for educational purposes. 
                It is not a commercial product and is not intended for production use. Some features may be simplified 
                or incomplete compared to professional applications.
              </p>
              
              <p className="font-medium text-primary pt-2">Third-Party Services Notice</p>
              <p>
                This project integrates with external services, including:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Clerk (Authentication)</li>
                <li>Postgresql (Database)</li>
                <li>Prisma (Data Modeling)</li>
                <li>Neon (Serverless Postgres Platform)</li>
                <li>When2Meet (Scheduling)</li>
              </ul>
              <p>
                Each service operates under its terms of use and privacy policy. This project does not claim 
                ownership or responsibility for these third-party services.
              </p>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => setShowDisclaimer(false)}>
              I understand
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </footer>
  );
}