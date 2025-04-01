import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { HiTranslate } from 'react-icons/hi';
import { useLanguage } from '../../context/LanguageContext';

function LanguageSelector() {
  const { language, changeLanguage } = useLanguage();
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ru', name: 'Русский' },
    { code: 'kk', name: 'Қазақша' }
  ];

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-200">
        <HiTranslate className="w-6 h-6" />
      </Menu.Button>
      
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {languages.map((lang) => (
              <Menu.Item key={lang.code}>
                {({ active }) => (
                  <button
                    onClick={() => changeLanguage(lang.code)}
                    className={`
                      ${active ? 'bg-gray-100 dark:bg-gray-700' : ''}
                      ${language === lang.code ? 'font-bold text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-200'}
                      group flex items-center w-full px-4 py-2 text-sm
                    `}
                  >
                    {lang.name}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default LanguageSelector;