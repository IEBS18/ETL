import React from 'react'
import logo from "../../assets/MineX.png";
import { Button } from '@/components/ui/button';
import { CircleUser } from 'lucide-react';

function Header() {
    return (
        <div>
            <header className="flex items-center justify-between p-4 bg-white border-b">
                <div className="flex items-center space-x-4">
                    {/* Left section: Arrow button and logo */}
                    {/* <Button variant="ghost" size="icon" onClick={toggleSidebar}> */}
                    {/* <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                        {isSidebarOpen ? (
                            <ChevronLeft className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </Button> */}
                    <img src={logo} className="w-30 h-[25px] mx-4" />
                </div>

                {/* Center section: Pipeline input and save button */}
                <div className="flex-1 flex items-center justify-center space-x-2">
                    {/* <span className="text-sm font-medium">Pipelines</span>
                    <span className="text-sm text-muted-foreground">&gt;</span> */}
                    {/* <Input
                        className="h-8 w-40"
                        value={flowName}
                        placeholder="Untitled Pipeline"
                        onChange={(e) => setFlowName(e.target.value)}
                    />
                    <Button variant="ghost" size="sm" onClick={handleSaveFlow}>
                        Save
                    </Button> */}
                    {/* {savedFlows.length > 0 ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-green-500 text-white hover:bg-green-600 hover:text-white"
                                >
                                    Existing Pipelines
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                {savedFlows.map((flow, index) => (
                                    <DropdownMenuItem
                                        key={index}
                                        onClick={() => handleRestoreFlow(flow)}
                                    >
                                        {flow.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-green-500 text-white"
                            disabled
                        >
                            No Saved Pipelines
                        </Button>
                    )} */}
                </div>
                {/* Right section: Welcome message and logout button */}
                <div className="flex items-center space-x-4">
                    <div className='flex flex-row gap-x-4'>
                        <CircleUser color="#95d524" />
                        <text>Hi, IEBS1 {name}</text>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default Header