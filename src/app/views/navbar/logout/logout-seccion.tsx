"use client"

import * as React from "react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu"
import LogoutButton from '@/app/login/logoutButton'
import Cookies from 'js-cookie'

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={className}
          {...props}
        >
          {children}
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

export function NavigationMenuDemo() {
  const [isMounted, setIsMounted] = useState(false)
  const [rol, setRol] = useState<string | null>(null)

  useEffect(() => {
    setIsMounted(true)
    setRol(Cookies.get('rol') || null)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <NavigationMenu className=" text-sm font-geist max-md:hidden">
      <NavigationMenuList className="">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="px-6 gap-3 capitalize text-blue-600 hover:text-blue-600 rounded-md h-8 bg-transparent">
            {rol && <p className="text-sm font-semibold">{rol}</p>}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="">
            <ul className="">
                <LogoutButton />
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
