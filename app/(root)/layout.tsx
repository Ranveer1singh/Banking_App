import SideBar from "@/components/SideBar";
import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const loggedIn = {firstName : "Ranveer", lastName : "Singh"}
  return (
   <main className="flex h-screen w-full font-inter">
    <SideBar 
    user = {loggedIn}
    />
    <div className="flex size-full flex-col">
      <div className="root-layout">
        <Image src='/icons/logo.svg'
        alt="menu icons" 
        width={30}
        height={30}
        />
        <div >

        </div>
      </div>
    {children}
    </div>
   </main>
  );
}
