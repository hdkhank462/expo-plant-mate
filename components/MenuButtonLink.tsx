import { Link } from "expo-router";
import { Button } from "~/components/ui/button";
import { Menu } from "~/lib/icons/Menu";

const MenuButtonLink = () => {
  return (
    <Link href={"/menu"} className="ml-3" asChild>
      <Button variant={"ghost"} size={"icon"} className="rounded-full">
        <Menu className="text-foreground" size={24} strokeWidth={2} />
      </Button>
    </Link>
  );
};

export default MenuButtonLink;
