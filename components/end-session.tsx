import * as React from "react";
import { Modal, TextInput, TouchableOpacity, View } from "react-native";
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
import { Database } from "~/lib/database.types";

type EndSessionModal = {
  visible: boolean;
  //   itemId: string | null;
  //   onClose: () => void;
  //   setScannedItems: React.Dispatch<React.SetStateAction<ScannedItem[]>>;
  onCancel: () => void;
  onDeactivate: () => void;
};

const EndSessionModal: React.FC<EndSessionModal> = ({
  visible,
  onCancel,
  onDeactivate,
}) => {
  return (
    <>
      <Modal transparent visible={visible} animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="h-[370px] w-[550px] flex-col rounded-2xl bg-white p-10 shadow-lg">
            <View className="flex-1 justify-center">
              <Text className="text-center text-4xl font-light text-[#0FA958]">
                ARE YOU SURE YOU WANT TO DEACTIVATE THIS CART?
              </Text>
            </View>

            <View className="mb-6">
              <TouchableOpacity
                onPress={onDeactivate}
                className="mx-auto w-1/2 rounded-lg bg-[#0FA958] px-6 py-4"
              >
                <Text className="text-center text-lg font-semibold text-white">
                  Deactivate Cart
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onCancel}
                className="mx-auto mt-5 w-1/2 rounded-lg border border-[#0FA958] px-6 py-4"
              >
                <Text className="text-center text-lg font-semibold text-[#0FA958]">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default EndSessionModal;
