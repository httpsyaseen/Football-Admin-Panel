import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function DeleteDialog({ modal, setModal, handleDelete }) {
  return (
    <Dialog open={modal} onOpenChange={setModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete?</p>
        <div className="flex justify-end space-x-4">
          <Button variant="ghost" onClick={() => setModal(false)}>
            No
          </Button>
          <Button
            onClick={handleDelete}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            Yes, Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
