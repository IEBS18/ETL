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


// import { Link } from "react-router-dom";
// import { Home, Cog, BarChart2, FileText, Settings, User,Boxes, BookOpenText } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import logo from "@/assets/logo.png";

// const sidebarItems = [
//   { icon: Home, href: "/about-us" },
//   { icon: Boxes, href: "/tool" },
//   { icon: FileText, href: "/report" },
//   // { icon: BarChart2, href: "/data" },
// ];

// export default function Sidebar({ isOpen }) {
//   return (
//     <div
//       className={`flex flex-col h-screen bg-white text-black transition-all duration-300 ${
//         isOpen ? "w-[200px]" : "w-[50px]",
//         isOpen ? "flex" : "hidden"
//       } fixed top-0 left-0`}
//     >
//       <div className="p-2">
//         <img src={logo} alt="logo" className="w-8 h-8" />
//       </div>
//       <nav className="flex flex-col gap-2 p-2 justify-between h-full">
//         <div className=" flex flex-col gap-2">
//         {sidebarItems.map((item) => (
//           <Button
//             key={item.href}
//             variant="ghost"
//             size="icon"
//             asChild
//             className={cn("w-10 h-10 p-0")}
//           >
//             <Link to={item.href}>
//               <item.icon className="h-5 w-5" />
//             </Link>
//           </Button>
//         ))}
//         </div>
//         <div className="flex flex-col gap-2 p-2 z-50">
//           <Button
//             variant="ghost"
//             size="icon"
//             asChild
//             className={cn("w-10 h-10 p-0")}
//           >
//             <Link to='/user'>
//               <User className="h-5 w-5" />
//             </Link>
//           </Button>
//           <Button
//             variant="ghost"
//             size="icon"
//             asChild
//             className={cn("w-10 h-10 p-0")}
//           >
//             <Link to='/user'>
//               <BookOpenText className="h-5 w-5" />
//             </Link>
//           </Button>
//           <Button
//             variant="ghost"
//             size="icon"
//             asChild
//             className={cn("w-10 h-10 p-0")}
//           >
//             <Link to='/user'>
//               <Settings className="h-5 w-5" />
//             </Link>
//           </Button>
//       </div>
//       </nav>

//     </div>
//   );
// }
import { Link, useNavigate } from "react-router-dom";
import { Home, Cog, FileText, User, Boxes, BookOpenText, ChartLine, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/Group.png";

const topItems = [
  { icon: Home, href: "/about-us", text: "Home" },
  { icon: Boxes, href: "/tool", text: "Tools" },
  { icon: FileText, href: "/report", text: "Report" },
  { icon: ChartLine, href: "/visualization", text: "Visualize" },

];

const bottomItems = [
  { icon: User, href: "/user", text: "Account" },
  { icon: BookOpenText, href: "/documentation", text: "Manual" },
  { icon: Cog, href: "/settings", text: "Settings" },
];

export default function Sidebar({ isOpen }) {

  const navigate = useNavigate();

  const handleLogout = async () => {
    const user_id = localStorage.getItem('user_minex_id');
    // Clear user_id from localStorage and navigate to the home page
    localStorage.removeItem('user_minex_id');
    navigate('/');
  };
  return (
    <div
      className={`flex flex-col justify-between h-screen bg-white text-black w-auto`}
    >
      <div className={`flex flex-col`}>
        <div className="pt-2 mt-4">
          <img src={logo} alt="logo" className="w-1/2 mx-auto" />
        </div>
        {/* 
        <div className="flex flex-col pt mt-10 ml-10 ">
          <h1 className="font-roboto text-[20px] font-bold leading-[23.44px] text-left">About InsiMine:</h1>
          <p className="font-roboto mt-4 text-[16px] leading-[18.75px] text-left">InsiMine is a trusted AI & Analytics-based solutions provider empowering pharmaceutical and healthcare industries to make informed, data-driven decisions.</p>
        </div> */}

        <div className="h-auto mt-[30px] rounded-tr-[39px] rounded-br-[39px] mr-2">
          <nav className="flex flex-col text-black gap-2 py-4 px-2 justify-start">
            {topItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                size="icon"
                asChild
                className="w-10 h-10 px-1 flex flex-col mx-auto justify-start"
              >
                <Link to={item.href}>
                  <item.icon className="h-5 w-5" />
                  <text className="">{item.text}</text>
                </Link>
              </Button>
            ))}
          </nav>
          <div className={`flex flex-col mt-10 text-black gap-2 py-4 px-2`}>
            {bottomItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                size="icon"
                asChild
                className="w-10 h-10 px-1 flex flex-col mx-auto justify-start"
              >
                <Link to={item.href}>
                  <item.icon className="h-5 w-5" />
                  <text className="">{item.text}</text>
                </Link>
              </Button>
            ))}
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="w-10 h-10 px-1 flex flex-col mx-auto justify-start cursor-pointer"
              
            >
              <div onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
                <text className="">Log Out</text>
              </div>

            </Button>
          </div>
        </div>

      </div>
      {/* <div className={`flex flex-col gap-2 p-2`}>
        {bottomItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            size="icon"
            asChild
            className="w-10 h-10 p-0 mx-auto"
          >
            <Link to={item.href}>
              <item.icon className="h-5 w-5" />
            </Link>
          </Button>
        ))}
      </div> */}
    </div>
  );
}
