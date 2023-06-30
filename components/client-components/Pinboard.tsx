import Note, { NoteProps } from "./Note";

type PinboardProps = {
  notes: NoteProps[];
};

export default function Pinboard({ notes }: PinboardProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {notes.map((note) => (
        <Note
          key={note.id}
          id={note.id}
          title={note.title}
          content={note.content}
        />
      ))}
    </div>
  );
}
