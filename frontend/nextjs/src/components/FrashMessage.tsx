import { InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect } from 'react'; // `use` のインポートは不要

export function FrashMessage(props: { frash: frashMessage; setFrash: (frash: frashMessage) => void }) {
  const handleDelete = () => {
    props.setFrash({ element: 'excution', message: '' });
  };

  const { frash, setFrash } = props; // props をデストラクチャリング

  useEffect(() => {
    if (frash.element === 'info' || frash.element === 'success') {
      // 成功メッセージが表示されたら、7秒後に非表示にするタイマーをセット
      const timer = setTimeout(() => {
        setFrash({ element: 'excution', message: '' });
      }, 7000);

      // コンポーネントがアンマウントされた場合、タイマーをクリア
      return () => clearTimeout(timer);
    }
  }, [frash, setFrash]); // frash と setFrash を依存関係に追加

  const FrashMessage = () => {
    const { frash } = props; // props.frash をローカル変数 frash に格納

    switch (frash.element) {
      case 'info':
        return (
          <div
            className="animate-text-pop-up-left fixed top-20 right-5 z-50 inline-flex min-w-[400px] items-center justify-between rounded-lg bg-blue-400 px-6 py-5 text-base text-primary-700 text-white"
            role="alert"
          >
            <span className="mr-2 flex items-center">
              <InformationCircleIcon className="h-5 w-5 mr-2 -mt-0.5" />
              {frash.message} {/* frash を使ってメッセージを表示 */}
            </span>
            <XMarkIcon onClick={handleDelete} className="w-6 h-6 text-white hover:text-gray-200 cursor-pointer" />
          </div>
        );
      case 'error':
        return (
          <div
            className="animate-text-pop-up-left fixed top-20 right-5 z-50 inline-flex min-w-[400px] items-center justify-between rounded-lg bg-red-400 px-6 py-5 text-base text-primary-700 text-white opacity-80"
            role="alert"
          >
            <span className="mr-2 flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 mr-2 -mt-0.5" />
              {frash.message} {/* frash を使ってメッセージを表示 */}
            </span>
            <XMarkIcon onClick={handleDelete} className="w-6 h-6 text-white hover:text-gray-200 cursor-pointer" />
          </div>
        );
      default:
        return <></>;
    }
  };

  return <>{FrashMessage()}</>;
}
