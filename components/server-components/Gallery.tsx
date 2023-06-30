import Picture, { PictureProps } from "./Picture";

interface GalleryProps {
  bucket: string;
  pictures: PictureProps[];
}

export default function Gallery({ bucket, pictures }: GalleryProps) {
  if (pictures.length === 0) {
    return <div>There are no pictures yet. Try uploading.</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {pictures.map((picture, index) => (
        <Picture
          key={index}
          src={picture.src}
          alt={picture.alt}
          filepath={picture.filepath}
          bucket={bucket}
        />
      ))}
    </div>
  );
}
