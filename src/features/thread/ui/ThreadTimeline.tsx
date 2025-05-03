import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FaCheck } from "react-icons/fa";

// Mockup timeline entries
const timelineEntries = [
  {
    id: 1,
    date: "October 12, 2023",
    time: "9:30 AM",
    title: "Project Kickoff",
    content: "We held our initial meeting with key stakeholders to define the project scope and objectives. The session was highly productive, with detailed discussions about project timelines, resource allocation, and key deliverables. We established clear communication channels and set up regular check-in meetings to ensure project alignment. The team also discussed potential challenges and mitigation strategies, setting a solid foundation for the project's success.",
    tags: ["Meeting", "Planning"]
  },
  {
    id: 2,
    date: "October 15, 2023",
    time: "11:45 AM",
    title: "Research Phase",
    content: "Our team conducted an extensive market analysis and competitor research to inform our strategic direction. We analyzed current market trends, identified key competitors, and evaluated their strengths and weaknesses. The research revealed several opportunities for differentiation and innovation. We also conducted user interviews to better understand customer needs and pain points, which will help shape our product development strategy.",
    tags: ["Research", "Analysis"]
  },
  {
    id: 3,
    date: "October 23, 2023",
    time: "2:15 PM",
    title: "Design Sprint",
    content: "We organized a collaborative design workshop that brought together designers, developers, and product managers. The sprint focused on creating initial mockups and user flows, with particular attention to user experience and interface design. Through rapid prototyping and iterative feedback, we developed several key design concepts. The team also established design guidelines and component libraries to ensure consistency across the platform.",
    tags: ["Design", "Workshop"]
  },
  {
    id: 4,
    date: "November 5, 2023",
    time: "10:00 AM",
    title: "Development Begins",
    content: "The development phase kicked off with a focus on implementing core functionality. Our engineering team began setting up the development environment, establishing coding standards, and creating the initial project structure. We prioritized building the fundamental features that would serve as the foundation for more complex functionality. Regular code reviews and pair programming sessions were implemented to maintain code quality and knowledge sharing.",
    tags: ["Development", "Coding"]
  },
  {
    id: 5,
    date: "November 18, 2023",
    time: "3:30 PM",
    title: "First Prototype",
    content: "We successfully completed the first working prototype, marking a significant milestone in our development process. The prototype includes all core features and demonstrates the basic user flow. Internal testing revealed several areas for improvement, particularly in performance optimization and user interface refinements. The team is now gathering detailed feedback to inform the next iteration of development.",
    tags: ["Prototype", "Testing"]
  },
  {
    id: 6, 
    date: "December 3, 2023",
    time: "1:45 PM",
    title: "User Testing",
    content: "We conducted comprehensive user testing sessions with our target audience to gather valuable feedback on the prototype. The sessions included both moderated and unmoderated testing scenarios, allowing us to observe real user interactions and pain points. Participants provided detailed feedback on usability, feature preferences, and overall user experience. The insights gathered will directly influence our next development phase and feature prioritization.",
    tags: ["Testing", "User Research"]
  }
];

export function ThreadTimeline() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pb-16">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm ">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 max-w-3xl mx-auto w-full">
          <Link href="/" className="font-medium text-base text-foreground/80 hover:text-foreground transition-colors">Timeline</Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 w-full">
        <div className="max-w-3xl mx-auto pt-10 pb-8 px-4 sm:px-6">
          
          {/* Timeline entries */}
          <div className="space-y-7">
            {timelineEntries.slice().reverse().map((entry) => (
              <div key={entry.id} className="group relative">
                {/* Date label */}
                <div className="mb-4 flex items-center">
                  <FaCheck className="h-3 w-3 text-foreground mr-2" />
                  <time className="text-sm font-bold text-foreground/70">{entry.date} <span className="font-normal ml-1">{entry.time}</span></time>
                </div>
                
                {/* Entry content - using border-left for the timeline */}
                <div className="px-5 border-l border-foreground ">
                  <div>
                    <h3 className="text-xl mb-3">{entry.title}</h3>
                    <p className="text-foreground/70 mb-4 text-base/relaxed">{entry.content}</p>
                    
                    <div className="flex flex-wrap gap-1.5">
                      {entry.tags.map((tag) => (
                        <span 
                          key={tag} 
                          className="text-xs px-2 py-0.5 rounded-md border border-foreground/20 bg-foreground/5 text-foreground/70 cursor-default"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 