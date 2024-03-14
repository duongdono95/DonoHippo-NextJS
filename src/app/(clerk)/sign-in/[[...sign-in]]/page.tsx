import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <SignIn
        appearance={{
          elements: {
            card: {
              boxShadow: "5px 5px 10px var(--black005)",
              border: "1px solid var(--black005)",
            },
          },
        }}
      />
    </div>
  );
}
