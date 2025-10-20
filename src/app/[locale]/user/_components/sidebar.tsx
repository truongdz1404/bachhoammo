"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/hooks/use-user";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  Bell,
  Edit,
  Flag,
  Lock,
  OctagonAlert,
  ShoppingBag,
  User as UserIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { useTranslations } from "use-intl";
import { AnimatedCollapse } from "./animated-collapse";

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string;
  isActive?: boolean;
  children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  {
    icon: Bell,
    label: "notifications",
    href: "",
    children: [
      {
        icon: Flag,
        label: "orderUpdates",
        href: "/user/notifications/order",
      },
      {
        icon: OctagonAlert,
        label: "systemUpdates",
        href: "/user/notifications/system",
      },
    ],
  },
  {
    icon: UserIcon,
    label: "myAccount",
    href: "",
    children: [
      {
        icon: Edit,
        label: "profile",
        href: "/user/account/profile",
      },
      {
        icon: Lock,
        label: "changePassword",
        href: "/user/account/change-password",
      },
    ],
  },
  {
    icon: ShoppingBag,
    label: "myPurchase",
    href: "/user/purchase",
  },
];

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const pathname = usePathname();
  const t = useTranslations("sidebar");
  const { data: user } = useUser();
  const { data: session } = useSession();

  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const username = user?.fullName || session?.user?.name || "No Name";
  const isExpanded = (label: string) => {
    return expandedItems.includes(label);
  };

  const activeItems = useMemo(() => {
    const isActive = (href: string) =>
      pathname === href || pathname.startsWith(href + "/");

    const items = sidebarItems.map((item) => {
      return {
        ...item,
        isActive: item.children ? false : isActive(item.href),
        children: item.children?.map((child) => ({
          ...child,
          isActive: isActive(child.href),
        })),
      };
    });

    const activeParentItem = items.find((item) =>
      item.children?.some((child) => child.isActive)
    );

    const activeRootItem = items.find(
      (item) => !item.children && item.isActive
    );

    setExpandedItems((prev) => {
      let newExpanded: string[] = [];

      if (activeParentItem) {
        newExpanded = [activeParentItem.label];
      } else if (activeRootItem) {
        newExpanded = [];
      } else {
        return prev;
      }

      return JSON.stringify(newExpanded) !== JSON.stringify(prev)
        ? newExpanded
        : prev;
    });

    return items;
  }, [pathname]);

  const toggleExpand = (label: string, hasChildren: boolean) => {
    setExpandedItems((prev) => {
      if (hasChildren) {
        return prev.includes(label) ? prev : [label];
      }
      return [];
    });
  };
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  return (
    <div className={cn("text-sm w-48", className)}>
      <div className="border-b border-border pb-4">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10 bg-primary-foreground text-primary">
            <AvatarImage
              src={user?.avatarUrl ?? ""}
              alt={username}
              className="object-cover w-full h-full"
            />
            <AvatarFallback className="text-sm bg-background">
              {getInitials(username)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 truncate">
            <span className="text-sm font-medium">{username}</span>
            <Link
              href="/user/account/profile"
              className="flex items-center gap-2 text-sm text-foreground/80 capitalize"
            >
              <Edit className="size-3" />
              {t("editProfile")}
            </Link>
          </div>
        </div>
      </div>

      <nav className="mt-4">
        {activeItems.map((item, index) => (
          <div key={index}>
            <SidebarItem item={item} onToggle={toggleExpand} />
            {item.children && (
              <AnimatedCollapse isOpen={isExpanded(item.label)}>
                {item.children.map((child, childIndex) => (
                  <SidebarItem
                    key={childIndex}
                    item={child}
                    isChild
                    onToggle={toggleExpand}
                  />
                ))}
              </AnimatedCollapse>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

interface SidebarItemProps {
  item: SidebarItem;
  isChild?: boolean;
  onToggle: (label: string, hasChildren: boolean) => void;
}

const SidebarItem = ({ item, isChild = false, onToggle }: SidebarItemProps) => {
  const t = useTranslations("sidebar");
  const Icon = item.icon;
  const hasChildren = item.children && item.children.length > 0;

  const getHref = () => {
    if (hasChildren && item.children && item.children.length > 0) {
      return item.children[0].href;
    }
    return item.href;
  };

  const handleClick = () => {
    if (!isChild) {
      onToggle(item.label, hasChildren || false);
    }
  };

  return (
    <Link href={getHref()}>
      <div
        onClick={handleClick}
        className={cn(
          "w-full flex items-center p-1 py-1.5 h-auto hover:text-primary transition-all duration-200 rounded-md cursor-pointer group",
          isChild && "text-foreground/80",
          item.isActive && "text-primary"
        )}
      >
        <div className="flex items-center gap-2 flex-1">
          <Icon
            className={cn(
              "size-4 transition-transform duration-200 group-hover:scale-110",
              isChild && "size-3"
            )}
          />
          <span className="flex-1 transition-all duration-200 capitalize">
            {t(item.label)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default Sidebar;
