'use client';
import {
  LogOut,
  Settings,
  Home,
  User,
  ClipboardList,
  HelpCircle,
  UserCheck,
  UserPlus,
  School,
  Building,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FC, ReactElement } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

interface SidebarLinkProps {
  href?: string;
  icon: ReactElement;
  label: string;
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const Sidebar: FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { data } = useSession();

  const menuItems: SidebarLinkProps[] = [
    {
      href: '/admin-dashboard',
      icon: <Home size={20} />,
      label: 'Dashboard',
      active: pathname === '/admin-dashboard',
    },
    {
      href: '/players',
      icon: <User size={20} />,
      label: 'Players',
      active: pathname === '/players',
    },
    {
      href: '/memberships',
      icon: <ClipboardList size={20} />,
      label: 'Memberships',
      active: pathname === '/memberships',
    },
    {
      href: '/events',
      icon: <Calendar size={20} />,
      label: 'Events',
      active: pathname === '/events',
    },
    {
      href: '/support',
      icon: <HelpCircle size={20} />,
      label: 'Support',
      active: pathname === '/support',
    },
    {
      href: '/profile-setting',
      icon: <Settings size={20} />,
      label: 'Profile & Settings',
      active: pathname === '/profile-setting',
    },
    {
      href: '/coaches',
      icon: <UserCheck size={20} />,
      label: 'Coaches',
      active: pathname === '/coaches',
    },
    {
      href: '/arbiters',
      icon: <UserPlus size={20} />,
      label: 'Arbiters',
      active: pathname === '/arbiters',
    },
    {
      href: '/schools',
      icon: <School size={20} />,
      label: 'Schools',
      active: pathname === '/schools',
    },
    {
      href: '/clubs',
      icon: <Building size={20} />,
      label: 'Clubs',
      active: pathname === '/clubs',
    },
  ];

  // SidebarLink component defined within the main component
  const SidebarLink = ({
    href = '#',
    icon,
    label,
    active,
    onClick,
  }: SidebarLinkProps) => (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
        active
          ? 'bg-red-600 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {icon}
      {label}
    </Link>
  );

  return (
    <aside className="flex h-full w-64 flex-col bg-[#595959] text-white">
      {/* Header */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600">FedChess</h1>
      </div>

      {/* User Section */}
      <div className="border-y border-gray-700 p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium">USER: {data?.user.role}</div>
            <div className="text-sm text-gray-300">
              {data?.user.firstName + ' ' + data?.user.lastName}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => (
          <SidebarLink key={index} {...item} />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-700 p-4">
        <SidebarLink
          onClick={async (e) => {
            e.preventDefault();
            await signOut();
            router.push('/login');
          }}
          href="/login"
          icon={<LogOut size={20} />}
          label="Logout Account"
          active={false}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
