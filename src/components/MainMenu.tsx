import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import ModeToggle from "./ModeToggle";

export default function MainMenu() {
  return (
    <Menubar className="draggable-titlebar w-full">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
      </MenubarMenu>
      <ModeToggle />
    </Menubar>
  );
}
