import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digital Heroes | Play with Purpose",
  description: "Join the premier club where your golf game makes a real-world impact. Subscribe, track your scores, and win rewards while supporting top charities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
