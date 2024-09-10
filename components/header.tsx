import Link from 'next/link';

const Header = () => {
  return (
    <header className="flex justify-between items-center h-16 px-6 bg-background">
      <div className="text-2xl font-bold text-primary">
        devboard.
      </div>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="text-foreground hover:text-primary transition-all border-b border-current border-dashed opacity-70 hover:opacity-100 duration-300 ease-in-out pb-[2px]">
              Home
            </Link>
          </li>
          <li>
            <Link href="https://x.com/voltycodes" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-all border-b border-current border-dashed opacity-70 hover:opacity-100 duration-300 ease-in-out pb-[2px]">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
