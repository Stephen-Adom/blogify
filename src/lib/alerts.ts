import Swal from "sweetalert2";
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export const Alert = (severity: any, title: string, message: string) => {
  Swal.fire(title, message, severity);
};

export const ToastAlert = (severity: any, title: string) => {
  Toast.fire({
    icon: severity,
    title,
  });
};
