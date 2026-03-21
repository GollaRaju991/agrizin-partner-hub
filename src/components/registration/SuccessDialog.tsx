import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { CheckCircle2 } from "lucide-react";

interface SuccessDialogProps {
  open: boolean;
  onClose: () => void;
}

const SuccessDialog = ({ open, onClose }: SuccessDialogProps) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-[340px] rounded-2xl p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9 text-primary" />
          </div>
          <h3 className="font-heading font-bold text-lg text-foreground leading-snug">
            Thank You!
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Thank you for choosing Agrizin Partner. Your application has been
            successfully submitted. Our team will contact you shortly for
            verification.
          </p>
        </div>
        <AlertDialogFooter className="mt-4 sm:justify-center">
          <AlertDialogAction
            onClick={onClose}
            className="w-full h-11 rounded-xl font-heading font-bold text-sm"
          >
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SuccessDialog;
