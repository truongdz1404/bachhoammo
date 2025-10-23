"use client";

import { AnimatedCollapse } from "@/components/animated-collapse";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  MessagesSquare,
  Package2,
  ShoppingBag,
  Store,
} from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { useTranslations } from "use-intl";

interface SidebarItem {
  icon?: React.ElementType;
  label: string;
  href: string;
  badge?: string;
  isActive?: boolean;
  children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  {
    icon: ShoppingBag,
    label: "orderManagement",
    href: "",
    children: [
      {
        label: "all",
        href: "#",
      },
      {
        label: "refund",
        href: "#",
      },
    ],
  },
  {
    icon: Package2,
    label: "productManagement",
    href: "",
    children: [
      {
        label: "profile",
        href: "#",
      },
      {
        label: "changePassword",
        href: "#",
      },
    ],
  },
  {
    icon: MessagesSquare,
    label: "customerSupport",
    href: "",
    children: [
      {
        label: "profile",
        href: "#",
      },
      {
        label: "changePassword",
        href: "#",
      },
    ],
  },
  {
    icon: Store,
    label: "shopManagement",
    href: "",
    children: [
      {
        label: "shopReviews",
        href: "#",
      },
      {
        label: "shopProfile",
        href: "#",
      },
    ],
  },
];

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const pathname = usePathname();

  const [expandedItems, setExpandedItems] = useState<string[]>([]);

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

  return (
    <div className={cn("text-sm w-fit min-w-64", className)}>
      <nav>
        {activeItems.map((item, index) => (
          <div key={index} className="py-2">
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
          "w-full flex items-center p-1 py-1.5 h-auto text-foreground/80 hover:text-primary transition-all duration-200 rounded-md cursor-pointer group",
          isChild && "text-foreground",
          !isChild && "gap-x-4 font-medium",
          item.isActive && "text-primary"
        )}
      >
        <div className="flex items-center gap-2 flex-1">
          {Icon && (
            <Icon
              className={cn(
                "size-4 transition-transform duration-200 group-hover:scale-110",
                isChild && "size-3"
              )}
            />
          )}

          <span className="flex-1 transition-all duration-200 capitalize">
            {t(item.label)}
          </span>
        </div>
        {hasChildren && (
          <ChevronDown
            className={cn(
              "size-4 transition-transform duration-200 group-hover:scale-110"
            )}
          />
        )}
      </div>
    </Link>
  );
};

export default Sidebar;
