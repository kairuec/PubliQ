'use client';
import { useState, useEffect } from 'react';
import 'zenn-content-css';
import markdownToHtml from 'zenn-markdown-html';
import parse from 'html-react-parser';
import { MagnifyingGlassIcon, ClockIcon, TagIcon } from '@heroicons/react/24/outline';
import { BreadCrumb } from '@/components/BreadCrumb';
import Link from 'next/link';

export function InfoContent(props: { getData: InfoFetch }) {
  const { getData } = props;

  //目次（ページ位置により、見出しを強調）
  const [activeSection, setActiveSection] = useState('');
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // セクションの要素を取得し、現在のセクションを判断
      const sections = document.querySelectorAll('#section, #section0, #section1, #section2') as NodeListOf<HTMLElement>;
      let currentSection: string = '';
      sections.forEach((section) => {
        if (section.offsetTop <= scrollPosition) {
          currentSection = section.id;
        }
      });
      setActiveSection(currentSection);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const mokuji = () => {
    return (
      <ul className="md:sticky md:top-10 bg-neutral-100 md:bg-white p-6 md:shadow-lg md:rounded-xl text-sm">
        <li className="mb-6">
          <b>目次</b>
        </li>
        {getData.child &&
          getData?.child.map((childData, index) => {
            return (
              <li key={index} className="my-6">
                <a href={'#section' + index} className={activeSection === 'section' + index ? 'font-bold text-blue-400' : ' hover:underline'}>
                  {childData?.child_title}
                </a>
              </li>
            );
          })}
      </ul>
    );
  };

  return (
    <>
      <div className="block md:flex items-center justify-between py-2 md:py-4">
        <BreadCrumb tag={getData?.tagUrl} />
        <div className="w-[90%] md:w-[300px] mx-auto md:mx-0 md:my-0">
          <div className="hidden md:block mx-auto md:mx-0 my-6 md:my-0"></div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between gap-10 my-6">
        <main className="md:w-3/4 px-4 md:px-0">
          <section id="section" className="bg-white md:p-8 md:pb-12 md:px-12 md:shadow-lg mb-10 md:rounded-xl">
            <p className="text-gray-400 mb-4 flex items-center gap-2">
              <ClockIcon className="h-5 w-5" />
              {getData?.updated_at}更新
            </p>
            <h1 className=" font-bold text-lg md:text-2xl md:leading-10">{getData?.title}</h1>
            <div className="mt-6 mb-8">
              <Link href={`/search?keyword=${getData?.tag}`}>
                <span className=" text-sm p-2 bg-gray-200 hover:bg-gray-300 duration-75 rounded-md">
                  <TagIcon className="h-5 w-5 -mt-0.5 inline mr-2" />
                  {getData?.tag}
                </span>
              </Link>
            </div>
            <div className="znc">
              {getData.image != '' && getData.image != null && <img src={getData?.image} alt={getData?.title} className="py-4" />}
              {parse(markdownToHtml(getData?.content))}
            </div>
          </section>

          <section className="md:hidden mb-10 md:mb-0">{mokuji()}</section>
          {getData.child &&
            getData?.child.map((childData, index) => {
              return (
                <section id={'section' + index} key={index} className="znc bg-white md:p-8 md:pb-12  md:px-12 md:shadow-lg mb-20 md:mb-10 md:rounded-xl">
                  <h2 className="text-sm leading-10 font-bold">{childData?.child_title}</h2>
                  {parse(markdownToHtml(childData?.child_content))}
                </section>
              );
            })}
        </main>
        <aside className="hidden md:block md:w-1/4">{mokuji()}</aside>
      </div>
    </>
  );
}
