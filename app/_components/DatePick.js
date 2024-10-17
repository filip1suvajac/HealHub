import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function DatePick() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        className="w-80"
        label="Choose the date"
        slotProps={{ textField: "" }}
      />
    </LocalizationProvider>
  );
}
