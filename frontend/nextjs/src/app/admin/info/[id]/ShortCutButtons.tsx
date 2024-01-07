import { useInfo } from '@/hooks/Info';
import { TableCellsIcon, PhotoIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { Button, Modal, Dropdown, Tooltip } from 'flowbite-react';
import WordConfig from './WordConfig';

export default function ShortCutButtons(parentProps: { index: number }) {
  const { index } = parentProps;
  const { info, setInfo, childInfos, setChildInfos, getImage, setGetImage, wordConfig, setWordConfig, rowCount, openModal, setOpenModal, props } = useInfo();

  const addText = (index: number, element: string) => {
    const shortCut = () => {
      switch (element) {
        case 'image':
          return '![altテキスト](https://画像のURL)';
        case 'table':
          return '\n| Head1 | Head2 | Head3 |\n|  ---  |  ---   | --- |\n| text1 | text2 | text3 |\n| text4 | text5 | text6<br>text7 |';
        case 'h3':
          return '### ';
        case 'a':
          return '[リンクのテキスト](https://www.google.co.jp/)';
        case 'b':
          return '**強調テキスト**';
        case 'ul':
          return '- リスト1\n- リスト2\n- リスト３';
        case 'ol':
          return '1. James Madison\n1. James Monroe\n1. John Quincy Adams';
        case 'quote':
          return '> 引用';
        case 'code':
          return '\n```ruby:sample.js\nconst numbers = [1, 2, 3, 4, 5, 6];\nconsole.log(numbers);\n```';
        case 'message':
          return '\n:::message\nメッセージをここに\n:::';
        case 'alert':
          return '\n:::message alert\nメッセージをここに\n:::';
        default:
          return '';
      }
    };
    //-1の場合はメインを変更
    if (index === -1) {
      setInfo((prev) => ({ ...prev, content: prev.content + shortCut() }));
    }
    //子の編集
    else {
      const newChilds = childInfos.map((childInfo, childIndex) => {
        if (index == childIndex) {
          return { ...childInfo, child_content: childInfo.child_content + shortCut() };
        }
        return childInfo;
      });
      setChildInfos(newChilds);
    }
  };

  return (
    <>
      <ul className="flex items-center gap-4 overflow-x-auto mt-4 mb-14">
        <Tooltip content="画像の挿入">
          <li
            onClick={() => setGetImage((prev) => ({ ...prev, mode: 'content', index: index }))}
            className="bg-white rounded border-2 border-gray-200 hover:border-blue-400 duration-75 text-gray-600 p-2 text-center w-[50px] h-[50px] flex items-center cursor-pointer"
          >
            <PhotoIcon className="w-6 h-6 mx-auto" />
          </li>
        </Tooltip>
        <Tooltip content="テーブル">
          <li
            onClick={() => {
              addText(index, 'table');
            }}
            className="bg-white rounded border-2 border-gray-200 hover:border-blue-400 duration-75 text-gray-600 p-2 text-center w-[50px] h-[50px] flex items-center cursor-pointer"
          >
            <TableCellsIcon className="w-6 h-6 mx-auto" />
          </li>
        </Tooltip>
        <Tooltip content="h3見出し">
          <li
            onClick={() => {
              addText(index, 'h3');
            }}
            className="bg-white rounded border-2 border-gray-200 hover:border-blue-400 duration-75 text-gray-600 p-2 text-center w-[50px] h-[50px] flex items-center justify-center cursor-pointer"
          >
            h3
          </li>
        </Tooltip>
        <Tooltip content="リンクの挿入">
          <li
            onClick={() => {
              addText(index, 'a');
            }}
            className="bg-white rounded border-2 border-gray-200 hover:border-blue-400 duration-75 text-gray-600 p-2 text-center w-[50px] h-[50px] flex items-center justify-center cursor-pointer"
          >
            a
          </li>
        </Tooltip>
        <Tooltip content="文字の強調">
          <li
            onClick={() => {
              addText(index, 'b');
            }}
            className="bg-white rounded border-2 border-gray-200 hover:border-blue-400 duration-75 text-gray-600 p-2 text-center w-[50px] h-[50px] flex items-center justify-center cursor-pointer"
          >
            b
          </li>
        </Tooltip>
        <Tooltip content="リスト">
          <li
            onClick={() => {
              addText(index, 'ul');
            }}
            className="bg-white rounded border-2 border-gray-200 hover:border-blue-400 duration-75 text-gray-600 p-2 text-center w-[50px] h-[50px] flex items-center justify-center cursor-pointer"
          >
            ul
          </li>
        </Tooltip>
        <Tooltip content="数字付きリスト">
          <li
            onClick={() => {
              addText(index, 'ol');
            }}
            className="bg-white rounded border-2 border-gray-200 hover:border-blue-400 duration-75 text-gray-600 p-2 text-center w-[50px] h-[50px] flex items-center justify-center cursor-pointer"
          >
            ol
          </li>
        </Tooltip>
        <Tooltip content="引用">
          <li
            onClick={() => {
              addText(index, 'quote');
            }}
            className="bg-white rounded border-2 border-gray-200 hover:border-blue-400 duration-75 text-gray-600 p-2 text-center w-[50px] h-[50px] flex items-center justify-center cursor-pointer"
          >
            ❞
          </li>
        </Tooltip>
        <Tooltip content="コード">
          <li
            onClick={() => {
              addText(index, 'code');
            }}
            className="bg-white rounded border-2 border-gray-200 hover:border-blue-400 duration-75 text-gray-600 p-2 text-center w-[50px] h-[50px] flex items-center cursor-pointer"
          >
            <CodeBracketIcon className="w-6 h-6 mx-auto" />
          </li>
        </Tooltip>
        <Tooltip content="メッセージ">
          <li
            onClick={() => {
              addText(index, 'message');
            }}
            className="bg-white rounded border-2 border-gray-200 hover:border-blue-400 duration-75 text-gray-600 p-2 text-center w-[50px] h-[50px] flex items-center cursor-pointer"
          >
            <ExclamationCircleIcon className="w-6 h-6 mx-auto text-amber-300" />
          </li>
        </Tooltip>
        <Tooltip content="注意メッセージ">
          <li
            onClick={() => {
              addText(index, 'alert');
            }}
            className="bg-white rounded border-2 border-gray-200 hover:border-blue-400 duration-75 text-gray-600 p-2 text-center w-[50px] h-[50px] flex items-center cursor-pointer"
          >
            <ExclamationCircleIcon className="w-6 h-6 mx-auto text-red-300" />
          </li>
        </Tooltip>
        <Tooltip content="定型文">
          <li
            onClick={() => props.setOpenModal('wordConfig')}
            className="bg-white rounded border-2 border-gray-200 hover:border-blue-400 duration-75 text-gray-600 p-2 text-center w-[50px] cursor-pointer"
          >
            &#123;&#123;&nbsp;&#125;&#125;
          </li>
        </Tooltip>
      </ul>
      <Modal show={props.openModal === 'wordConfig'} size={'7xl'} onClose={() => props.setOpenModal(undefined)}>
        <Modal.Header>定型文</Modal.Header>
        <Modal.Body>
          <WordConfig setOpenModal={props.setOpenModal} />
        </Modal.Body>
      </Modal>
    </>
  );
}
