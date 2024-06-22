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
    <NavigationMenu className=" text-sm" style={{ fontFamily: 'Roboto', }}>
      <NavigationMenuList className="">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="px-8 gap-3 capitalize text-blue-600 hover:text-blue-600 rounded-sm h-8 bg-blue-600/5">
            {rol && <p className="font-semibold text-sm">{rol}</p>}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="">
            <ul className="grid max-md:w-[155px] md:w-[150px] lg:grid-cols-[1fr]">
                <LogoutButton />
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
