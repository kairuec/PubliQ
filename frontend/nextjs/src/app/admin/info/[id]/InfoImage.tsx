import { useEffect, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import axios, { csrf } from '@/lib/axios';
import { Dropdown } from 'flowbite-react';
import { PencilIcon, TrashIcon, MagnifyingGlassIcon, EllipsisVerticalIcon, PlusIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon, InformationCircleIcon, PhotoIcon } from '@heroicons/react/24/solid';
import { FrashMessage } from '@/components/FrashMessage';
import { Pagination } from '@/components/Pagination';
import { useInfo } from '@/hooks/Info';
import { useImage } from '@/validation/Image';
import { useSearch } from '@/hooks/Search';
import { useLaravelApi } from '@/hooks/laravelApi';
import { useCheckbox } from '@/hooks/Checkbox';

interface InfoImageProps {
  setGetImage: React.Dispatch<React.SetStateAction<string>>;
  setOpenModal: any;
}

export default function InfoImage() {
  const { info, setInfo, childInfos, setChildInfos, getImage, setGetImage } = useInfo();

  const { getIndex, deleteDatas } = useLaravelApi();

  //バリデーション関連
  const { validation } = useImage();

  //読み込み
  const [isLoading, setIsLoading] = useState(true);

  //フラッシュメッセージ
  const [frash, setFrash] = useState({ element: '', message: '' });

  //チェックボックス関連
  const { checks, setChecks, handleChecked, handleBulkChecked, selectChecks } = useCheckbox();

  //検索関連
  const { search, handleSearch, handleSelect, searchResult, setSearchResult } = useSearch('images.updated_at');

  //検索実行
  const submitSearch = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);
    getIndex('/api/infoEdit/images?page=1', search, setImages, setIsLoading);
    setSearchResult(search.keyword);
  };

  interface ImageItem {
    id: number;
    title: string;
    path: string;
    element: number;
    updated_at: string;
  }

  interface ImageData {
    current_page: number;
    data: ImageItem[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  }

  // blogs ステートの初期値を設定
  const initialImageData: ImageData = {
    current_page: 1,
    data: [],
    first_page_url: '',
    from: 0,
    last_page: 1,
    last_page_url: '',
    links: [],
    next_page_url: null,
    path: '',
    per_page: 20, // 必要に応じて変更
    prev_page_url: null,
    to: 0,
    total: 0,
  };
  const [images, setImages] = useState<ImageData>(initialImageData);

  useEffect(() => {
    if (frash.element != 'excution') {
      getIndex(`/api/infoEdit/images?page=1`, search, setImages, setIsLoading);
    }
  }, [frash, search.paginate, search.order, search.sort]); // eslint-disable-line

  useEffect(() => {
    const imageIds = images.data.map((image) => image['id']);
    const initialImageIds = imageIds.map((imageId) => {
      return {
        id: imageId,
        checked: false,
      };
    });
    setChecks(initialImageIds);
  }, [images, setChecks]);

  //一括削除
  const bulkDeleteRequest = () => {
    const deleteIds = selectChecks.map((selectCheck) => {
      return Number(selectCheck.id);
    });
    setIsLoading(true);
    deleteDatas(deleteIds, '/api/infoEdit/imageDelete', setIsLoading, setFrash);
  };

  //ここから画像アップロード関連
  const [successImages, setSuccessImages] = useState<successInfoImage[]>([]);
  const [successFiles, setSuccessFiles] = useState<File[]>([]);
  const [errorImages, setErrorImages] = useState<errorInfoImage[]>([]);
  const [quantityError, setQuantityError] = useState('');

  //画像のドラッグ・アンド・ドロップ
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const fileList = Array.from(acceptedFiles);

    //バリデーション
    const checkedImages = validation(fileList);

    //アップロード件数エラーがない場合
    if (checkedImages.quantityError == '') {
      setSuccessImages(checkedImages.success);
      setSuccessFiles(checkedImages.successFiles);
      setErrorImages(checkedImages.error);
    }
    //件数エラーがある場合は件数エラーのみ表示
    else {
      setQuantityError(checkedImages.quantityError);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  //アップロード予定の画像の消去
  const handleDelete = (indexId: number) => {
    const newImages = successImages.filter((successImage, index) => index !== indexId);
    setSuccessImages(newImages);
  };

  // アップロード可能な画像をlaravel経由でs3にアップロード
  const fileUpload = () => {
    // 新しい FileList オブジェクトを作成
    const newFileList = new DataTransfer();

    //successFiles  の各要素を新しい FileList に追加
    successFiles.forEach((file) => {
      newFileList.items.add(file);
    });
    // 新しい FileList を取得
    const fileInputFiles = newFileList.files;

    //データベースに画像を保存
    const infoImagesUpload = async () => {
      setIsLoading(true);
      await csrf();
      axios
        .post('/api/infoEdit/postFiles', fileInputFiles)
        .then((res) => {
          // レスポンスを処理して状態を更新
          setSuccessImages([]);
          setFrash(res.data);
          setIsLoading(false);
        })
        .catch((error) => {
          if (error.response && error.response.status !== 404) {
            // エラーハンドリング
          } else {
            // リクエスト自体のエラーハンドリング
          }
        });
    };
    infoImagesUpload();
  };

  //画像選択
  const selecImage = (path: string) => {
    setGetImage((prev) => ({ ...prev, url: path }));
  };

  //状態に反映する処理
  useEffect(() => {
    if (getImage.url != '') {
      //サムネイル
      if (getImage.mode == 'thumbnail') {
        setInfo((prev) => ({ ...prev, image: getImage.url }));
      }
      //コンテンツに挿入
      else if (getImage.index == -1) {
        setInfo((prev) => ({ ...prev, content: prev.content + `\n![altテキスト](${getImage.url})` }));
      }
      //子コンテンツに挿入
      else {
        const newChilds = childInfos.map((childInfo, childIndex) => {
          if (getImage.index == childIndex) {
            return { ...childInfo, child_content: childInfo.child_content + `\n![altテキスト](${getImage.url})` };
          }
          return childInfo;
        });
        setChildInfos(newChilds);
      }
      setGetImage((prev) => ({ ...prev, mode: '', url: '' }));
    }
  }, [getImage.url]);

  // スケルトンスクリーン20回繰り返すための配列を生成
  const skeltonItems = Array(20)
    .fill(undefined)
    .map((_, index) => index);

  return (
    <>
      <FrashMessage frash={frash} setFrash={setFrash} />

      <h2 className={(searchResult == '' && 'hidden ') + ' text-base mb-4'}>&nbsp;&nbsp;検索ワード：{searchResult}</h2>
      <>
        <div {...getRootProps()} className={`flex items-center justify-center w-full mb-10 ${successImages.length != 0 && `hidden`} ${errorImages.length != 0 && `hidden`}`}>
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-50 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <CloudArrowUpIcon className="h-10 w-10 text-gray-500" />
              <p className="mt-4 text-gray-500">ここに画像ファイルをドラッグ＆ドロップ</p>
              <p className="my-2 text-gray-500">または</p>
              <p className="p-2 px-4 bg-gray-200 hover:bg-gray-300 duration-75 rounded">ファイルの選択</p>
            </div>
            <input id="dropzone-file" {...getInputProps()} />
          </label>
        </div>
        {quantityError != '' && (
          <h2 className="mb-6 flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 mr-2 -mt-0.5 text-red-400" />
            {quantityError}
          </h2>
        )}

        {errorImages.length != 0 && (
          <>
            <h2 className="mb-6 flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 mr-2 -mt-0.5 text-red-400" />
              アップロード不可能ファイル：{errorImages.length}件
            </h2>
            <table className="w-full text-left text-gray-500 mb-14">
              <thead className="text-gray-700 uppercase border-b">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    画像
                  </th>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">
                    <span className="px-2">ファイル名</span>
                  </th>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">
                    <span className="px-2 whitespace-nowrap">エラー内容</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {errorImages.map((errorImage) => {
                  return (
                    <tr className="bg-white border-b" key={errorImage.url.toString()}>
                      <td className="px-6 py-4 text-center">
                        <Image src={errorImage.url.toString()} width={100} height={100} alt={errorImage.fileName} />
                      </td>
                      <td className="px-6 py-4 text-center">{errorImage.fileName}</td>
                      <td className="px-6 py-4">
                        {errorImage.errors && (
                          <div className="text-red-400">
                            <p>{errorImage.errors.size}</p>
                            <p>{errorImage.errors.type}</p>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
        {successImages.length != 0 && (
          <>
            <h2 className="mb-6 flex items-center">
              <CheckCircleIcon className="h-5 w-5 mr-2 -mt-0.5 text-blue-400" />
              アップロード可能ファイル：{successImages.length}件
            </h2>
            <ul className="mb-6 bg-white rounded flex items-center overflow-x-auto">
              {successImages.map((successImage, index) => {
                return (
                  <li key={successImage.url.toString()} className="flex-none w-[180px] p-6 relative border-white">
                    <XCircleIcon onClick={() => handleDelete(index)} className=" bg-white rounded-full absolute top-4 right-4 w-6 h-6 text-gray-500 hover:text-red-500 cursor-pointer" />
                    <Image src={successImage.url.toString()} width={100} height={100} alt={successImage.fileName} layout="responsive" />
                    <p className="mt-2 text-xs truncate">{successImage.fileName}</p>
                  </li>
                );
              })}
            </ul>
            <div className="flex items-center gap-4 justify-center mb-12">
              {isLoading ? (
                <div className="w-[150px] p-3 flex items-center text-white bg-blue-400 hover:bg-blue-500 duration-100 rounded shadow">
                  <div className="animate-spin h-6 w-6 border-4 border-white rounded-full border-t-transparent mx-auto"></div>
                </div>
              ) : (
                <button onClick={fileUpload} type="submit" className="p-3 flex items-center text-white bg-blue-400 hover:bg-blue-500 duration-100 rounded shadow">
                  <CheckCircleIcon className="w-6 h-6 mr-2 text-white" />
                  アップロード
                </button>
              )}
            </div>
          </>
        )}
      </>
      <div className="pb-2 flex items-center justify-between">
        <div className=" -mt-5 flex items-center gap-4">
          <div>
            <div className="flex items-center">
              <label className="text-white bg-gray-400 hover:bg-gray-500 mt-3 rounded p-2 px-4 text-center inline-flex items-center duration-75">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    handleBulkChecked(e.target.checked);
                  }}
                  className="opacity-0 absolute h-0 w-0"
                />
                全選択
              </label>
              <label className="sr-only">checkbox</label>
            </div>
          </div>
          <div>
            <button type="button" onClick={bulkDeleteRequest} className="text-white bg-gray-400 hover:bg-red-500 mt-3 rounded p-2 pr-4 text-center inline-flex items-center duration-75">
              <TrashIcon className="h-5 w-5 mr-2 -mt-0.5 text-white" />
              削除：{selectChecks.length}件
            </button>
          </div>
        </div>
        <div className="md:flex items-center gap-4 relative text-gray-600">
          <select
            onChange={(e) => {
              handleSelect(Number(e.target.value), search.order, search.sort);
            }}
            className="bg-whitw border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-[100px] p-3"
            required
          >
            <option value="20">20件</option>
            <option value="50">50件</option>
            <option value="100">100件</option>
          </select>
          <select
            onChange={(e) => handleSelect(search.paginate, e.target.value.split(':')[0], e.target.value.split(':')[1])}
            className="bg-whitw border-2 border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-[180px] p-3"
            required
          >
            <option value="images.updated_at:desc">更新（新しい順）</option>
            <option value="images.updated_at:asc">更新（古い順）</option>
            <option value="images.title:asc">ファイル名（昇順）</option>
            <option value="images.title:desc">ファイル名（降順）</option>
          </select>
          <form onSubmit={submitSearch}>
            <input
              value={search.keyword}
              onChange={(e) => {
                handleSearch(e.target.value);
              }}
              className="md:w-[300px] border-2 border-gray-200 bg-white h-12 px-5 pr-10 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              type="search"
            />
            <button type="submit" className="absolute right-0 top-0 mt-3 mr-4">
              <MagnifyingGlassIcon className="h-6 w-6 text-gray-500" />
            </button>
          </form>
        </div>
      </div>

      <div className={isLoading ? '' : 'hidden'}>
        <Pagination route={'/api/infoEdit/images'} search={search} data={images} setData={setImages} setIsLoading={setIsLoading} />
        <ul className="grid grid-cols-6 gap-4 content-center">
          {skeltonItems.map((index) => (
            <li className="p-4 bg-white rounded-xl" key={index}>
              <div className="flex items-center mb-4">
                <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-400 rounded focus:ring-blue-500 focus:ring-2" />
                <label className="sr-only">checkbox</label>
              </div>
              <div className="flex items-center justify-center w-[150px] h-[100px] bg-gray-200 rounded animate-pulse">
                <PhotoIcon className="w-10 h-10 text-gray-300" />
              </div>
              <div className="text-xs text-center pt-2 break-words line-clamp-2">
                <div className="h-2.5 bg-gray-200 rounded-full w-[150px] mb-4 animate-pulse"></div>
              </div>
              <div className="flex justify-center mt-2">
                <button className="text-sm text-gray-600 border-2  border-gray-300 hover:bg-gray-200 duration-75 p-2 px-4 rounded-md">画像の選択</button>
              </div>
            </li>
          ))}
        </ul>
        <Pagination route={'/api/infoEdit/images'} search={search} data={images} setData={setImages} setIsLoading={setIsLoading} />
      </div>

      <div className={isLoading ? 'hidden' : ''}>
        <Pagination route={'/api/infoEdit/images'} search={search} data={images} setData={setImages} setIsLoading={setIsLoading} />
        <ul className="grid grid-cols-6 gap-4 content-center">
          {images.data &&
            images.data.map((image, index) => (
              <li className="p-4 bg-white rounded-xl" key={image.path}>
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={checks.length > 0 && checks[index] != undefined && checks[index].checked}
                    onChange={() => {
                      handleChecked(index);
                    }}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-400 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label className="sr-only">checkbox</label>
                </div>
                <div className="">
                  <Image src={image.path} width={150} height={150} alt={image.title} className="mx-auto shadow-md" />
                </div>
                <p className="text-xs text-center pt-2 break-words line-clamp-2">{image.title}</p>
                <div className="flex justify-center mt-2">
                  <button
                    onClick={(e) => {
                      selecImage(image.path);
                    }}
                    className="text-sm text-gray-600 border-2  border-gray-300 hover:bg-gray-200 duration-75 p-2 px-4 rounded-md"
                  >
                    画像の選択
                  </button>
                </div>
              </li>
            ))}
        </ul>
        <Pagination route={'/api/infoEdit/images'} search={search} data={images} setData={setImages} setIsLoading={setIsLoading} />
      </div>
    </>
  );
}
