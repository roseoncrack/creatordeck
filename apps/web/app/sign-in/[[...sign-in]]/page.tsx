import { SignIn } from "@clerk/nextjs";

export const metadata = {
  title: "Sign in",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <SignIn
        appearance={{
          elements: {
            rootBox: "w-full max-w-md",
            card: "bg-card border border-border shadow-purple-glow-sm",
          },
        }}
      />
    </div>
  );
}
