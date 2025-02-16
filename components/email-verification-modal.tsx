import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription, 
    DialogFooter, 
} from "@/components/ui/dialog";

// Define types for the modal props
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SignUpSuccessModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription>Email sent! Please check your email for the verification code.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpSuccessModal;
