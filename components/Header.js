import Link from 'next/link';
import { useRouter } from 'next/router';

const navItems = [
  { href: '/', label: 'Products' },
  { href: '/attributes', label: 'Attributes' },
  { href: '/attribute-groups', label: 'Attribute Groups' },
  { href: '/tags', label: 'Tags' },
  { href: '/tools', label: 'Tools' },
  { href: '/admin', label: 'Admin' }
];

export default function Header() {
  const router = useRouter();

  return (
    <header style={headerStyle}>
      <nav style={navStyle} aria-label="Main">
        <div style={brandStyle}>Simple PIM</div>
        <div style={linksWrapperStyle}>
          {navItems.map((item) => {
            const active = router.pathname === item.href || router.pathname.startsWith(item.href + '/');
            return (
              <Link key={item.href} href={item.href} passHref>
                <a
                  style={{
                    ...linkStyle,
                    ...(active ? activeLinkStyle : null)
                  }}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </a>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}

const headerStyle = {
  background: '#1f2937',
  color: '#fff'
};

const navStyle = {
  maxWidth: 1200,
  margin: '0 auto',
  padding: '0.5rem 1rem',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem'
};

const brandStyle = {
  fontWeight: 600
};

const linksWrapperStyle = {
  display: 'flex',
  gap: '0.5rem',
  flexWrap: 'wrap'
};

const linkStyle = {
  padding: '0.25rem 0.5rem',
  borderRadius: 4,
  textDecoration: 'none',
  color: '#d1d5db'
};

const activeLinkStyle = {
  color: '#fff',
  background: '#111827'
};
