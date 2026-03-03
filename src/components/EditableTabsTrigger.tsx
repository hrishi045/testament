import React, { useEffect, useState } from "react";
import { TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { useSortable } from "@dnd-kit/react/sortable";
import { PointerSensor } from "@dnd-kit/react";
import { PointerActivationConstraints } from "@dnd-kit/dom";
import { X } from "lucide-react";
import { Button } from "./ui/button";

type EditableTabsTriggerProps = {
  id: string;
  name: string;
  index: number;
  onChange: (newName: string) => void;
  onDelete: (id: string) => void;
};

function EditableTabsTrigger({ id, name, index, onChange, onDelete }: EditableTabsTriggerProps) {
  const [editedName, setEditedName] = useState(name);
  const [beingEdited, setBeingEdited] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const clickCount = React.useRef(0);

  const { ref: dragRef, isDragging } = useSortable({
    id, index, sensors: [
      PointerSensor.configure({
        activationConstraints: [
          new PointerActivationConstraints.Distance({
            value: 5,
          })
        ]
      })
    ]
  });

  const handleClick = () => {
    if (isDragging) return;
    clickCount.current++;
    if (clickCount.current >= 2) {
      clickCount.current = 0;
      setBeingEdited(true);
    }
  };

  useEffect(() => {
    if (beingEdited && inputRef.current) {
      inputRef.current.focus();
    }
  }, [beingEdited]);

  return <div className="flex justify-center items-center">
    {beingEdited ? (
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
      <>
        <TabsTrigger
          className="cursor-pointer"
          ref={dragRef}
          key={id}
          value={id}
          onPointerLeave={() => { clickCount.current = 0; }}
        >
          <span onClick={handleClick}>{name}</span>
          <Button variant="ghost" size="icon" className="p-2 w-4 h-4 group-hover:opacity-100" onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}>
            <X className="w-4 h-4" />
          </Button>
        </TabsTrigger>
      </>
    )}
  </div>
}

export default EditableTabsTrigger;
