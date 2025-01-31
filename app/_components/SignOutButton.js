import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { signOutAction } from "../_lib/actions";
import SpinnerMini from "./SpinnerMini";
import { useTransition } from "react";

function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  function handleSignOut() {
    if (confirm("Are you sure you want to sign out?"))
      startTransition(() => SignOutButton());
  }

  return (
    <form action={signOutAction} onClick={handleSignOut}>
      <button className="py-3 px-5 hover:bg-primary-900 hover:text-primary-100 transition-colors flex items-start gap-4 font-semibold text-primary-200 w-full">
        <ArrowRightOnRectangleIcon className="h-5 w-5 text-primary-600" />
        {isPending ? "Signout..." : "Sign out"}
      </button>
    </form>
  );
}

export default SignOutButton;
