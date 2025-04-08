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
import { Role } from '@prisma/client';
import { useTranslation } from 'react-i18next';

interface SidebarLinkProps {
  href?: string;
  icon: ReactElement;
  label: string;
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

interface MenuItems {
  href?: string;
  icon: ReactElement;
  label: string;
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  roles: Role[];
}

const Sidebar: FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();

  const { data } = useSession();

  const menuItems: MenuItems[] = [
    {
      href: '/admin-dashboard',
      icon: <Home size={20} />,
      label: t('dashboard'),
      active: pathname === '/admin-dashboard',
      roles: ['FED_ADMIN'],
    },
    {
      href: '/players',
      icon: <User size={20} />,
      label: t('players'),
      active: pathname === '/players',
      roles: ['FED_ADMIN', 'PARENT', 'CLUB_MANAGER'],
    },
    {
      href: '/memberships',
      icon: <ClipboardList size={20} />,
      label: t('memberships'),
      active: pathname === '/memberships',
      roles: ['FED_ADMIN', 'PARENT', 'PLAYER', 'CLUB_MANAGER'],
    },
    {
      href: '/events',
      icon: <Calendar size={20} />,
      label: t('events'),
      active: pathname === '/events',
      roles: ['FED_ADMIN', 'PARENT', 'PLAYER'],
    },
    {
      href: '/support',
      icon: <HelpCircle size={20} />,
      label: t('support'),
      active: pathname === '/support',
      roles: ['FED_ADMIN', 'PARENT', 'PLAYER'],
    },
    {
      href: '/profile-setting',
      icon: <Settings size={20} />,
      label: t('profileSettings'),
      active: pathname === '/profile-setting',
      roles: ['FED_ADMIN', 'PARENT', 'PLAYER'],
    },
    {
      href: '/coaches',
      icon: <UserCheck size={20} />,
      label: t('coaches'),
      active: pathname === '/coaches',
      roles: ['FED_ADMIN', 'PARENT'],
    },
    {
      href: '/arbiters',
      icon: <UserPlus size={20} />,
      label: t('arbiters'),
      active: pathname === '/arbiters',
      roles: ['FED_ADMIN'],
    },
    {
      href: '/schools',
      icon: <School size={20} />,
      label: t('schools'),
      active: pathname === '/schools',
      roles: ['FED_ADMIN'],
    },
    {
      href: '/clubs',
      icon: <Building size={20} />,
      label: t('clubs'),
      active: pathname === '/clubs',
      roles: ['FED_ADMIN'],
    },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => data?.user.role && item.roles.includes(data.user.role)
  );

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
    <aside className="flex min-h-svh w-64 flex-col bg-[#595959] text-white">
      {/* Header */}
      <div className="p-6">
        <a
          href={
            data?.user.role === 'FED_ADMIN'
              ? '/admin-dashboard'
              : '/memberships'
          }
        >
          <h1 className="text-2xl font-bold text-red-600">FedChess</h1>
        </a>
      </div>

      {/* User Section */}
      <div className="border-y border-gray-700 p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium">
              {t('user')} {data?.user.role}
            </div>
            <div className="text-sm text-gray-300">
              {data?.user.firstName + ' ' + data?.user.lastName}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredMenuItems.map((item, index) => (
          <SidebarLink key={index} {...item} label={item.label} />
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
          label={t('logoutAccount')}
          active={false}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
