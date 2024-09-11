// app/(auth)/layout.tsx
import "./globals.css";

export const metadata = {
  title: "Auth Pages",
  description: "Pages for login and registration",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
