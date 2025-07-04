'use client'

import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { AdminMenus } from "@/data/Sidebar/menu";

interface Props {
    children: ReactNode;
}

const IndexLayout: React.FC<Props> = ({ children }) => {
    return (
        <div className="flex lg:bg-[#ecebeb]">
            <div className="hidden lg:block">
                <Sidebar menus={AdminMenus} />
            </div>
            <div className="lg:ml-[200px] xl:ml-[240px] 2xl:ml-[260px] w-full bg-[#F8F9FA] lg:rounded-tl-[31px] lg:rounded-bl-[31px]">
                <Header />
                <main className="mt-[3rem] sm:mt-[4.6rem] lg:mt-[4.6rem] 2xl:mt-[5rem] px-4 py-4 sm:py-4 2xl:px-8">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default IndexLayout;