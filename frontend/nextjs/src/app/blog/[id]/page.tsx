export type userType = {
  id: number;
  name: string;
};

const getUser = async (id: number) => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("getPostsで異常が発生しました。");
  return res.json() as Promise<userType>;
};

const page = async ({ params }: { params: { id: number } }) => {
  const user = await getUser(params.id);
  return <div>{user.name}</div>;
};
export default page;
