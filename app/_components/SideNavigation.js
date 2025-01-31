"use client";

import Link from "next/link";
import {
  CalendarDaysIcon,
  HomeIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import SignOutButton from "./SignOutButton";
import { usePathname } from "next/navigation";

const navLinks = [
  {
    name: "Home",
    href: "/account",
    icon: <HomeIcon className="h-5 w-5" />,
  },
  {
    name: "Reservations",
    href: "/account/reservations",
    icon: <CalendarDaysIcon className="h-5 w-5" />,
  },
  {
    name: "Guest profile",
    href: "/account/profile",
    icon: <UserIcon className="h-5 w-5" />,
  },
];

function SideNavigation() {
  const pathname = usePathname();

  return (
    <nav className="border-r border-primary-900">
      <ul className="flex flex-col gap-2 h-full text-lg">
        {navLinks.map((link) => (
          <li key={link.name}>
            <Link
              className={`py-3 px-5 hover:bg-primary-900 transition-colors flex items-start gap-4 font-semibold  
                ${pathname === link.href ? "bg-primary-900" : ""}
                `}
              href={link.href}
            >
              <span
                className={`${
                  pathname === link.href
                    ? "text-accent-400"
                    : "text-primary-600"
                }`}
              >
                {link.icon}
              </span>

              <span
                className={`${
                  pathname === link.href
                    ? "text-accent-400"
                    : "text-primary-200 hover:text-primary-100 transition-colors"
                }`}
              >
                {link.name}
              </span>
            </Link>
          </li>
        ))}

        <li className="mt-auto">
          <SignOutButton />
        </li>
      </ul>
    </nav>
  );
}

export default SideNavigation;
