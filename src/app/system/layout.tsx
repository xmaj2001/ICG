export default function SystemLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-10 py-10">{children}</main>
  );
}
