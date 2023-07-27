//export a toaster function
import toast from "react-hot-toast";

export const notifyToasterSuccess = (msg: string) => toast.success(msg);
export const notifyToasterError = (msg: string) => toast.error(msg);
