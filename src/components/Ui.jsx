import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"
import { ChevronLeft, Share, Play, Settings } from "lucide-react"

export default function Ui() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Pipelines</span>
            <span className="text-sm text-muted-foreground">&gt;</span>
            <Input 
              className="h-8 w-40"
              defaultValue="Untitled Pipeline"
            />
          </div>
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="bg-green-500 text-white hover:bg-green-600">
            Changes Deployed
          </Button>
          <Button variant="ghost" size="icon">
            <Share className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Play className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>
      <Tabs defaultValue="general" className="flex-grow">
        <TabsList className="bg-background border-b px-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="llms">LLMs</TabsTrigger>
          <TabsTrigger value="knowledge-base">Knowledge Base</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="data-loaders">Data Loaders</TabsTrigger>
          <TabsTrigger value="multi-modal">Multi-Modal</TabsTrigger>
          <TabsTrigger value="logic">Logic</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>
        <div className="p-4 flex-grow bg-gray-50">
          <div className="grid grid-cols-3 gap-4">
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
              <svg className="h-8 w-8 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
              Input
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
              <svg className="h-8 w-8 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              Output
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
              <svg className="h-8 w-8 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 3v4a1 1 0 001 1h4" />
                <path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" />
              </svg>
              Text
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
              <svg className="h-8 w-8 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M10 8l6 4-6 4V8z" />
              </svg>
              Pipeline
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
              <svg className="h-8 w-8 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 3L3 21" />
                <path d="M21 21L3 3" />
              </svg>
              Transform
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
              <svg className="h-8 w-8 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              File Save
            </Button>
          </div>
        </div>
      </Tabs>
      {/* <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
        <Button variant="outline" size="icon">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </Button>
        <Button variant="outline" size="icon">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14" />
          </svg>
        </Button>
        <Button variant="outline" size="icon">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          </svg>
        </Button>
        <Button variant="outline" size="icon">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </Button>
      </div> */}
    </div>
  )
}
