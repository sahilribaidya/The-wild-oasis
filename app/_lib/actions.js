"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBooking, getBookings } from "./data-service";
import { redirect } from "next/navigation";

export async function updateGuest(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  if (!/^[a-zA-Z0-9@\-_$%&]{6,12}$/.test(nationalID))
    throw new Error("Please provide a valid national ID");

  const updateData = { nationality, countryFlag, nationalID };

  const { error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) throw new Error("Guest could not be updated");

  revalidatePath("/account/profile");
}

export async function updateBooking(formData) {
  const bookingId = Number(formData.get("bookingId"));

  // 1) Authentication
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  // 2) Authorization
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to update this booking");

  // 3) Fetch current booking data
  const currentBooking = await getBooking(bookingId);
  if (!currentBooking) throw new Error("Booking not found");

  // 4) Building update data
  const updateData = {
    numGuests: Number(formData.get("numGuests")) || currentBooking.numGuests,
    observations:
      formData.get("observations")?.slice(0, 1000) ||
      currentBooking.observations,
    extrasPrice:
      Number(formData.get("extrasPrice")) || currentBooking.extrasPrice,
    totalPrice: Number(formData.get("totalPrice")) || currentBooking.totalPrice,
    isPaid: formData.get("isPaid") === "true",
    hasBreakfast: formData.get("hasBreakfast") === "true",
    status: formData.get("status") || currentBooking.status,
  };

  // 5) Mutation
  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId)
    .select()
    .single();

  // 6) Error handling
  if (error) throw new Error("Booking could not be updated");

  // 7) Revalidation
  revalidatePath(`/account/reservations/edit/${bookingId}`);

  // 8) Redirecting
  redirect("/account/reservations");
}

export async function createBooking(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const observations = formData.get("observations");
  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: observations.slice(0, 1000),
    extrasPrice: Number(formData.get("extrasPrice")),
    totalPrice: Number(formData.get("totalPrice")),
    isPaid: formData.get("isPaid") === "true",
    hasBreakfast: formData.get("hasBreakfast") === "true" || "false",
    status: formData.get("status"),
  };

  const { error } = await supabase.from("bookings").insert([newBooking]);

  if (error) throw new Error("Booking could not be created");

  revalidatePath(`/cabins/${bookingData.cabinId}`);

  redirect("/cabins/thankyou");
}

export async function deleteBooking(bookingId) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to delete this booking");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) throw new Error("Booking could not be deleted");

  revalidatePath("/account/reservations");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
