import React, { useEffect, useState } from "react";
import { TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { useDraggable } from "@dnd-kit/react";

type EditableTabsTriggerProps = {
  id: string;
  name: string;
  onChange: (newName: string) => void;
};

function EditableTabsTrigger({ id, name, onChange }: EditableTabsTriggerProps) {
  const [editedName, setEditedName] = useState(name);
  const [beingEdited, setBeingEdited] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const { ref: dragRef } = useDraggable({
    id: "draggable-" + id,
  });

  useEffect(() => {
    if (beingEdited && inputRef.current) {
      inputRef.current.focus();
    }
  }, [beingEdited]);

  return beingEdited ? (
    <Input
      ref={inputRef}
      className="field-sizing-content"
      value={editedName}
      onChange={(e) => {
        setEditedName(e.target.value);
      }}
      onBlur={(e) => {
        setBeingEdited(false);
        onChange(e.target.value);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          setBeingEdited(false);
          onChange(editedName);
        }
      }}
    />
  ) : (
    <TabsTrigger key={id} value={id} onDoubleClick={() => setBeingEdited(true)} ref={dragRef}>
      {name}
    </TabsTrigger>
  );
}

export default EditableTabsTrigger;
