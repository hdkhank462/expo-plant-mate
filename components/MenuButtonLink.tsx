import { Link } from "expo-router";
import { Button } from "~/components/ui/button";
import { Menu } from "~/lib/icons/Menu";

const MenuButtonLink = () => {
  return (
    <Link href={"/menu"} className="ml-3" asChild>
      <Button variant={"ghost"} size={"icon"}>
        <Menu className="text-foreground" size={26} strokeWidth={1.25} />
      </Button>
    </Link>
  );
};

export default MenuButtonLink;
