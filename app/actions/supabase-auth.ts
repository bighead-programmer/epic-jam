"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"

import prisma from "@/lib/prisma"

export async function signUp(formData: FormData) {
  const supabase = createServerActionClient({ cookies })

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string

  if (!email || !password || !name) {
    return { error: "All fields are required" }
  }

  try {
    // Check if user already exists in Prisma
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: "User with this email already exists" }
    }

    // Sign up with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })

    if (error) {
      return { error: error.message }
    }

    if (data.user) {
      // Create user in Prisma
      const user = await prisma.user.create({
        data: {
          id: data.user.id,
          email: data.user.email!,
          name,
        },
      })

      // Create wallet for user
      await prisma.wallet.create({
        data: {
          userId: user.id,
          balance: 0,
        },
      })
    }

    revalidatePath("/login")
    return { success: true }
  } catch (error: any) {
    console.error("Registration error:", error)
    return { error: "Failed to register user" }
  }
}

export async function signIn(formData: FormData) {
  const supabase = createServerActionClient({ cookies })

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error: any) {
    console.error("Login error:", error)
    return { error: "Failed to sign in" }
  }
}

export async function signOut() {
  const supabase = createServerActionClient({ cookies })

  try {
    await supabase.auth.signOut()
    revalidatePath("/")
    redirect("/")
  } catch (error) {
    console.error("Sign out error:", error)
    return { error: "Failed to sign out" }
  }
}

export async function getCurrentUser() {
  const supabase = createServerActionClient({ cookies })

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error("Get user error:", error)
    return null
  }
}
