import { Link } from "expo-router";
import { Button } from "~/components/ui/button";
import { Search } from "~/lib/icons/Search";

const SearchButtonLink = () => {
  return (
    <Link href={"/search/[query]"} className="ml-3" asChild>
      <Button variant={"ghost"} size={"icon"}>
        <Search className="text-foreground" size={24} strokeWidth={2} />
      </Button>
    </Link>
  );
};

export default SearchButtonLink;
