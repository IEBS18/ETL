// import { Link } from "react-router-dom";
// import { Home, Cog, BarChart2, FileText, Users, Settings } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import logo from "@/assets/logo.png";
// const sidebarItems = [
//   { icon: Home, href: "/" },
//   { icon: FileText, href: "/processes" },
//   { icon: BarChart2, href: "/data" },
//   { icon: Users,href: "/relations" },
//   { icon: Cog, href: "/settings" },
// ];

// export default function Sidebar({isOpen}) {
 
//   return (
//     <div className="flex flex-col h-screen w-[50px] bg-zinc-800 text-black"  style={{ display: isOpen ? 'block' : 'none', width: '50px', background: '#fff', position: 'fixed', height: '100%' }}>
//       <div className="p-2">
//         <img src={logo} alt="logo" className="w-10 h-10"/>
//       </div>
//       <nav className="flex-1 flex flex-col gap-2 p-2">
//         {sidebarItems.map((item) => (
//           <Button
//             key={item.href}
//             variant="ghost"
//             size="icon"
//             asChild
//             className={cn(
//               "w-10 h-10 p-0",
//             )}
//           >
//             <Link to={item.href}>
//               <item.icon className="h-5 w-5" />
//             </Link>
//           </Button>
//         ))}
//       </nav>
//       <div className="p-2">
//         <Button variant="ghost" size="icon" className="w-10 h-10 p-0">
//           <Settings className="h-5 w-5" />
//         </Button>
//       </div>
//     </div>
//   );
// }


import { Link } from "react-router-dom";
import { Home, Cog, BarChart2, FileText, Settings, User,Boxes, BookOpenText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const sidebarItems = [
  { icon: Home, href: "/about-us" },
  { icon: Boxes, href: "/tool" },
  { icon: FileText, href: "/report" },
  // { icon: BarChart2, href: "/data" },
];

export default function Sidebar({ isOpen }) {
  return (
    <div
      className={`flex flex-col h-screen bg-white text-black transition-all duration-300 ${
        isOpen ? "w-[200px]" : "w-[50px]",
        isOpen ? "flex" : "hidden"
      } fixed top-0 left-0`}
    >
      <div className="p-2">
        <img src={logo} alt="logo" className="w-8 h-8" />
      </div>
      <nav className="flex flex-col gap-2 p-2 justify-between h-full">
        <div className=" flex flex-col gap-2">
        {sidebarItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            size="icon"
            asChild
            className={cn("w-10 h-10 p-0")}
          >
            <Link to={item.href}>
              <item.icon className="h-5 w-5" />
            </Link>
          </Button>
        ))}
        </div>
        <div className="flex flex-col gap-2 p-2 z-50">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className={cn("w-10 h-10 p-0")}
          >
            <Link to='/user'>
              <User className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className={cn("w-10 h-10 p-0")}
          >
            <Link to='/user'>
              <BookOpenText className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className={cn("w-10 h-10 p-0")}
          >
            <Link to='/user'>
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
      </div>
      </nav>

    </div>
  );
}
