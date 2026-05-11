import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <SignUp 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-brand-orange hover:bg-orange-600 transition-colors',
            footerActionLink: 'text-brand-orange hover:text-orange-600',
            card: 'shadow-xl rounded-3xl border-slate-100',
          }
        }}
      />
    </div>
  );
}
