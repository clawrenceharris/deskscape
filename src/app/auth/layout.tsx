export default function AuthLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <main className="flex justify-center bg-linear-to-br to-primary from-accent">
      {children}
    </main>
   
  );
}

