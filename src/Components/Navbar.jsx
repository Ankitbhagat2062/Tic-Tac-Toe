import React, { useEffect } from 'react'
import '../App.css'
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { CgLogIn } from "react-icons/cg";
import { setCurrentPath } from '../store/navigationSlice';

import useApp from '../hooks/useApp';
import useAuthStore from "../store/useAuthStore";

const Navbar = () => {
    const { token, logout } = useApp();
      const { user, usersProfile } = useAuthStore();
    const location = useLocation();
    const dispatch = useDispatch();
    const currentPath = useSelector((state) => state.navigation.currentPath);

    useEffect(() => {
        dispatch(setCurrentPath(location.pathname));
    }, [location.pathname, dispatch]);

    const userProfile = {
        name: user?.username,
        email: usersProfile?.email,
        imageUrl: usersProfile?.imageUrl,
    }
    const navigation = [
        { name: 'Dashboard', to: '/', current: currentPath === '/' },
        { name: 'About', to: '/about', current: currentPath === '/about' },
        { name: 'Projects', to: '#', current: currentPath === '#' },
        { name: 'Calendar', to: '#', current: currentPath === '#' },
        { name: 'Reports', to: '#', current: currentPath === '#' },
    ]
    const userNavigation = [
        { name: user?.username, to: '/' },
        { name: 'Settings', to: '/setting' },
        { name: 'Sign Out', onClick: logout },
    ]

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
    return (
        <div>
            <Disclosure as="nav" className="bg-gray-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <div className="shrink-0">
                                <img
                                    alt="Your Company"
                                    src="./tic-tac-toe.png"
                                    className="size-8"
                                />
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.to}
                                            aria-current={item.current ? 'page' : undefined}
                                            className={classNames(
                                                item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white',
                                                'rounded-md px-3 py-2 text-sm font-medium',
                                            )}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-4 flex items-center md:ml-6">
                                {token ? (
                                    <>
                                        {/* Profile dropdown */}
                                        <Menu as="div" className="relative ml-3">
                                            <MenuButton className="relative flex h-10 w-10 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                                                <span className="absolute -inset-1.5" />
                                                <span className="sr-only">Open user menu</span>
                                                <img
                                                    alt=""
                                                    src={userProfile.imageUrl}
                                                    className="h-full w-full rounded-full outline-1 outline-white/10 -outline-offset-1 object-cover"
                                                />
                                            </MenuButton>

                                            <MenuItems
                                                transition
                                                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg outline-1 outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                                            >
                                                {userNavigation.map((item) => (
                                                    <MenuItem key={item.name}>
                                                        {item.onClick ? (
                                                            <button
                                                                onClick={item.onClick}
                                                                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden w-full text-left"
                                                            >
                                                                {item.name}
                                                            </button>
                                                        ) : (
                                                            <Link
                                                                to={item.to}
                                                                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                                            >
                                                                {item.name}
                                                            </Link>
                                                        )}
                                                    </MenuItem>
                                                ))}
                                            </MenuItems>
                                        </Menu>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        className="!cursor-pointer flex items-center gap-1 justify-center relative rounded-full p-1 text-gray-400 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
                                    >
                                        <span className="absolute -inset-1.5" />
                                        <span className="">Login</span>
                                        <CgLogIn />
                                    </button>

                                )}

                            </div>
                        </div>
                        <div className="-mr-2 flex md:hidden">
                            {/* Mobile menu button */}
                            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500">
                                <span className="absolute -inset-0.5" />
                                <span className="sr-only">Open main menu</span>
                                <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                                <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                            </DisclosureButton>
                        </div>
                    </div>
                </div>

                <DisclosurePanel className="md:hidden">
                    <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                        {navigation.map((item) => (
                            <DisclosureButton
                                key={item.name}
                                as="a"
                                href={item.to}
                                aria-current={item.current ? 'page' : undefined}
                                className={classNames(
                                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white',
                                    'block rounded-md px-3 py-2 text-base font-medium',
                                )}
                            >
                                {item.name}
                            </DisclosureButton>
                        ))}
                    </div>
                    <div className="border-t border-white/10 pt-4 pb-3">
                        <div className="flex items-center px-5">
                            <div className="shrink-0 size-8">
                                <img
                                    alt="./tic-tac-toe.png"
                                    src={userProfile.imageUrl}
                                    className="h-full w-full rounded-full outline-1 outline-white/10 -outline-offset-1"
                                />
                            </div>
                            <div className="ml-3">
                                <div className="text-base/5 font-medium text-white">{userProfile.name}</div>
                                <div className="text-sm font-medium text-gray-400">{userProfile.email}</div>
                            </div>
                            <button
                                type="button"
                                className="relative ml-auto shrink-0 rounded-full p-1 text-gray-400 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
                            >
                                <span className="absolute -inset-1.5" />
                                <span className="">Login</span>
                                <BellIcon aria-hidden="true" className="size-6" />
                            </button>
                        </div>
                        <div className="mt-3 space-y-1 px-2">
                            {userNavigation.map((item) => {
                                const buttonProps = {
                                    className: "block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-white/5 hover:text-white"
                                };
                                if (item.to) buttonProps.to = item.to;
                                if (item.onClick) buttonProps.onClick = item.onClick;
                                return (
                                    <DisclosureButton
                                        key={item.name}
                                        as={item.onClick ? "button" : "a"}
                                        {...buttonProps}
                                    >
                                        {item.name}
                                    </DisclosureButton>
                                );
                            })}
                        </div>
                    </div>
                </DisclosurePanel>
            </Disclosure>
        </div>
    )
}

export default Navbar
