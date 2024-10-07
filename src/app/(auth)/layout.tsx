// app/(auth)/layout.tsx
import "./globals.css";

export const metadata = {
  title: "Auth Pages",
  description: "Pages for login and registration",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
