import Image from "next/image";
import Link from "next/link";

export type postType = {
  userId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
};

type postsType = postType[];

const getPosts = async () => {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/photos?_limit=5",
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("getPostsで異常が発生しました。");
  return res.json() as Promise<postsType>;
};

const page = async () => {
  const posts = await getPosts();

  return (
    <section className="grid grif-col-1 md:grid-cols-3 gap-6">
      {posts.map((post, index) => (
        <article className="blog px-4 md:px-0" key={index}>
          <Link href={`/blog/${post.id}`}>
            <div className="h-full bg-white shadow-lg border-opacity-60 rounded-lg overflow-hidden">
              <Image
                className="lg:h-48 md:h-36 w-full object-cover object-center"
                src={post.thumbnailUrl}
                alt="aaa"
                width={300}
                height={300}
              />
              <div className="p-6">
                <h2 className="text-lg">{post.title}</h2>
              </div>
            </div>
          </Link>
        </article>
      ))}
    </section>
  );
};
export default page;
