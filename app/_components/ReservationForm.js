/* eslint-disable @next/next/no-img-element */
"use client";

import { differenceInDays } from "date-fns";
import { useState } from "react";
import { useReservation } from "./ReservationContext";
import { createBooking } from "../_lib/actions";
import SubmitButton from "./SubmitButton";

// Utility function to format numbers into Lakh and Cr
function formatToIndianCurrency(value) {
  if (value >= 10000000) {
    return `${(value / 10000000).toFixed(2)} Cr`;
  } else if (value >= 100000) {
    return `${(value / 100000).toFixed(2)} Lakh`;
  }
  return value.toLocaleString("en-IN"); // Default Indian formatting
}

function ReservationForm({ cabin, user }) {
  const { range, resetRange } = useReservation();
  const { maxCapacity, regularPrice, discount, id } = cabin;

  const startDate = range.from;
  const endDate = range.to;

  const numNights = differenceInDays(endDate, startDate);
  const cabinPrice = numNights * (regularPrice - discount) || 0;

  const [extrasPrice, setExtrasPrice] = useState(""); // Default to 0
  const totalPrice = cabinPrice + (Number(extrasPrice) || 0); // Automatically update totalPrice

  const bookingData = {
    startDate,
    endDate,
    numNights,
    cabinPrice,
    cabinId: id,
  };

  const createBookingWithData = createBooking.bind(null, bookingData);

  return (
    <div className="">
      <div className="bg-primary-800 text-primary-300 px-16 py-2 flex justify-between items-center">
        <p>Logged in as</p>
        <div className="flex gap-4 items-center">
          <img
            referrerPolicy="no-referrer"
            className="h-8 rounded-full"
            src={user.image}
            alt={user.name}
          />
          <p>{user.name}</p>
        </div>
      </div>

      <form
        action={async (formData) => {
          formData.append("totalPrice", totalPrice); // Include calculated totalPrice
          await createBookingWithData(formData);
          resetRange();
        }}
        className="bg-primary-900 py-10 px-16 text-lg flex gap-5 flex-col"
      >
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          >
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            id="observations"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            placeholder="Any pets, allergies, special requirements, etc.?"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="extrasPrice">Extras Price?</label>
          <input
            type="number"
            name="extrasPrice"
            id="extrasPrice"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            placeholder="Enter the price for extras"
            value={extrasPrice}
            onChange={(e) => {
              const value = e.target.value;
              setExtrasPrice(value ? Number(value) : 0); // Ensure it always holds a valid number
            }}
            required
          />
          <p className="text-sm text-primary-300">
            Formatted: {"₹"} {formatToIndianCurrency(Number(extrasPrice))}
          </p>
        </div>
        <div className="space-y-2">
          <label htmlFor="totalPrice">Total Price?</label>
          <input
            type="number"
            name="totalPrice"
            id="totalPrice"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            value={totalPrice} // Show calculated totalPrice
            readOnly
          />
          <p className="text-sm text-primary-300">
            Formatted: {"₹"} {formatToIndianCurrency(totalPrice)}
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="isPaid">Is Paid?</label>
          <select
            name="isPaid"
            id="isPaid"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="hasBreakfast">Has Breakfast?</label>
          <select
            name="hasBreakfast"
            id="hasBreakfast"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="status">Booking Status?</label>
          <select
            name="status"
            id="status"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          >
            <option value="unconfirmed">Unconfirmed</option>
            <option value="checked-in">Checked-in</option>
            <option value="checked-out">Checked-out</option>
          </select>
        </div>

        <div className="flex justify-end items-center gap-6">
          <p className="text-primary-300 text-base">Start by selecting dates</p>
          <SubmitButton pendingLabel="Reserving...">Reserve now</SubmitButton>
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
