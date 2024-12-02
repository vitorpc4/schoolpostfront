"use client";

import { useRouter } from "next/navigation";

interface INewsCardProps {
  id: number;
  title: string;
  description: string;
  author: string;
  image: string;
}

export const NewsCard = ({
  id,
  title,
  author,
  description,
  image,
}: INewsCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/posts/id?id=${id}`);
  };

  image =
    "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp";
  return (
    <>
      <div className="card bg-base-100 image-full md:w-[350] sm:w-[280]  shadow-xl">
        <figure>
          <img src={image} alt="Image" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p
            dangerouslySetInnerHTML={{
              __html:
                description.replace(/<[^>]*>?/gm, "").substring(0, 50) + " ...",
            }}
          ></p>
          <div className="card-actions justify-between">
            <div className="badge badge-info mt-3">Autor: {author}</div>
            <div>
              <button onClick={handleClick} className="btn btn-primary">
                Ler
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
