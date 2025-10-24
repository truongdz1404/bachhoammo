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
import React, { useEffect, useMemo, useState } from "react";
import { useTranslations } from "use-intl";

interface SidebarItem {
  icon?: React.ElementType;
  label: string;
  href: string;
  badge?: string;
  isActive?: boolean;
  defaultExpand?: boolean;
  children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  {
    icon: ShoppingBag,
    label: "orderManagement",
    href: "#",
    defaultExpand: true,
    children: [
      {
        label: "all",
        href: "/seller/[shopId]/orders",
      },
      {
        label: "refund",
        href: "/seller/[shopId]/orders/refund",
      },
    ],
  },
  {
    icon: Package2,
    label: "productManagement",
    href: "#",
    defaultExpand: true,
    children: [
      {
        label: "allProducts",
        href: "/seller/[shopId]/products",
      },
      {
        label: "addProduct",
        href: "/seller/[shopId]/products/add",
      },
    ],
  },
  {
    icon: MessagesSquare,
    label: "customerSupport",
    href: "#",
    defaultExpand: false,
    children: [
      {
        label: "chatManagement",
        href: "/seller/[shopId]/chats",
      },
      {
        label: "reviewManagement",
        href: "/seller/[shopId]/reviews",
      },
    ],
  },
  {
    icon: Store,
    label: "shopManagement",
    href: "#",
    defaultExpand: true,
    children: [
      {
        label: "shopReviews",
        href: "/seller/[shopId]/statistics",
      },
      {
        label: "shopProfile",
        href: "/seller/[shopId]/profile",
      },
      {
        label: "myComplaints",
        href: "/seller/[shopId]/complaints",
      },
    ],
  },
];

const getActPath = (shopId: string | undefined, href: string) =>
  shopId
    ? href.replace("[shopId]", shopId)
    : href.replace("[shopId]", "[shopId]");

const getInitialExpandedItems = (
  items: SidebarItem[],
  pathname: string,
  shopId?: string
) => {
  const expandedSet = new Set<string>();

  items.forEach((item) => {
    if (item.defaultExpand && item.children) {
      expandedSet.add(item.label);
    }

    if (item.children) {
      const hasActiveChild = item.children.some((child) => {
        const resolved = getActPath(shopId, child.href);
        return pathname === resolved || pathname.startsWith(resolved + "/");
      });

      if (hasActiveChild) {
        expandedSet.add(item.label);
      }
    }
  });

  return Array.from(expandedSet);
};

interface SidebarProps {
  className?: string;
  shopId?: string;
}

const Sidebar = ({ className, shopId }: SidebarProps) => {
  const pathname = usePathname();

  const [expandedItems, setExpandedItems] = useState<string[]>(() =>
    getInitialExpandedItems(sidebarItems, pathname, shopId)
  );

  useEffect(() => {
    const activeParentItem = sidebarItems.find((item) => {
      if (!item.children) return false;
      return item.children.some((child) => {
        const resolved = getActPath(shopId, child.href);
        return pathname === resolved || pathname.startsWith(resolved + "/");
      });
    });

    if (activeParentItem) {
      setExpandedItems((prev) => {
        if (prev.includes(activeParentItem.label)) return prev;
        return [...prev, activeParentItem.label];
      });
    }
  }, [pathname, shopId]);

  const isExpanded = (label: string) => {
    return expandedItems.includes(label);
  };

  const activeItems = useMemo(() => {
    const isActive = (href: string) => {
      const resolved = getActPath(shopId, href);
      return pathname === resolved || pathname.startsWith(resolved + "/");
    };

    const items = sidebarItems.map((item) => {
      return {
        ...item,
        href: getActPath(shopId, item.href),
        isActive: item.children ? false : isActive(item.href),
        children: item.children?.map((child) => ({
          ...child,
          href: getActPath(shopId, child.href),
          isActive: isActive(child.href),
        })),
      };
    });

    return items;
  }, [pathname, shopId]);

  const toggleExpand = (label: string, hasChildren: boolean) => {
    setExpandedItems((prev) => {
      if (!hasChildren) return prev;

      const set = new Set(prev);
      if (set.has(label)) {
        set.delete(label);
      } else {
        set.add(label);
      }

      return Array.from(set);
    });
  };

  return (
    <div className={cn("text-sm w-fit min-w-64", className)}>
      <nav>
        {activeItems.map((item, index) => (
          <div key={index} className="py-2">
            <SidebarItem
              item={item}
              onToggle={toggleExpand}
              isExpanded={isExpanded(item.label)}
            />
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
  isExpanded?: boolean;
  onToggle: (label: string, hasChildren: boolean) => void;
}

const SidebarItem = ({
  item,
  isChild = false,
  isExpanded = false,
  onToggle,
}: SidebarItemProps) => {
  const t = useTranslations("sidebar");
  const Icon = item.icon;
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (!isChild) {
      onToggle(item.label, hasChildren || false);
    }
  };

  return (
    <Link href={item.href}>
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
              "size-4 transition-transform duration-200 group-hover:scale-110",
              isExpanded && "rotate-180"
            )}
          />
        )}
      </div>
    </Link>
  );
};

export default Sidebar;
