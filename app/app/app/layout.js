import './globals.css';

export const metadata = {
  title: 'مدير مجموعة الأنمي',
  description: 'منصة لإدارة مجموعتك من الأنمي ورفع المستندات والفيديوهات',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
