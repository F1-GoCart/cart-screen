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
import EditQuantityDialog from "./edit-quantity";
import { Database } from "~/lib/database.types";

type AdminAuthorizationDialogProps = {
  visible: boolean;
  itemId: string | null;
  onClose: () => void;
  setScannedItems: React.Dispatch<React.SetStateAction<ScannedItem[]>>;
};

type ScannedItem = Database["public"]["Tables"]["scanned_items"]["Row"] & {
  product_details: Database["public"]["Tables"]["product_details"]["Row"];
};

const AdminAuthorizationDialog: React.FC<AdminAuthorizationDialogProps> = ({
  visible,
  itemId,
  onClose,
  setScannedItems,
}) => {
  const [isAccessGranted, setIsAccessGranted] = React.useState(false);

  const handleEnterPress = () => {
    setIsAccessGranted(true);
  };

  return (
    <>
      <Dialog open={visible && !isAccessGranted}>
        <DialogContent className="flex h-[300px] w-[500px] flex-col items-center justify-center lg:max-w-[600px]">
          <DialogHeader className="w-full text-center">
            <DialogTitle className="text-center text-lg font-bold">
              Admin Authorization
            </DialogTitle>
            <DialogDescription className="mb-5 mt-2 text-center text-sm">
              Please enter your four-digit code.
            </DialogDescription>
          </DialogHeader>
          <TextInput
            placeholder="Enter four-digit code"
            className="h-12 w-9/12 self-center rounded-lg border border-gray-300 p-4 text-center"
            secureTextEntry
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
              onPress={handleEnterPress}
              style={{ backgroundColor: "#0FA958" }}
            >
              <Text style={{ color: "white" }}>Enter</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <EditQuantityDialog
        visible={isAccessGranted}
        itemId={itemId}
        currentQuantity={1}
        onClose={() => {
          setIsAccessGranted(false);
          onClose();
        }}
        onConfirm={(newQuantity) => {
          console.log("New Quantity:", newQuantity);
          setIsAccessGranted(false);
          onClose();
        }}
        setScannedItems={setScannedItems}
      />
    </>
  );
};

export default AdminAuthorizationDialog;
