import { SignUp } from "@clerk/nextjs";

export const metadata = {
  title: "Sign up",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <SignUp
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
