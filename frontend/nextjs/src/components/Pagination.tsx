import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useLaravelApi } from '@/hooks/laravelApi';
import { useSearchParams } from 'next/navigation';

interface PaginationProps {
  route: string;
  search: SearchData;
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Pagination(props: PaginationProps) {
  const { getIndex } = useLaravelApi();

  //apiの読み込みが完了したら実行
  if (props.data.last_page > 0) {
    //laravelから受け取ったURLからページ番号を取得
    const pageNumber = (url: string) => {
      if (url != null) {
        const param = url.indexOf('?page=');
        return url.substring(param);
      } else {
        return '';
      }
    };

    const change = (page: string) => {
      getIndex(props.route + pageNumber(page), props.search, props.setData, props.setIsLoading);
    };

    //5ページまでの場合
    const fewPaginate = () => {
      return (
        <>
          {(() => {
            const items = [];
            for (let i = 1; i < Number(props.data.last_page) + 1; i++) {
              items.push(
                <button
                  onClick={() => change('?page=' + i)}
                  type="button"
                  key={i}
                  className={
                    'relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0' +
                    (Number(props.data.current_page) == i ? ' bg-blue-400 text-white hover:bg-blue-500' : ' hover:bg-gray-50')
                  }
                >
                  {i}
                </button>,
              );
            }
            return <>{items}</>;
          })()}
        </>
      );
    };

    //6ページ以上ある場合
    const manyPaginate = () => {
      return (
        <>
          <button
            onClick={() => change('?page=1')}
            type="button"
            className={
              (Number(props.data.current_page) < 2 && 'hidden ') +
              'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
            }
          >
            1
          </button>
          <span
            className={
              (Number(props.data.current_page) <= 2 && 'hidden ') +
              'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0'
            }
          >
            ...
          </span>
          <button
            onClick={() => change('?page=' + Number(props.data.current_page - 2))}
            type="button"
            className={
              (Number(props.data.last_page - props.data.current_page) > 2 && 'hidden ') +
              'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
            }
          >
            {Number(props.data.current_page - 2)}
          </button>
          <button
            onClick={() => change('?page=' + Number(props.data.current_page - 1))}
            type="button"
            className={
              (Number(props.data.last_page - props.data.current_page) > 2 && 'hidden ') +
              'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
            }
          >
            {Number(props.data.current_page - 1)}
          </button>
          <button
            type="button"
            className="relative z-10 inline-flex items-center bg-blue-400 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {props.data.current_page}
          </button>
          <button
            onClick={() => change('?page=' + Number(props.data.current_page + 1))}
            type="button"
            className={
              (Number(props.data.last_page - props.data.current_page) <= 2 && 'hidden ') +
              'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
            }
          >
            {Number(props.data.current_page + 1)}
          </button>
          <button
            onClick={() => change('?page=' + Number(props.data.current_page + 2))}
            type="button"
            className={
              (Number(props.data.last_page - props.data.current_page) <= 2 && 'hidden ') +
              'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
            }
          >
            {Number(props.data.current_page + 2)}
          </button>
          <span
            className={
              (Number(props.data.last_page - props.data.current_page) <= 1 && 'hidden ') +
              'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0'
            }
          >
            ...
          </span>
          <button
            onClick={() => change('?page=' + props.data.last_page)}
            type="button"
            className={
              (Number(props.data.last_page - props.data.current_page) == 0 && 'hidden ') +
              'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
            }
          >
            {props.data.last_page}
          </button>
        </>
      );
    };

    return (
      <div className="my-6">
        <div className="sm:hidden mx-4">
          <p className="text-sm text-gray-700">
            <span className="font-bold">{props.data.total}</span>
            件中
            <span className="font-bold">{props.data.from}</span>～<span className="font-bold">{props.data.to}</span>
            を表示
          </p>
          <div className="flex items-center justify-between my-6">
            <button
              onClick={() => change(props.data.prev_page_url)}
              type="button"
              className={
                (pageNumber(props.data.prev_page_url) === null && 'hidden ') +
                'items-center px-3 py-2 text-gray-400 ring-gray-300 border-2 rounded-md hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
              }
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-4 w-4 text-gray-900" />
            </button>
            <button
              onClick={() => change(props.data.next_page_url)}
              type="button"
              className={
                (pageNumber(props.data.next_page_url) === null && 'hidden ') +
                'items-center px-3 py-2 text-gray-400 ring-gray-300 border-2 rounded-md hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
              }
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-4 w-4 text-gray-900" />
            </button>
          </div>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-bold">{props.data.total}</span>
              件中
              <span className="font-bold">{props.data.from}</span>～<span className="font-bold">{props.data.to}</span>
              を表示
            </p>
          </div>
          <div>
            <nav className="bg-white isolate inline-flex -space-x-px rounded" aria-label="Pagination">
              <button
                onClick={() => change(props.data.prev_page_url)}
                type="button"
                className={
                  (pageNumber(props.data.prev_page_url) === null && 'hidden ') +
                  'items-center px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                }
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-4 w-4 text-gray-900" />
              </button>
              {Number(props.data.last_page) < 7 ? fewPaginate() : manyPaginate()}
              <button
                onClick={() => change(props.data.next_page_url)}
                type="button"
                className={
                  (pageNumber(props.data.next_page_url) === null && 'hidden ') +
                  'items-center px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                }
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-4 w-4 text-gray-900" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
}
