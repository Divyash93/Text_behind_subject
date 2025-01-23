import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const handleExportImage = () => {
    // Logic to export the image goes here
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              Text Behind Subject
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg transition-all ${
                pathname === '/'
                  ? 'bg-white/10 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Home
            </Link>
            <Link
              href="/editor"
              className={`px-4 py-2 rounded-lg transition-all ${
                pathname === '/editor'
                  ? 'bg-white/10 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Editor
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
