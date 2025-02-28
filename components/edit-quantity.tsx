import * as React from "react";
import { TextInput } from "react-native";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";

type EditQuantityDialogProps = {
  visible: boolean;
  currentQuantity: number;
  onClose: () => void;
  onConfirm: (newQuantity: number) => void;
};

const EditQuantityDialog: React.FC<EditQuantityDialogProps> = ({
  visible,
  currentQuantity,
  onClose,
  onConfirm,
}) => {
  const [quantity, setQuantity] = React.useState(currentQuantity.toString());

  React.useEffect(() => {
    if (visible) {
      setQuantity(currentQuantity.toString());
    }
  }, [visible, currentQuantity]);

  const handleConfirm = () => {
    const newQuantity = Number(quantity);
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      onConfirm(newQuantity);
    } else {
      alert("Please enter a valid quantity.");
    }
  };

  return (
    <Dialog open={visible}>
      <DialogContent className="flex h-[250px] w-[400px] flex-col items-center justify-evenly">
        <DialogHeader className="w-full text-center">
          <DialogTitle className="text-center text-lg font-bold">
            Edit Quantity
          </DialogTitle>
        </DialogHeader>
        <TextInput
          value={quantity}
          onChangeText={(text) => {
            if (/^\d*$/.test(text)) {
              setQuantity(text);
            }
          }}
          keyboardType="numeric"
          className="h-12 w-9/12 self-center rounded-lg border border-gray-300 p-4 text-center"
        />
        <DialogFooter className="mt-6 flex flex-row items-center justify-center gap-4">
          <Button
            onPress={onClose}
            variant="outline"
            style={{ borderColor: "#0FA958" }}
          >
            <Text style={{ color: "#0FA958" }}>Cancel</Text>
          </Button>
          <Button
            onPress={handleConfirm}
            style={{ backgroundColor: "#0FA958" }}
          >
            <Text style={{ color: "white" }}>Confirm</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditQuantityDialog;
