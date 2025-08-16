import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';

const navItems = [
  { href: '/', label: 'Products' },
  { href: '/attributes', label: 'Attributes' },
  { href: '/attribute-groups', label: 'Attribute Groups' },
  { href: '/tags', label: 'Tags' },
  {
    label: 'Tools',
    href: '/tools',
    children: [
      { href: '/tools/attribute-suggest', label: 'Attribute Suggest' },
      { href: '/tools/name-suggest', label: 'Name Suggest' },
      { href: '/tools/slugify', label: 'Slugify' },
    ],
  },
  {
    label: 'Admin',
    href: '/admin',
    children: [
        { href: '/admin/dashboard', label: 'Dashboard' },
        { href: '/admin/products', label: 'Products' },
        { href: '/admin/attributes', label: 'Attributes' },
        { href: '/admin/attribute-groups', label: 'Attribute Groups' },
        { href: '/admin/bulk-tags', label: 'Bulk Tags' },
        { href: '/admin/ai-tools', label: 'AI Tools' },
        { href: '/admin/sample-products', label: 'Sample Products' },
    ],
  },
];

export default function Header() {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);

  const handleMenuToggle = (label) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setOpenMenu(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header style={headerStyle}>
      <nav style={navStyle} aria-label="Main">
        <div style={brandStyle}>Simple PIM</div>
        <div style={linksWrapperStyle} ref={menuRef}>
          {navItems.map((item) => {
            const active = (item.href && (router.pathname === item.href || router.pathname.startsWith(item.href + '/')));
            const isDropdownOpen = openMenu === item.label;

            if (item.children) {
              return (
                <div key={item.label} style={{ position: 'relative' }}>
                  <button
                    onClick={() => handleMenuToggle(item.label)}
                    style={{ ...linkStyle, background: 'none', border: 'none', cursor: 'pointer', color: active ? '#fff' : '#d1d5db' }}
                    aria-haspopup="true"
                    aria-expanded={isDropdownOpen}
                  >
                    {item.label}
                  </button>
                  {isDropdownOpen && (
                    <div style={dropdownStyle}>
                      {item.children.map((child) => {
                        const childActive = router.pathname === child.href;
                        return (
                          <Link key={child.href} href={child.href} passHref>
                            <a style={{ ...dropdownLinkStyle, ...(childActive ? activeLinkStyle : null) }}>
                              {child.label}
                            </a>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link key={item.href} href={item.href} passHref>
                <a
                  style={{
                    ...linkStyle,
                    ...(active ? activeLinkStyle : null),
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
  color: '#fff',
};

const navStyle = {
  maxWidth: 1200,
  margin: '0 auto',
  padding: '0.5rem 1rem',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
};

const brandStyle = {
  fontWeight: 600,
};

const linksWrapperStyle = {
  display: 'flex',
  gap: '0.5rem',
  flexWrap: 'wrap',
  alignItems: 'center',
};

const linkStyle = {
  padding: '0.25rem 0.5rem',
  borderRadius: 4,
  textDecoration: 'none',
  color: '#d1d5db',
  display: 'inline-block',
  fontFamily: 'sans-serif',
  fontSize: '16px',
};

const activeLinkStyle = {
  color: '#fff',
  background: '#111827',
};

const dropdownStyle = {
  position: 'absolute',
  top: '100%',
  left: 0,
  background: '#1f2937',
  borderRadius: 4,
  padding: '0.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  zIndex: 10,
  minWidth: '150px',
  border: '1px solid #374151',
};

const dropdownLinkStyle = {
  ...linkStyle,
  display: 'block',
  width: '100%',
};
