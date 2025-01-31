import SubmitButton from "@/app/_components/SubmitButton";
import { updateBooking } from "@/app/_lib/actions";
import { getBooking, getCabin } from "@/app/_lib/data-service";

export default async function Page({ params }) {
  const { bookingId } = params;

  // Fetch booking details
  const {
    numGuests,
    observations,
    cabinId,
    extrasPrice = 0,
    totalPrice = 0,
    isPaid = false,
    hasBreakfast = false,
    status = "unconfirmed",
  } = await getBooking(bookingId);

  const { maxCapacity } = await getCabin(cabinId);

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Edit Reservation #{bookingId}
      </h2>

      <form
        action={updateBooking}
        className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
      >
        <input type="hidden" value={bookingId} name="bookingId" />

        {/* Number of Guests */}
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            defaultValue={numGuests}
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          >
            <option value="">Select number of guests...</option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        {/* Extras Price */}
        <div className="space-y-2">
          <label htmlFor="extrasPrice">Extras Price</label>
          <input
            type="number"
            name="extrasPrice"
            id="extrasPrice"
            defaultValue={extrasPrice}
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            min="0"
            required
          />
        </div>

        {/* Total Price */}
        <div className="space-y-2">
          <label htmlFor="totalPrice">Total Price</label>
          <input
            type="number"
            name="totalPrice"
            id="totalPrice"
            defaultValue={totalPrice}
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            min="0"
            required
          />
        </div>

        {/* Is Paid */}
        <div className="space-y-2">
          <label htmlFor="isPaid">Is Paid?</label>
          <select
            name="isPaid"
            id="isPaid"
            defaultValue={isPaid ? "true" : "false"}
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        {/* Has Breakfast */}
        <div className="space-y-2">
          <label htmlFor="hasBreakfast">Has Breakfast?</label>
          <select
            name="hasBreakfast"
            id="hasBreakfast"
            defaultValue={hasBreakfast ? "true" : "false"}
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label htmlFor="status">Status</label>
          <select
            name="status"
            id="status"
            defaultValue={status}
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          >
            <option value="unconfirmed">Unconfirmed</option>
            <option value="checked-in">Checked-In</option>
            <option value="checked-out">Checked-Out</option>
          </select>
        </div>

        {/* Observations */}
        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            id="observations"
            defaultValue={observations}
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end items-center gap-6">
          <SubmitButton pendingLabel="Updating...">
            Update reservation
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
