import { Suspense } from "react";
import LoadingSpinner from "./LoadingSpinner";
import AppointmentsList from "./AppointmentList";

export default function DataMenu() {
  return (
    <div className="border mt-12 border-gray-300 text-base bg-white dark:bg-gray-600 rounded-md overflow-hidden">
      <div className="grid grid-cols-[0.9fr_1.8fr_1.2fr_1.4fr] gap-x-6 items-center p-4 bg-grey-50 border-b border-gray-300 uppercase tracking-wide font-semibold">
        <div className="dark:text-white">Date</div>
        <div className="dark:text-white">Department</div>
        <div className="dark:text-white">Urgency</div>
        <div className="dark:text-white">Medical Specialist</div>
      </div>
      <section className="h-72 flex flex-col justify-start overflow-auto">
        <Suspense fallback={<LoadingSpinner />}>
          <AppointmentsList />
        </Suspense>
      </section>
    </div>
  );
}
