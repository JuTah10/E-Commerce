//Framework And Functional Library
import React from 'react'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

//UI Library
import { Button } from "../../components/ui/button"
import { Separator } from "@/components/ui/separator"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "@/components/ui/app-sidebar"

// Custom Page and Components
import AdminProductPage from './AdminProductPage/AdminProductPage'
import AdminSingleProductPage from "./AdminSingleProductPage/AdminSingleProductPage"

//Set Up
const queryClient = new QueryClient()

const NavigationHeader = () => (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b">
    <div className="flex items-center gap-2 px-3">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="#">
              Admin Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Product</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  </header>
)

function AdminPage() {
return (
  <QueryClientProvider client={queryClient}>
    <SidebarProvider>
      <AppSidebar/>
      <main className='w-full'>
        <NavigationHeader/>
        <AdminProductPage/>
      </main>
    </SidebarProvider>
  </QueryClientProvider>
  )
}

export default AdminPage;
