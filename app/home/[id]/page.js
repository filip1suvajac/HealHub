import AppInfoSpanClient from "@/app/_components/AppInfoSpanClient";
import ButtonDelete from "@/app/_components/ButtonDelete";
import MainLayout from "@/app/_components/MainLayout";
import PageHeading from "@/app/_components/PageHeading";
import { deleteAppoint, getAppoint } from "@/app/_lib/data-service";

export default async function Page({ params }) {
  const niga = params.id;

  const data = await getAppoint(niga);
  console.log(data);

  return (
    <MainLayout gep="2">
      {data.length <= 0 && "No data available"}
      <div className="p-8 bg-white dark:bg-gray-600 flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <PageHeading text={`Appointment #${niga}`} size="2xl" />
          <AppInfoSpanClient />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="dark:text-gray-200">
            Date of the appointment:{" "}
            <span className="font-semibold dark:text-white">{data.date}</span>
          </h2>
          <h2 className="dark:text-gray-200">
            Medical specialist in charge:{" "}
            <span className="font-semibold dark:text-white">
              {data.med_spec}
            </span>
          </h2>
          <h2 className="dark:text-gray-200">
            Urgency of the appointment:{" "}
            <span className="font-semibold dark:text-white">
              {data.urgency}
            </span>
          </h2>
          <h2 className="dark:text-gray-200">
            Department of the appointment:{" "}
            <span className="font-semibold dark:text-white">
              {data.department}
            </span>
          </h2>
          <h2 className="dark:text-gray-200">
            Short description of the illness/state:{" "}
            <span className="font-semibold dark:text-white">{data.desc}</span>
          </h2>
        </div>
      </div>
      <ButtonDelete niga={niga} />
    </MainLayout>
  );
}
