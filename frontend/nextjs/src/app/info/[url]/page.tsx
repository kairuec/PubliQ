import axios from 'axios';
import { InfoContent } from '../content';

const fetchInfo = async (url: string) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/info/${url}`, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

const page = async ({ params }: { params: { url: string } }) => {
  const fetchData = await fetchInfo(params.url);
  return (
    <div className="bg-white md:bg-neutral-100">
      <InfoContent getData={fetchData} />
    </div>
  );
};

export default page;
