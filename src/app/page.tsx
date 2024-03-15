import WrapperFullWidth from "@/components/WrapperFullWidth";
import { Button } from "@mui/material";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <WrapperFullWidth>
      <div className="mx-auto py-8 max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Your marketplace for high-quality{" "}
          <span className="text-blue-600">digital assets</span>
        </h1>
        <p className="mt-6 text-lg max-w-prose text-muted-foreground">
          Welcome to DonoHippo. Every asset on our platform is verified by our
          team to ensure our highest quality standards.
        </p>
        <div className="flex gap-10 justify-center p-8 flex-wrap">
          <Button variant={"outlined"}>Browse Trending</Button>
          <Button variant="contained">
            <p>Our quality promise</p>
            <ArrowRight size={20} style={{ paddingLeft: "5px" }} />
          </Button>
        </div>
      </div>
    </WrapperFullWidth>
  );
}
