import { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target as Node) ||
        trigger.current.contains(target as Node)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });


  return (
    <div>
      <aside
        ref={sidebar}
        className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-[#005792] text-white duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 ">
          <NavLink to="/admin"><p className='text-4xl'>Traventure</p></NavLink>

          <button
            ref={trigger}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button>
        </div>

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
            <div>
              <ul className="mb-6 flex flex-col gap-1.5">
                <li>
                  <NavLink
                    to="/admin"
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:hover:bg-[#004471] dark:hover:bg-meta-4 ${
                      pathname === '/admin' ? 'bg-graydark dark:bg-meta-4' : ''
                    }`}
                  >
                    <svg
                      className="fill-current"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299ZM6.60947 6.30005C6.60947 6.5813 6.38447 6.8063 6.10322 6.8063H2.53135C2.2501 6.8063 2.0251 6.5813 2.0251 6.30005V2.72817C2.0251 2.44692 2.2501 2.22192 2.53135 2.22192H6.10322C6.38447 2.22192 6.60947 2.44692 6.60947 2.72817V6.30005Z"
                        fill=""
                      />
                      <path
                        d="M15.4689 0.956299H11.8971C10.9408 0.956299 10.1533 1.7438 10.1533 2.70005V6.27192C10.1533 7.22817 10.9408 8.01567 11.8971 8.01567H15.4689C16.4252 8.01567 17.2127 7.22817 17.2127 6.27192V2.72817C17.2127 1.7438 16.4252 0.956299 15.4689 0.956299ZM15.9752 6.30005C15.9752 6.5813 15.7502 6.8063 15.4689 6.8063H11.8971C11.6158 6.8063 11.3908 6.5813 11.3908 6.30005V2.72817C11.3908 2.44692 11.6158 2.22192 11.8971 2.22192H15.4689C15.7502 2.22192 15.9752 2.44692 15.9752 2.72817V6.30005Z"
                        fill=""
                      />
                      <path
                        d="M6.10322 9.92822H2.53135C1.5751 9.92822 0.787598 10.7157 0.787598 11.672V15.2438C0.787598 16.2001 1.5751 16.9876 2.53135 16.9876H6.10322C7.05947 16.9876 7.84697 16.2001 7.84697 15.2438V11.7001C7.8751 10.7157 7.0876 9.92822 6.10322 9.92822ZM6.60947 15.272C6.60947 15.5532 6.38447 15.7782 6.10322 15.7782H2.53135C2.2501 15.7782 2.0251 15.5532 2.0251 15.272V11.7001C2.0251 11.4188 2.2501 11.1938 2.53135 11.1938H6.10322C6.38447 11.1938 6.60947 11.4188 6.60947 11.7001V15.272Z"
                        fill=""
                      />
                      <path
                        d="M15.4689 9.92822H11.8971C10.9408 9.92822 10.1533 10.7157 10.1533 11.672V15.2438C10.1533 16.2001 10.9408 16.9876 11.8971 16.9876H15.4689C16.4252 16.9876 17.2127 16.2001 17.2127 15.2438V11.7001C17.2127 10.7157 16.4252 9.92822 15.4689 9.92822ZM15.9752 15.272C15.9752 15.5532 15.7502 15.7782 15.4689 15.7782H11.8971C11.6158 15.7782 11.3908 15.5532 11.3908 15.272V11.7001C11.3908 11.4188 11.6158 11.1938 11.8971 11.1938H15.4689C15.7502 11.1938 15.9752 11.4188 15.9752 11.7001V15.272Z"
                        fill=""
                      />
                    </svg>
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/profile"
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:hover:bg-[#004471] dark:hover:bg-meta-4 ${
                      pathname === '/admin/profile' ? 'bg-graydark dark:bg-meta-4' : ''
                    }`}
                  >
                    <svg
                      className="fill-current"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.0002 7.79065C11.0814 7.79065 12.7689 6.1594 12.7689 4.1344C12.7689 2.1094 11.0814 0.478149 9.0002 0.478149C6.91895 0.478149 5.23145 2.1094 5.23145 4.1344C5.23145 6.1594 6.91895 7.79065 9.0002 7.79065ZM9.0002 1.7719C10.3783 1.7719 11.5033 2.84065 11.5033 4.16252C11.5033 5.4844 10.3783 6.55315 9.0002 6.55315C7.62207 6.55315 6.49707 5.4844 6.49707 4.16252C6.49707 2.84065 7.62207 1.7719 9.0002 1.7719Z"
                        fill=""
                      />
                      <path
                        d="M10.8283 9.05627H7.17207C4.16269 9.05627 1.71582 11.5313 1.71582 14.5406V16.875C1.71582 17.2125 1.99707 17.5219 2.3627 17.5219C2.72832 17.5219 3.00957 17.2407 3.00957 16.875V14.5406C3.00957 12.2344 4.89394 10.3219 7.22832 10.3219H10.8564C13.1627 10.3219 15.0752 12.2063 15.0752 14.5406V16.875C15.0752 17.2125 15.3564 17.5219 15.7221 17.5219C16.0877 17.5219 16.3689 17.2407 16.3689 16.875V14.5406C16.2846 11.5313 13.8377 9.05627 10.8283 9.05627Z"
                        fill=""
                      />
                    </svg>
                    Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/packages"
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:hover:bg-[#004471] dark:hover:bg-meta-4 ${
                      pathname === '/admin/packages' ? 'bg-graydark dark:bg-meta-4' : ''
                    }`}
                  >
                    <svg
                      className="fill-current"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.7754 0.478149H1.22461C0.773438 0.478149 0.404297 0.847256 0.404297 1.29841V3.45947C0.404297 3.91065 0.773438 4.27975 1.22461 4.27975H16.7754C17.2266 4.27975 17.5957 3.91065 17.5957 3.45947V1.29841C17.5957 0.847256 17.2266 0.478149 16.7754 0.478149ZM16.1367 2.82819H1.86328V1.9297H16.1367V2.82819Z"
                        fill=""
                      />
                      <path
                        d="M16.7754 5.29297H1.22461C0.773438 5.29297 0.404297 5.66208 0.404297 6.11324V8.27429C0.404297 8.72546 0.773438 9.09456 1.22461 9.09456H16.7754C17.2266 9.09456 17.5957 8.72546 17.5957 8.27429V6.11324C17.5957 5.66208 17.2266 5.29297 16.7754 5.29297ZM16.1367 7.643H1.86328V6.74452H16.1367V7.643Z"
                        fill=""
                      />
                      <path
                        d="M16.7754 10.1865H1.22461C0.773438 10.1865 0.404297 10.5556 0.404297 11.0068V13.1679C0.404297 13.619 0.773438 13.9881 1.22461 13.9881H16.7754C17.2266 13.9881 17.5957 13.619 17.5957 13.1679V11.0068C17.5957 10.5556 17.2266 10.1865 16.7754 10.1865ZM16.1367 12.5365H1.86328V11.638H16.1367V12.5365Z"
                        fill=""
                      />
                    </svg>
                    Packages
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/bookings"
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:hover:bg-[#004471] dark:hover:bg-meta-4 ${
                      pathname === '/admin/bookings' ? 'bg-graydark dark:bg-meta-4' : ''
                    }`}
                  >
                    <svg
                      className="fill-current"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15.7504 2.90625H14.2879V1.40625C14.2879 1.00781 13.9488 0.65625 13.5504 0.65625C13.1519 0.65625 12.8129 0.996094 12.8129 1.40625V2.90625H5.15035V1.40625C5.15035 1.00781 4.81129 0.65625 4.41285 0.65625C4.01441 0.65625 3.67535 0.996094 3.67535 1.40625V2.90625H2.24941C1.30347 2.90625 0.506348 3.69531 0.506348 4.65625V15.4062C0.506348 16.3516 1.30347 17.1562 2.24941 17.1562H15.7504C16.6964 17.1562 17.4941 16.3516 17.4941 15.4062V4.65625C17.5004 3.69531 16.7027 2.90625 15.7504 2.90625ZM1.95316 7.09375H16.0535V15.4062C16.0535 15.5312 15.9441 15.6562 15.8285 15.6562H2.24941C2.12722 15.6562 2.0066 15.5312 2.0066 15.4062V7.09375H1.95316ZM2.24941 4.34375H3.67535V5.84375C3.67535 6.24219 4.01441 6.59375 4.41285 6.59375C4.81129 6.59375 5.15035 6.24219 5.15035 5.84375V4.34375H12.8129V5.84375C12.8129 6.24219 13.1519 6.59375 13.5504 6.59375C13.9488 6.59375 14.2879 6.24219 14.2879 5.84375V4.34375H15.7504C15.8785 4.34375 16.0066 4.46875 16.0066 4.59375V5.65625H1.95316V4.59375C1.95316 4.46875 2.07378 4.34375 2.24941 4.34375Z"
                        fill=""
                      />
                    </svg>
                    Bookings
                  </NavLink>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;